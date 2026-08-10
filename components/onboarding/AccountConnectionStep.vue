<script setup lang="ts">
import AccountConnectionForm from '@/components/common/AccountConnectionForm.vue';
import OnboardingActionFooter from '@/components/onboarding/OnboardingActionFooter.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';

const CARD_PROVIDER_OPTIONS = ['KB카드', '신한카드', '삼성카드', '현대카드'] as const;

const props = defineProps<{
  cardConnectionErrorMessage: string;
  canContinue: boolean;
  connectionErrorMessage: string;
  isLoading: boolean;
}>();

const emit = defineEmits<{ back: []; connect: []; skip: [] }>();

const bank = defineModel<string>('bank', { required: true });
const cardCompany = defineModel<string>('cardCompany', { required: true });
const cardLoginId = defineModel<string>('cardLoginId', { required: true });
const cardLoginPassword = defineModel<string>('cardLoginPassword', {
  required: true,
});
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
      class="min-h-0 flex-1 overflow-y-auto scrollbar-none overscroll-y-contain px-4 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[359px]:px-3 sm:px-5"
    >
      <h1 class="text-[21px] font-extrabold tracking-[-0.055em] min-[360px]:text-[23px]">
        계좌와 카드를 연결해주세요
      </h1>
      <p class="mt-1.5 text-[12px] leading-5 text-dm-gray-dark">
        결혼 준비에 사용할 계좌와 카드를 안전하게 불러올게요
      </p>

      <div class="mt-6 space-y-7">
        <section aria-labelledby="onboarding-bank-heading">
          <h2
            id="onboarding-bank-heading"
            class="mb-3 text-[14px] font-extrabold"
          >
            계좌 연결
          </h2>
          <AccountConnectionForm
            v-model:bank="bank"
            v-model:internet-banking-id="internetBankingId"
            v-model:internet-banking-password="internetBankingPassword"
            form-id-prefix="onboarding-bank"
            :connection-error-message="connectionErrorMessage"
            :disabled="isLoading"
            helper-text="기존에 연결한 은행은 아이디와 비밀번호를 다시 입력하지 않아도 돼요"
            id-label="인터넷뱅킹 아이디 (신규 연결 시)"
            password-label="인터넷뱅킹 비밀번호 (신규 연결 시)"
            @submit="handleSubmit"
          />
        </section>

        <section aria-labelledby="onboarding-card-heading">
          <h2
            id="onboarding-card-heading"
            class="mb-3 text-[14px] font-extrabold"
          >
            카드 연결
          </h2>
          <AccountConnectionForm
            v-model:bank="cardCompany"
            v-model:internet-banking-id="cardLoginId"
            v-model:internet-banking-password="cardLoginPassword"
            form-id-prefix="onboarding-card"
            provider-label="카드사 선택"
            id-label="카드사 로그인 아이디 (신규 연결 시)"
            password-label="카드사 로그인 비밀번호 (신규 연결 시)"
            helper-text="기존에 연결한 카드사는 아이디와 비밀번호를 다시 입력하지 않아도 돼요"
            :connection-error-message="cardConnectionErrorMessage"
            :disabled="isLoading"
            :provider-options="CARD_PROVIDER_OPTIONS"
            @submit="handleSubmit"
          />
        </section>
      </div>
    </div>

    <OnboardingActionFooter
      :label="isLoading ? '자산 불러오는 중...' : '계좌·카드 불러오기'"
      secondary-label="다음에 하기"
      :disabled="!canContinue || isLoading"
      :secondary-disabled="isLoading"
      @primary="handleSubmit"
      @secondary="$emit('skip')"
    />
  </section>
</template>
