import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ONBOARDING_API_ERROR_MESSAGES,
  ONBOARDING_BANK_OPTIONS,
  ONBOARDING_DEFAULT_VALUES,
  ONBOARDING_ROUTE_NAMES,
} from '@/constants/onboard';
import { toOnboardingAccount, toOnboardingCompany } from '@/models/Onboarding';
import type { OnboardingAccount } from '@/types/onboarding';
import { getOnboardingApiErrorMessage } from '@/utils/onboardingApiError';
import {
  getOnboardingAccounts,
  registerOnboardingAccount,
  selectOnboardingAccounts,
} from '@/server/onboardingApi';

type ActiveOnboardingScreen = 'account' | 'account-selection' | 'couple';

const ACTIVE_ONBOARDING_SCREENS = [
  'account',
  'account-selection',
  'couple',
] as const satisfies readonly ActiveOnboardingScreen[];
const DEFAULT_ACTIVE_ONBOARDING_SCREEN: ActiveOnboardingScreen = 'couple';

const ACTIVE_PREVIOUS_SCREENS = {
  account: 'couple',
  'account-selection': 'account',
} as const satisfies Record<Exclude<ActiveOnboardingScreen, 'couple'>, ActiveOnboardingScreen>;

// 라우트 쿼리값이 문자열일 때만 값을 반환한다.
function getQueryValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

// 쿼리값이 지원하는 온보딩 화면인지 확인한다.
function isOnboardingScreen(value: string): value is ActiveOnboardingScreen {
  return ACTIVE_ONBOARDING_SCREENS.some((screen) => screen === value);
}

// 잘못된 화면 쿼리값은 첫 단계로 변환한다.
function toOnboardingScreen(value: unknown): ActiveOnboardingScreen {
  // 배열 등 잘못된 쿼리 형식을 제거한 문자열 값이다.
  const queryValue = getQueryValue(value);
  return isOnboardingScreen(queryValue) ? queryValue : DEFAULT_ACTIVE_ONBOARDING_SCREEN;
}

// 온보딩 화면 상태와 단계 이동을 관리한다.
export function useOnboardingFlow() {
  // 현재 라우트와 화면 이동에 사용하는 Vue Router 객체다.
  const route = useRoute();
  const router = useRouter();

  // 계좌 연결과 이후 설정 화면에서 사용하는 입력 상태다.
  const bank = ref<string>(ONBOARDING_DEFAULT_VALUES.bank);
  const internetBankingId = ref('');
  const internetBankingPassword = ref('');
  const accounts = ref<OnboardingAccount[]>([]);
  const selectedAccountNumbers = ref<string[]>([]);
  const isFinancialAccountRegistered = ref(false);
  const isAccountConnected = ref(false);
  const isConnectingAccount = ref(false);
  const isSelectingAccounts = ref(false);
  const accountConnectionErrorMessage = ref('');
  const accountSelectionErrorMessage = ref('');

  // 선택한 은행명에 대응하는 API 요청용 은행 정보다.
  const selectedBankOption = computed(
    () =>
      ONBOARDING_BANK_OPTIONS.find((bankOption) => bankOption.label === bank.value) ??
      ONBOARDING_BANK_OPTIONS[0]
  );

  // 백엔드 금융기관 Enum에 맞춘 API 요청용 기관명이다.
  const selectedCompany = computed(() => toOnboardingCompany(selectedBankOption.value.label));

  // URL 쿼리를 검증해 현재 온보딩 화면을 계산한다.
  const screen = computed(() => toOnboardingScreen(route.query.screen));

  // 계좌 연결 화면의 다음 버튼 활성화 여부다.
  const canContinueAccount = computed(
    () =>
      bank.value.length > 0 &&
      internetBankingId.value.trim().length > 0 &&
      internetBankingPassword.value.length > 0 &&
      !isConnectingAccount.value
  );

  // 계좌 연결이 완료되고 조회된 계좌를 하나 이상 선택했는지 나타낸다.
  const canContinueAccountSelection = computed(
    () =>
      isAccountConnected.value &&
      selectedAccountNumbers.value.some((selectedNumber) =>
        accounts.value.some((account) => account.accountNumber === selectedNumber)
      ) &&
      !isSelectingAccounts.value
  );

  // 계좌 연결 정보가 변경되면 이전 연결 완료 상태를 해제한다.
  watch([bank, internetBankingId, internetBankingPassword], () => {
    accounts.value = [];
    selectedAccountNumbers.value = [];
    isFinancialAccountRegistered.value = false;
    isAccountConnected.value = false;
    accountConnectionErrorMessage.value = '';
    accountSelectionErrorMessage.value = '';
  });

  // 지정한 온보딩 화면으로 이동한다.
  function goToScreen(nextScreen: ActiveOnboardingScreen) {
    router.push({
      name: ONBOARDING_ROUTE_NAMES.ONBOARDING,
      query: { screen: nextScreen },
    });
  }

  // 요청 시작 화면에 그대로 머물러 있는지 확인한다.
  function isCurrentOnboardingScreen(expectedScreen: ActiveOnboardingScreen) {
    return route.name === ONBOARDING_ROUTE_NAMES.ONBOARDING && screen.value === expectedScreen;
  }

  // 입력 정보와 조회된 계좌를 확인한 뒤에만 계좌 선택 화면으로 이동한다.
  async function connectAccount() {
    if (!canContinueAccount.value) {
      return;
    }

    isConnectingAccount.value = true;
    accountConnectionErrorMessage.value = '';

    try {
      // 동일한 입력으로 목록 조회만 재시도할 때 CODEF 계정을 중복 등록하지 않는다.
      if (!isFinancialAccountRegistered.value) {
        await registerOnboardingAccount({
          company: selectedCompany.value,
          id: internetBankingId.value.trim(),
          password: internetBankingPassword.value,
        });
        isFinancialAccountRegistered.value = true;
      }

      const response = await getOnboardingAccounts(selectedCompany.value);
      // 계좌 조회 DTO를 화면에서 사용하는 계좌 목록으로 변환한다.
      const connectedAccounts = response.itemList.map(toOnboardingAccount);

      if (connectedAccounts.length === 0) {
        isAccountConnected.value = false;
        accountConnectionErrorMessage.value = '연결 가능한 계좌를 찾지 못했어요.';
        return;
      }

      accounts.value = connectedAccounts;
      selectedAccountNumbers.value = [];
      isAccountConnected.value = true;

      if (isCurrentOnboardingScreen('account')) {
        goToScreen('account-selection');
      }
    } catch (error: unknown) {
      accounts.value = [];
      selectedAccountNumbers.value = [];
      isAccountConnected.value = false;
      accountConnectionErrorMessage.value = getOnboardingApiErrorMessage(
        error,
        ONBOARDING_API_ERROR_MESSAGES.ACCOUNT_CONNECTION
      );
    } finally {
      isConnectingAccount.value = false;
    }
  }

  // 현재 계좌의 선택 여부를 반대로 변경한다.
  function toggleAccount(accountNumber: string) {
    selectedAccountNumbers.value = selectedAccountNumbers.value.includes(accountNumber)
      ? selectedAccountNumbers.value.filter((selectedNumber) => selectedNumber !== accountNumber)
      : [...selectedAccountNumbers.value, accountNumber];
  }

  // 선택한 계좌를 서버에 저장한 뒤 온보딩을 종료한다.
  async function selectConnectedAccounts() {
    if (!canContinueAccountSelection.value) {
      return;
    }

    isSelectingAccounts.value = true;
    accountSelectionErrorMessage.value = '';

    try {
      await selectOnboardingAccounts({
        company: selectedCompany.value,
        selectedNumbers: selectedAccountNumbers.value,
      });

      if (isCurrentOnboardingScreen('account-selection')) {
        goHome();
      }
    } catch (error: unknown) {
      accountSelectionErrorMessage.value = getOnboardingApiErrorMessage(
        error,
        ONBOARDING_API_ERROR_MESSAGES.ACCOUNT_SELECTION
      );
    } finally {
      isSelectingAccounts.value = false;
    }
  }

  // 현재 단계의 이전 온보딩 화면으로 이동한다.
  function goBack() {
    // 뒤로가기 기준이 되는 현재 온보딩 화면이다.
    const currentScreen = screen.value;

    if (currentScreen === 'couple') {
      router.push({ name: ONBOARDING_ROUTE_NAMES.HOME });
      return;
    }

    goToScreen(ACTIVE_PREVIOUS_SCREENS[currentScreen]);
  }

  // 온보딩을 종료하고 홈 화면으로 이동한다.
  function goHome() {
    router.push({ name: ONBOARDING_ROUTE_NAMES.HOME });
  }

  // 커플 연결을 마치면 계좌 연결 단계로 이동한다.
  function continueFromCouple() {
    goToScreen('account');
  }

  // 화면에서 사용할 상태와 동작만 공개한다.
  return {
    accountConnectionErrorMessage,
    accountSelectionErrorMessage,
    accounts,
    bank,
    canContinueAccount,
    canContinueAccountSelection,
    connectAccount,
    continueFromCouple,
    goBack,
    goHome,
    internetBankingId,
    internetBankingPassword,
    isConnectingAccount,
    isSelectingAccounts,
    screen,
    selectConnectedAccounts,
    selectedAccountNumbers,
    toggleAccount,
  };
}
