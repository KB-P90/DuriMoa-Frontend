<script setup lang="ts">
import AuthScreen from '@/components/auth/AuthScreen.vue';
import AccountConnectionStep from '@/components/onboarding/AccountConnectionStep.vue';
import AccountSelectionStep from '@/components/onboarding/AccountSelectionStep.vue';
import CoupleConnectionStep from '@/components/onboarding/CoupleConnectionStep.vue';
import PrivacyScopeStep from '@/components/onboarding/PrivacyScopeStep.vue';
import RoleSelectionStep from '@/components/onboarding/RoleSelectionStep.vue';
import { useOnboardingFlow } from '@/composables/useOnboardingFlow';

// 온보딩 전체 단계에서 공유하는 상태와 화면 이동 동작이다.
const {
  accounts,
  bank,
  canContinueAccount,
  canContinueAccountSelection,
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
} = useOnboardingFlow();
</script>

<template>
  <AuthScreen>
    <!-- 공통 헤더와 하단 내비게이션을 사용하지 않는 온보딩 전용 화면 -->
    <div
      class="mx-auto flex min-h-full w-full max-w-[480px] flex-1 flex-col overflow-hidden bg-dm-gray-light sm:border-x sm:border-dm-gray/20"
    >
      <AccountConnectionStep
        v-if="screen === 'account'"
        v-model:bank="bank"
        v-model:internet-banking-id="internetBankingId"
        v-model:internet-banking-password="internetBankingPassword"
        :can-continue="canContinueAccount"
        @back="goBack"
        @next="goToScreen('account-selection')"
      />

      <AccountSelectionStep
        v-else-if="screen === 'account-selection'"
        :accounts="accounts"
        :bank="bank"
        :can-continue="canContinueAccountSelection"
        :selected-account-ids="selectedAccountIds"
        @back="goBack"
        @toggle="toggleAccount"
        @next="goToScreen('couple')"
      />

      <CoupleConnectionStep
        v-else-if="screen === 'couple'"
        @back="goBack"
        @skip="goHome"
        @next="goToScreen('privacy')"
      />

      <PrivacyScopeStep
        v-else-if="screen === 'privacy'"
        v-model="financialVisibility"
        @back="goBack"
        @next="goToScreen('role')"
      />

      <RoleSelectionStep
        v-else
        v-model="role"
        @back="goBack"
        @complete="goHome"
      />
    </div>
  </AuthScreen>
</template>
