<script setup lang="ts">
import { computed } from 'vue';
import AuthScreen from '@/components/auth/AuthScreen.vue';
import Loading from '@/components/common/Loading.vue';
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
  goHome,
  internetBankingId,
  internetBankingPassword,
  isConnectingAccount,
  isSelectingAccounts,
  screen,
  selectConnectedAccounts,
  selectedAccountNumbers,
  selectedCardNumbers,
  toggleAccount,
  toggleCard,
  weddingFundAmount,
} = useOnboardingFlow();

// 현재 커플 연결 단계가 화면에 표시되고 있는지 나타낸다.
const isCoupleStepActive = computed(() => screen.value === 'couple');

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
      v-if="isConnectingAccount || isSelectingAccounts"
      :label="
        isConnectingAccount
          ? '계좌와 카드를 불러오는 중이에요'
          : '선택한 계좌와 카드를 저장하는 중이에요'
      "
    />

    <!-- 공통 헤더와 하단 내비게이션을 사용하지 않는 온보딩 전용 화면 -->
    <div
      class="mx-auto flex min-h-full w-full max-w-[480px] flex-1 flex-col overflow-hidden bg-dm-gray-light sm:border-x sm:border-dm-gray/20"
    >
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
        @back="goBack"
        @confirm="confirmInviteCode"
        @copy-my-invite-code="copyMyInviteCode"
        @retry-my-invite-code="loadMyInviteCode"
        @retry-status="loadCoupleStatus"
        @skip="goHome"
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
        @back="goBack"
        @connect="connectAccount"
        @skip="goHome"
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
        @back="goBack"
        @skip="goHome"
        @toggle="toggleAccount"
        @toggle-card="toggleCard"
        @next="selectConnectedAccounts"
      />

      <WeddingFundStep
        v-else-if="screen === 'wedding-fund'"
        v-model:amount="weddingFundAmount"
        :can-continue="canContinueWeddingFund"
        @back="goBack"
        @next="completeWeddingFund"
        @skip="goHome"
      />
    </div>
  </AuthScreen>
</template>
