import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ONBOARDING_DEFAULT_VALUES,
  ONBOARDING_PREVIOUS_SCREENS,
  ONBOARDING_ROUTE_NAMES,
  ONBOARDING_SCREENS,
} from '@/constants/onboard';
import type {
  CoupleRole,
  FinancialVisibility,
  OnboardingScreen,
  PublishingAccount,
} from '@/types/onboarding';

// 테스트 데이터 파일이 없어도 빌드할 수 있도록 계좌 데이터를 선택적으로 불러온다.
const PUBLISHING_ACCOUNT_MODULES = import.meta.glob<{
  default: readonly PublishingAccount[];
}>('../mocks/onboardingAccount.ts', { eager: true });

// 테스트 데이터 파일을 제외한 환경에서는 빈 계좌 목록을 사용한다.
const PUBLISHING_ACCOUNTS = Object.values(PUBLISHING_ACCOUNT_MODULES)[0]?.default ?? [];

// 현재 조회 가능한 계좌에 포함된 기본 선택 계좌만 반환한다.
function getInitialSelectedAccountIds() {
  // 임시 계좌 목록에서 실제로 존재하는 계좌 식별자다.
  const publishingAccountIds = new Set(PUBLISHING_ACCOUNTS.map((account) => account.accountId));

  return ONBOARDING_DEFAULT_VALUES.selectedAccountIds.filter((accountId) =>
    publishingAccountIds.has(accountId)
  );
}

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
  const selectedAccountIds = ref<number[]>(getInitialSelectedAccountIds());
  const isAccountConnected = ref(false);
  const accountConnectionErrorMessage = ref('');
  const financialVisibility = ref<FinancialVisibility>(
    ONBOARDING_DEFAULT_VALUES.financialVisibility
  );
  const role = ref<CoupleRole>(ONBOARDING_DEFAULT_VALUES.role);

  // URL 쿼리를 검증해 현재 온보딩 화면을 계산한다.
  const screen = computed(() => toOnboardingScreen(route.query.screen));

  // 계좌 연결 화면의 다음 버튼 활성화 여부다.
  const canContinueAccount = computed(
    () =>
      bank.value.length > 0 &&
      internetBankingId.value.trim().length > 0 &&
      internetBankingPassword.value.length > 0
  );

  // 계좌 연결이 완료되고 조회된 계좌를 하나 이상 선택했는지 나타낸다.
  const canContinueAccountSelection = computed(
    () =>
      isAccountConnected.value &&
      selectedAccountIds.value.some((selectedId) =>
        PUBLISHING_ACCOUNTS.some((account) => account.accountId === selectedId)
      )
  );

  // 계좌 연결 정보가 변경되면 이전 연결 완료 상태를 해제한다.
  watch([bank, internetBankingId, internetBankingPassword], () => {
    isAccountConnected.value = false;
    accountConnectionErrorMessage.value = '';
  });

  // 지정한 온보딩 화면으로 이동한다.
  function goToScreen(nextScreen: OnboardingScreen) {
    router.push({
      name: ONBOARDING_ROUTE_NAMES.ONBOARDING,
      query: { screen: nextScreen },
    });
  }

  // 입력 정보와 조회된 계좌를 확인한 뒤에만 계좌 선택 화면으로 이동한다.
  function connectAccount() {
    if (!canContinueAccount.value) {
      return;
    }

    if (PUBLISHING_ACCOUNTS.length === 0) {
      isAccountConnected.value = false;
      accountConnectionErrorMessage.value = '연결 가능한 계좌를 찾지 못했어요.';
      return;
    }

    isAccountConnected.value = true;
    accountConnectionErrorMessage.value = '';
    goToScreen('account-selection');
  }

  // 현재 계좌의 선택 여부를 반대로 변경한다.
  function toggleAccount(accountId: number) {
    selectedAccountIds.value = selectedAccountIds.value.includes(accountId)
      ? selectedAccountIds.value.filter((selectedId) => selectedId !== accountId)
      : [...selectedAccountIds.value, accountId];
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
    accounts: PUBLISHING_ACCOUNTS,
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
    role,
    screen,
    selectedAccountIds,
    toggleAccount,
  };
}
