import { isAxiosError } from 'axios';
import { computed, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ONBOARDING_API_ERROR_MESSAGES,
  ONBOARDING_CARD_OPTIONS,
  ONBOARDING_DEFAULT_VALUES,
  ONBOARDING_ROUTE_NAMES,
} from '@/constants/onboard';
import { toOnboardingAccount } from '@/models/Onboarding';
import type { OnboardingAccount } from '@/types/onboarding';
import { getOnboardingApiErrorMessage } from '@/utils/onboardingApiError';
import {
  getOnboardingAccounts,
  registerOnboardingAccount,
  saveOnboardingWeddingFund,
  selectOnboardingAccounts,
} from '@/server/onboardingApi';

type ActiveOnboardingScreen = 'account' | 'account-selection' | 'couple' | 'wedding-fund';

const ACTIVE_ONBOARDING_SCREENS = [
  'account',
  'account-selection',
  'couple',
  'wedding-fund',
] as const satisfies readonly ActiveOnboardingScreen[];
const DEFAULT_ACTIVE_ONBOARDING_SCREEN: ActiveOnboardingScreen = 'couple';

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

// 계좌 목록 조회 실패가 금융계정 최초 등록 또는 새 기관 추가가 필요한 상태인지 확인한다.
function isFinancialAccountRegistrationRequired(error: unknown) {
  if (!isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  return status === 400 || status === 404;
}

// 온보딩 화면 상태와 단계 이동을 관리한다.
export function useOnboardingFlow() {
  // 현재 라우트와 화면 이동에 사용하는 Vue Router 객체다.
  const route = useRoute();
  const router = useRouter();

  // 계좌 연결과 이후 설정 화면에서 사용하는 입력 상태다.
  const bank = ref<string>(ONBOARDING_DEFAULT_VALUES.bank);
  const cardCompany = ref<string>(ONBOARDING_CARD_OPTIONS[0]);
  const cardLoginId = ref('');
  const cardLoginPassword = ref('');
  const internetBankingId = ref('');
  const internetBankingPassword = ref('');
  const accounts = ref<OnboardingAccount[]>([]);
  const cards = ref<OnboardingAccount[]>([]);
  const selectedAccountNumbers = ref<string[]>([]);
  const selectedCardNumbers = ref<string[]>([]);
  const isAccountConnected = ref(false);
  const isCardConnected = ref(false);
  const isConnectingAccount = ref(false);
  const isSelectingAccounts = ref(false);
  const isSavingWeddingFund = ref(false);
  const weddingFundAmountInWon = ref<number | null>(null);
  const accountConnectionErrorMessage = ref('');
  const cardConnectionErrorMessage = ref('');
  const accountSelectionErrorMessage = ref('');
  const weddingFundErrorMessage = ref('');

  // 화면에서 선택한 백엔드 등록 은행명을 API 요청에 그대로 사용한다.
  const selectedCompany = computed(() => bank.value);

  // URL 쿼리를 검증해 현재 온보딩 화면을 계산한다.
  const screen = computed(() => toOnboardingScreen(route.query.screen));

  // 아이디와 비밀번호가 모두 입력된 영역만 금융기관 조회 대상으로 삼는다.
  const hasAccountCredentials = computed(
    () =>
      internetBankingId.value.trim().length > 0 && internetBankingPassword.value.length > 0
  );
  const hasCardCredentials = computed(
    () => cardLoginId.value.trim().length > 0 && cardLoginPassword.value.length > 0
  );

  // 계좌 또는 카드 중 하나 이상의 인증 정보가 완성되었을 때 연결 버튼을 활성화한다.
  const canContinueAccount = computed(
    () =>
      (hasAccountCredentials.value || hasCardCredentials.value) && !isConnectingAccount.value
  );

  // 조회가 완료된 계좌 또는 카드 중 새 항목을 하나 이상 선택했는지 나타낸다.
  const canContinueAccountSelection = computed(
    () =>
      (isAccountConnected.value || isCardConnected.value) &&
      (selectedAccountNumbers.value.some((selectedNumber) =>
        accounts.value.some(
          (account) => account.accountNumber === selectedNumber && !account.isRegistered
        )
      ) ||
        selectedCardNumbers.value.some((selectedNumber) =>
          cards.value.some((card) => card.accountNumber === selectedNumber && !card.isRegistered)
        )) &&
      !isSelectingAccounts.value
  );

  // 결혼자금이 입력되고 저장 요청 중이 아닐 때 완료 버튼을 활성화한다.
  const canContinueWeddingFund = computed(
    () => weddingFundAmountInWon.value !== null && !isSavingWeddingFund.value
  );

  // 계좌 연결 정보가 변경되면 이전 연결 완료 상태를 해제한다.
  watch([bank, internetBankingId, internetBankingPassword], () => {
    accounts.value = [];
    selectedAccountNumbers.value = [];
    isAccountConnected.value = false;
    accountConnectionErrorMessage.value = '';
    accountSelectionErrorMessage.value = '';
  });

  // 카드 연결 정보가 변경되면 이전 카드 조회 결과만 해제한다.
  watch([cardCompany, cardLoginId, cardLoginPassword], () => {
    cards.value = [];
    selectedCardNumbers.value = [];
    isCardConnected.value = false;
    cardConnectionErrorMessage.value = '';
    accountSelectionErrorMessage.value = '';
  });

  // 결혼자금을 다시 입력하면 이전 저장 오류 안내를 제거한다.
  watch(weddingFundAmountInWon, () => {
    weddingFundErrorMessage.value = '';
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

  // 한 금융기관을 조회하고, 필요할 때만 입력한 인증 정보로 신규 등록한다.
  async function getConnectedAssets(
    company: string,
    loginId: string,
    loginPassword: string,
    credentialsRequiredMessage: string,
    connectionErrorMessage: string,
    emptyMessage: string
  ) {
    try {
      let response: Awaited<ReturnType<typeof getOnboardingAccounts>>;

      try {
        response = await getOnboardingAccounts(company);
      } catch (assetLookupError: unknown) {
        if (!isFinancialAccountRegistrationRequired(assetLookupError)) {
          throw assetLookupError;
        }

        if (loginId.trim().length === 0 || loginPassword.length === 0) {
          return { errorMessage: credentialsRequiredMessage, items: [] };
        }

        await registerOnboardingAccount({
          company,
          id: loginId.trim(),
          password: loginPassword,
        });

        response = await getOnboardingAccounts(company);
      }

      const connectedAssets = response.itemList.map(toOnboardingAccount);

      if (connectedAssets.length === 0) {
        return { errorMessage: emptyMessage, items: [] };
      }

      return { errorMessage: '', items: connectedAssets };
    } catch (error: unknown) {
      return {
        errorMessage: getOnboardingApiErrorMessage(error, connectionErrorMessage),
        items: [],
      };
    }
  }

  // 인증 정보가 완성된 영역만 조회하고, 계좌·카드 중 하나라도 확인되면 선택 화면으로 이동한다.
  async function connectAccount() {
    if (!canContinueAccount.value) {
      return;
    }

    isConnectingAccount.value = true;
    accountConnectionErrorMessage.value = '';
    cardConnectionErrorMessage.value = '';

    try {
      const accountResult = hasAccountCredentials.value
        ? await getConnectedAssets(
            selectedCompany.value,
            internetBankingId.value,
            internetBankingPassword.value,
            ONBOARDING_API_ERROR_MESSAGES.ACCOUNT_CREDENTIALS_REQUIRED,
            ONBOARDING_API_ERROR_MESSAGES.ACCOUNT_CONNECTION,
            '연결 가능한 계좌를 찾지 못했어요.'
          )
        : null;
      const cardResult = hasCardCredentials.value
        ? await getConnectedAssets(
            cardCompany.value,
            cardLoginId.value,
            cardLoginPassword.value,
            '처음 연결하거나 새 카드사를 추가하려면 카드사 아이디와 비밀번호를 입력해주세요.',
            '카드를 불러오지 못했어요. 입력 정보를 확인하고 다시 시도해주세요.',
            '연결 가능한 카드를 찾지 못했어요.'
          )
        : null;

      accounts.value = accountResult?.items ?? [];
      cards.value = cardResult?.items ?? [];
      selectedAccountNumbers.value = [];
      selectedCardNumbers.value = [];
      isAccountConnected.value = accounts.value.length > 0;
      isCardConnected.value = cards.value.length > 0;
      accountConnectionErrorMessage.value = accountResult?.errorMessage ?? '';
      cardConnectionErrorMessage.value = cardResult?.errorMessage ?? '';

      if (
        (isAccountConnected.value || isCardConnected.value) &&
        isCurrentOnboardingScreen('account')
      ) {
        goToScreen('account-selection');
      }
    } catch (error: unknown) {
      accounts.value = [];
      cards.value = [];
      selectedAccountNumbers.value = [];
      selectedCardNumbers.value = [];
      isAccountConnected.value = false;
      isCardConnected.value = false;
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
    const account = accounts.value.find(
      (connectedAccount) => connectedAccount.accountNumber === accountNumber
    );
    if (!account || account.isRegistered || isSelectingAccounts.value) {
      return;
    }

    selectedAccountNumbers.value = selectedAccountNumbers.value.includes(accountNumber)
      ? selectedAccountNumbers.value.filter((selectedNumber) => selectedNumber !== accountNumber)
      : [...selectedAccountNumbers.value, accountNumber];
  }

  // 현재 카드의 선택 여부를 반대로 변경한다.
  function toggleCard(cardNumber: string) {
    const card = cards.value.find((connectedCard) => connectedCard.accountNumber === cardNumber);
    if (!card || card.isRegistered || isSelectingAccounts.value) {
      return;
    }

    selectedCardNumbers.value = selectedCardNumbers.value.includes(cardNumber)
      ? selectedCardNumbers.value.filter((selectedNumber) => selectedNumber !== cardNumber)
      : [...selectedCardNumbers.value, cardNumber];
  }

  // 선택한 한 기관의 신규 자산을 저장하고 저장 완료 항목을 비활성화한다.
  async function saveSelectedAssets(
    company: string,
    assets: Ref<OnboardingAccount[]>,
    selectedNumbers: Ref<string[]>
  ) {
    const selectedItems = assets.value
      .filter((asset) => !asset.isRegistered && selectedNumbers.value.includes(asset.accountNumber))
      .map((asset) => ({
        name: asset.accountName,
        number: asset.accountNumber,
      }));

    if (selectedItems.length === 0) {
      return;
    }

    await selectOnboardingAccounts({ company, selectedItems });

    const savedNumbers = new Set(selectedItems.map((item) => item.number));
    assets.value = assets.value.map((asset) =>
      savedNumbers.has(asset.accountNumber) ? { ...asset, isRegistered: true } : asset
    );
    selectedNumbers.value = [];
  }

  // 선택한 신규 계좌와 카드를 기관별로 저장한 뒤 결혼자금 입력 화면으로 이동한다.
  async function selectConnectedAccounts() {
    if (!canContinueAccountSelection.value) {
      return;
    }

    isSelectingAccounts.value = true;
    accountSelectionErrorMessage.value = '';

    try {
      await saveSelectedAssets(selectedCompany.value, accounts, selectedAccountNumbers);
      await saveSelectedAssets(cardCompany.value, cards, selectedCardNumbers);

      if (isCurrentOnboardingScreen('account-selection')) {
        goToScreen('wedding-fund');
      }
    } catch (error: unknown) {
      accountSelectionErrorMessage.value = getOnboardingApiErrorMessage(
        error,
        '선택한 계좌와 카드를 저장하지 못했어요. 다시 시도해주세요.'
      );
    } finally {
      isSelectingAccounts.value = false;
    }
  }

  // 현재까지 모은 결혼자금을 원 단위 문자열로 저장한 뒤 홈으로 이동한다.
  async function completeWeddingFund() {
    const weddingFund = weddingFundAmountInWon.value;

    if (weddingFund === null || isSavingWeddingFund.value) {
      return;
    }

    isSavingWeddingFund.value = true;
    weddingFundErrorMessage.value = '';

    try {
      const response = await saveOnboardingWeddingFund({
        weddingFund: String(weddingFund),
      });

      if (!response.success) {
        weddingFundErrorMessage.value =
          response.message || '결혼자금을 저장하지 못했어요. 다시 시도해주세요.';
        return;
      }

      if (isCurrentOnboardingScreen('wedding-fund')) {
        goHome();
      }
    } catch (error: unknown) {
      weddingFundErrorMessage.value = getOnboardingApiErrorMessage(
        error,
        '결혼자금을 저장하지 못했어요. 다시 시도해주세요.'
      );
    } finally {
      isSavingWeddingFund.value = false;
    }
  }

  // 계좌 연결 하위 화면은 바로 전 화면으로 돌아가고, 그 외 화면에서는 홈으로 이동한다.
  function goBack() {
    if (screen.value === 'wedding-fund') {
      goToScreen('account-selection');
      return;
    }

    if (screen.value === 'account-selection') {
      goToScreen('account');
      return;
    }

    goHome();
  }

  // 온보딩을 종료하고 홈 화면으로 이동한다.
  function goHome() {
    router.push({ name: ONBOARDING_ROUTE_NAMES.HOME });
  }

  // 커플 연결 설정을 마치면 홈 체크리스트로 돌아간다.
  function continueFromCouple() {
    goHome();
  }

  // 화면에서 사용할 상태와 동작만 공개한다.
  return {
    accountConnectionErrorMessage,
    accountSelectionErrorMessage,
    accounts,
    bank,
    cardCompany,
    cardConnectionErrorMessage,
    cardLoginId,
    cardLoginPassword,
    cards,
    canContinueAccount,
    canContinueAccountSelection,
    canContinueWeddingFund,
    completeWeddingFund,
    connectAccount,
    continueFromCouple,
    goBack,
    goHome,
    internetBankingId,
    internetBankingPassword,
    isConnectingAccount,
    isSavingWeddingFund,
    isSelectingAccounts,
    screen,
    selectConnectedAccounts,
    selectedAccountNumbers,
    selectedCardNumbers,
    toggleAccount,
    toggleCard,
    weddingFundAmountInWon,
    weddingFundErrorMessage,
  };
}
