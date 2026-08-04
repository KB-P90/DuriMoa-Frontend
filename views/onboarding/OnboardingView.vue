<script setup lang="ts">
import { computed } from 'vue';
import AuthScreen from '@/components/auth/AuthScreen.vue';
import AccountConnectionStep from '@/components/onboarding/AccountConnectionStep.vue';
import AccountSelectionStep from '@/components/onboarding/AccountSelectionStep.vue';
import CoupleConnectionStep from '@/components/onboarding/CoupleConnectionStep.vue';
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
  selectedAccountIds,
  toggleAccount,
} = useOnboardingFlow();

// 현재 커플 연결 단계가 화면에 표시되고 있는지 나타낸다.
const isCoupleStepActive = computed(() => screen.value === 'couple');

// 커플 연결 단계에서 사용하는 서버 상태와 API 동작이다.
const {
  acceptRequest,
  acceptingUserIds,
  canConfirm,
  confirmInviteCode,
  errorMessage: coupleErrorMessage,
  feedbackMessage,
  hasInviteCodeError,
  inviteCode,
  isConnected,
  isInviting,
  isLoadingStatus,
  loadCoupleStatus,
  requests,
  statusErrorMessage,
} = useOnboardingCouple(isCoupleStepActive);
</script>

<template>
  <AuthScreen>
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
        :has-invite-code-error="hasInviteCodeError"
        :is-connected="isConnected"
        :is-inviting="isInviting"
        :is-loading-status="isLoadingStatus"
        :requests="requests"
        :status-error-message="statusErrorMessage"
        @accept="acceptRequest"
        @back="goBack"
        @confirm="confirmInviteCode"
        @retry-status="loadCoupleStatus"
        @skip="goHome"
        @next="continueFromCouple"
      />

      <AccountConnectionStep
        v-else-if="screen === 'account'"
        v-model:bank="bank"
        v-model:internet-banking-id="internetBankingId"
        v-model:internet-banking-password="internetBankingPassword"
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
        :error-message="accountSelectionErrorMessage"
        :is-loading="isSelectingAccounts"
        :selected-account-ids="selectedAccountIds"
        @back="goBack"
        @skip="goHome"
        @toggle="toggleAccount"
        @next="selectConnectedAccounts"
      />
    </div>
  </AuthScreen>
</template>
