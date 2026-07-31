import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAccounts, selectAccounts, updateShareScope } from '@/apis/onboardingApi';
import {
  ONBOARDING_API_ERROR_MESSAGES,
  ONBOARDING_BANK_OPTIONS,
  ONBOARDING_DEFAULT_VALUES,
  ONBOARDING_PREVIOUS_SCREENS,
  ONBOARDING_ROUTE_NAMES,
  ONBOARDING_SCREENS,
  ONBOARDING_SHARE_LEVELS,
} from '@/constants/onboard';
import { toOnboardingAccount } from '@/models/Onboarding';
import type {
  CoupleRole,
  FinancialVisibility,
  OnboardingAccount,
  OnboardingScreen,
} from '@/types/onboarding';
import { getOnboardingApiErrorMessage } from '@/utils/onboardingApiError';

// 라우트 쿼리값이 문자열일 때만 값을 반환한다.
function getQueryValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

// 쿼리값이 지원하는 온보딩 화면인지 확인한다.
function isOnboardingScreen(value: string): value is OnboardingScreen {
  return ONBOARDING_SCREENS.some((screen) => screen === value);
}

// 잘못된 화면 쿼리값은 첫 단계로 변환한다.
function toOnboardingScreen(value: unknown): OnboardingScreen {
  // 배열 등 잘못된 쿼리 형식을 제거한 문자열 값이다.
  const queryValue = getQueryValue(value);
  return isOnboardingScreen(queryValue) ? queryValue : ONBOARDING_DEFAULT_VALUES.screen;
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
  const bankCode = ref('');
  const selectedAccountIds = ref<number[]>([]);
  const isAccountConnected = ref(false);
  const isConnectingAccount = ref(false);
  const isSelectingAccounts = ref(false);
  const isUpdatingShareScope = ref(false);
  const accountConnectionErrorMessage = ref('');
  const accountSelectionErrorMessage = ref('');
  const privacyErrorMessage = ref('');
  const financialVisibility = ref<FinancialVisibility>(
    ONBOARDING_DEFAULT_VALUES.financialVisibility
  );
  const role = ref<CoupleRole>(ONBOARDING_DEFAULT_VALUES.role);

  // 선택한 은행명에 대응하는 API 요청용 은행 정보다.
  const selectedBankOption = computed(
    () =>
      ONBOARDING_BANK_OPTIONS.find((bankOption) => bankOption.label === bank.value) ??
      ONBOARDING_BANK_OPTIONS[0]
  );

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
      selectedAccountIds.value.some((selectedId) =>
        accounts.value.some((account) => account.accountId === selectedId)
      ) &&
      !isSelectingAccounts.value
  );

  // 계좌 연결 정보가 변경되면 이전 연결 완료 상태를 해제한다.
  watch([bank, internetBankingId, internetBankingPassword], () => {
    accounts.value = [];
    bankCode.value = '';
    selectedAccountIds.value = [];
    isAccountConnected.value = false;
    accountConnectionErrorMessage.value = '';
    accountSelectionErrorMessage.value = '';
  });

  // 지정한 온보딩 화면으로 이동한다.
  function goToScreen(nextScreen: OnboardingScreen) {
    router.push({
      name: ONBOARDING_ROUTE_NAMES.ONBOARDING,
      query: { screen: nextScreen },
    });
  }

  // 요청 시작 화면에 그대로 머물러 있는지 확인한다.
  function isCurrentOnboardingScreen(expectedScreen: OnboardingScreen) {
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
      // API 명세에 맞춰 전달하는 인터넷뱅킹 계좌 조회 요청이다.
      const response = await getAccounts({
        company: selectedBankOption.value.company,
        id: internetBankingId.value.trim(),
        password: internetBankingPassword.value,
      });
      // 계좌 조회 DTO를 화면에서 사용하는 계좌 목록으로 변환한다.
      const connectedAccounts = response.accounts.map(toOnboardingAccount);

      if (connectedAccounts.length === 0) {
        isAccountConnected.value = false;
        accountConnectionErrorMessage.value = '연결 가능한 계좌를 찾지 못했어요.';
        return;
      }

      accounts.value = connectedAccounts;
      bankCode.value = response.bankCode || selectedBankOption.value.bankCode;
      selectedAccountIds.value = [];
      isAccountConnected.value = true;

      if (isCurrentOnboardingScreen('account')) {
        goToScreen('account-selection');
      }
    } catch (error: unknown) {
      accounts.value = [];
      bankCode.value = '';
      selectedAccountIds.value = [];
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
  function toggleAccount(accountId: number) {
    selectedAccountIds.value = selectedAccountIds.value.includes(accountId)
      ? selectedAccountIds.value.filter((selectedId) => selectedId !== accountId)
      : [...selectedAccountIds.value, accountId];
  }

  // 선택한 계좌를 서버에 저장한 뒤 커플 연결 단계로 이동한다.
  async function selectConnectedAccounts() {
    if (!canContinueAccountSelection.value) {
      return;
    }

    isSelectingAccounts.value = true;
    accountSelectionErrorMessage.value = '';

    try {
      await selectAccounts({
        bankCode: bankCode.value,
        accountIds: selectedAccountIds.value,
      });

      if (isCurrentOnboardingScreen('account-selection')) {
        goToScreen('couple');
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

  // 선택한 공개범위를 서버에 저장한 뒤 역할 선택 단계로 이동한다.
  async function saveFinancialVisibility() {
    if (isUpdatingShareScope.value) {
      return;
    }

    isUpdatingShareScope.value = true;
    privacyErrorMessage.value = '';

    try {
      await updateShareScope({
        shareLevel: ONBOARDING_SHARE_LEVELS[financialVisibility.value],
      });

      if (isCurrentOnboardingScreen('privacy')) {
        goToScreen('role');
      }
    } catch (error: unknown) {
      privacyErrorMessage.value = getOnboardingApiErrorMessage(
        error,
        ONBOARDING_API_ERROR_MESSAGES.SHARE_SCOPE
      );
    } finally {
      isUpdatingShareScope.value = false;
    }
  }

  // 현재 단계의 이전 온보딩 화면으로 이동한다.
  function goBack() {
    // 뒤로가기 기준이 되는 현재 온보딩 화면이다.
    const currentScreen = screen.value;

    if (currentScreen === 'account') {
      router.push({ name: ONBOARDING_ROUTE_NAMES.SIGNUP });
      return;
    }

    goToScreen(ONBOARDING_PREVIOUS_SCREENS[currentScreen]);
  }

  // 온보딩을 종료하고 홈 화면으로 이동한다.
  function goHome() {
    router.push({ name: ONBOARDING_ROUTE_NAMES.HOME });
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
    financialVisibility,
    goBack,
    goHome,
    goToScreen,
    internetBankingId,
    internetBankingPassword,
    isConnectingAccount,
    isSelectingAccounts,
    isUpdatingShareScope,
    privacyErrorMessage,
    role,
    saveFinancialVisibility,
    screen,
    selectConnectedAccounts,
    selectedAccountIds,
    toggleAccount,
  };
}
