<script setup lang="ts">
import CoupleConnectionForm from '@/components/common/CoupleConnectionForm.vue';
import OnboardingActionFooter from '@/components/onboarding/OnboardingActionFooter.vue';
import type { OnboardingCoupleRequest } from '@/types/onboarding';

defineProps<{
  acceptingUserIds: number[];
  canConfirm: boolean;
  errorMessage: string;
  feedbackMessage: string;
  hasMyInviteCodeCopyError: boolean;
  hasInviteCodeError: boolean;
  isConnected: boolean;
  isInviting: boolean;
  isLoadingMyInviteCode: boolean;
  isLoadingStatus: boolean;
  myInviteCode: string;
  myInviteCodeCopyMessage: string;
  myInviteCodeErrorMessage: string;
  requests: OnboardingCoupleRequest[];
  statusErrorMessage: string;
}>();

defineEmits<{
  accept: [userId: number];
  confirm: [];
  copyMyInviteCode: [];
  next: [];
  retryMyInviteCode: [];
  retryStatus: [];
}>();

const inviteCode = defineModel<string>('inviteCode', { required: true });
</script>

<template>
  <section class="relative flex min-h-0 flex-1 flex-col overflow-hidden">
    <div
      class="min-h-0 flex-1 overflow-y-auto scrollbar-none overscroll-y-contain px-4 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[359px]:px-3 sm:px-5"
    >
      <h2
        class="text-[21px] font-extrabold leading-tight tracking-[-0.055em] min-[360px]:text-[23px]"
      >
        상대를 연결해주세요
      </h2>
      <p class="mt-1.5 text-[12px] leading-5 text-dm-gray-dark">
        초대 코드로 두 사람의 공동 공간을 만들어요
      </p>

      <CoupleConnectionForm
        v-model:invite-code="inviteCode"
        :accepting-user-ids="acceptingUserIds"
        :can-confirm="canConfirm"
        :error-message="errorMessage"
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
        use-white-input
        @accept="$emit('accept', $event)"
        @confirm="$emit('confirm')"
        @copy-my-invite-code="$emit('copyMyInviteCode')"
        @retry-my-invite-code="$emit('retryMyInviteCode')"
        @retry-status="$emit('retryStatus')"
      />
    </div>

    <OnboardingActionFooter
      label="다음"
      :disabled="isInviting || isLoadingStatus || acceptingUserIds.length > 0"
      @primary="$emit('next')"
    />
  </section>
</template>
