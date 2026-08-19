<script setup lang="ts">
import { computed } from 'vue';
import AuthScreen from '@/components/auth/AuthScreen.vue';
import Loading from '@/components/common/Loading.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import AccountConnectionStep from '@/components/onboarding/AccountConnectionStep.vue';
import AccountSelectionStep from '@/components/onboarding/AccountSelectionStep.vue';
import CoupleConnectionStep from '@/components/onboarding/CoupleConnectionStep.vue';
import WeddingFundStep from '@/components/onboarding/WeddingFundStep.vue';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useOnboardingCouple } from '@/composables/useOnboardingCouple';
import { useOnboardingFlow } from '@/composables/useOnboardingFlow';

useAuthCheck();

// 온보딩 전체 단계에서 공유하는 상태와 화면 이동 동작이다.
const {
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
  connectAccount,
  completeWeddingFund,
  continueFromCouple,
  goBack,
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
} = useOnboardingFlow();

// 현재 커플 연결 단계가 화면에 표시되고 있는지 나타낸다.
const isCoupleStepActive = computed(() => screen.value === 'couple');

// 현재 온보딩 단계에 맞는 공통 헤더 제목이다.
const onboardingHeaderTitle = computed(
  () =>
    ({
      account: '계좌·카드 연결',
      'account-selection': '계좌·카드 선택',
      couple: '커플 연결',
      'wedding-fund': '결혼자금 입력',
    })[screen.value]
);

// 커플 연결 단계에서 사용하는 서버 상태와 API 동작이다.
const {
  acceptRequest,
  acceptingUserIds,
  canConfirm,
  confirmInviteCode,
  copyMyInviteCode,
  errorMessage: coupleErrorMessage,
  feedbackMessage,
  hasMyInviteCodeCopyError,
  hasInviteCodeError,
  inviteCode,
  isConnected,
  isInviting,
  isLoadingMyInviteCode,
  isLoadingStatus,
  loadCoupleStatus,
  loadMyInviteCode,
  myInviteCode,
  myInviteCodeCopyMessage,
  myInviteCodeErrorMessage,
  requests,
  statusErrorMessage,
} = useOnboardingCouple(isCoupleStepActive);
</script>

<template>
  <AuthScreen class="!bg-white [&>section]:!bg-white">
    <Loading
      v-if="isConnectingAccount || isSelectingAccounts || isSavingWeddingFund"
      :label="
        isConnectingAccount
          ? '계좌와 카드를 불러오는 중이에요'
          : isSelectingAccounts
            ? '선택한 계좌와 카드를 저장하는 중이에요'
            : '결혼자금을 저장하는 중이에요'
      "
    />

    <!-- 전역 body 너비를 그대로 따르는 온보딩 화면 -->
    <div class="flex min-h-full flex-1 flex-col overflow-hidden bg-white">
      <PageHeader
        :title="onboardingHeaderTitle"
        :on-back="goBack"
      />

      <CoupleConnectionStep
        v-if="screen === 'couple'"
        v-model:invite-code="inviteCode"
        :accepting-user-ids="acceptingUserIds"
        :can-confirm="canConfirm"
        :error-message="coupleErrorMessage"
        :feedback-message="feedbackMessage"
        :has-my-invite-code-copy-error="hasMyInviteCodeCopyError"
        :has-invite-code-error="hasInviteCodeError"
        :is-connected="isConnected"
        :is-inviting="isInviting"
        :is-loading-my-invite-code="isLoadingMyInviteCode"
        :is-loading-status="isLoadingStatus"
        :my-invite-code="myInviteCode"
        :my-invite-code-copy-message="myInviteCodeCopyMessage"
        :my-invite-code-error-message="myInviteCodeErrorMessage"
        :requests="requests"
        :status-error-message="statusErrorMessage"
        @accept="acceptRequest"
        @confirm="confirmInviteCode"
        @copy-my-invite-code="copyMyInviteCode"
        @retry-my-invite-code="loadMyInviteCode"
        @retry-status="loadCoupleStatus"
        @next="continueFromCouple"
      />

      <AccountConnectionStep
        v-else-if="screen === 'account'"
        v-model:bank="bank"
        v-model:card-company="cardCompany"
        v-model:card-login-id="cardLoginId"
        v-model:card-login-password="cardLoginPassword"
        v-model:internet-banking-id="internetBankingId"
        v-model:internet-banking-password="internetBankingPassword"
        :card-connection-error-message="cardConnectionErrorMessage"
        :can-continue="canContinueAccount"
        :connection-error-message="accountConnectionErrorMessage"
        :is-loading="isConnectingAccount"
        @connect="connectAccount"
      />

      <AccountSelectionStep
        v-else-if="screen === 'account-selection'"
        :accounts="accounts"
        :bank="bank"
        :can-continue="canContinueAccountSelection"
        :card-company="cardCompany"
        :cards="cards"
        :error-message="accountSelectionErrorMessage"
        :is-loading="isSelectingAccounts"
        :selected-account-numbers="selectedAccountNumbers"
        :selected-card-numbers="selectedCardNumbers"
        @toggle="toggleAccount"
        @toggle-card="toggleCard"
        @next="selectConnectedAccounts"
      />

      <WeddingFundStep
        v-else-if="screen === 'wedding-fund'"
        v-model:amount-in-won="weddingFundAmountInWon"
        :can-continue="canContinueWeddingFund"
        :error-message="weddingFundErrorMessage"
        :is-loading="isSavingWeddingFund"
        @next="completeWeddingFund"
      />
    </div>
  </AuthScreen>
</template>
