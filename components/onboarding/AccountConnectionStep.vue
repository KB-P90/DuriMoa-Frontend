<script setup lang="ts">
import AccountConnectionForm from '@/components/common/AccountConnectionForm.vue';
import OnboardingActionFooter from '@/components/onboarding/OnboardingActionFooter.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';

const props = defineProps<{
  canContinue: boolean;
  connectionErrorMessage: string;
  isLoading: boolean;
}>();

const emit = defineEmits<{ back: []; connect: []; skip: [] }>();

const bank = defineModel<string>('bank', { required: true });
const internetBankingId = defineModel<string>('internetBankingId', {
  required: true,
});
const internetBankingPassword = defineModel<string>('internetBankingPassword', {
  required: true,
});

function handleSubmit() {
  if (props.canContinue) {
    emit('connect');
  }
}
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <OnboardingProgress
      :current-step="2"
      :total-steps="2"
      @back="$emit('back')"
    />

    <div
      class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[359px]:px-3 sm:px-5"
    >
      <h1 class="text-[21px] font-extrabold tracking-[-0.055em] min-[360px]:text-[23px]">
        계좌를 연결해주세요
      </h1>
      <p class="mt-1.5 text-[12px] leading-5 text-dm-gray-dark">
        결혼 준비에 사용할 계좌를 안전하게 불러올게요
      </p>

      <AccountConnectionForm
        v-model:bank="bank"
        v-model:internet-banking-id="internetBankingId"
        v-model:internet-banking-password="internetBankingPassword"
        class="mt-6"
        form-id-prefix="onboarding"
        :connection-error-message="connectionErrorMessage"
        :disabled="isLoading"
        @submit="handleSubmit"
      />
    </div>

    <OnboardingActionFooter
      :label="isLoading ? '계좌 불러오는 중...' : '은행 선택하기'"
      secondary-label="다음에 하기"
      :disabled="!canContinue || isLoading"
      :secondary-disabled="isLoading"
      @primary="handleSubmit"
      @secondary="$emit('skip')"
    />
  </section>
</template>
