<script setup lang="ts">
import { Check, ChevronDown, Landmark } from '@lucide/vue';
import OnboardingActionFooter from '@/components/onboarding/OnboardingActionFooter.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';

// 계좌 입력 완료 여부와 연결 실패 안내를 상위 화면에서 전달받는다.
const props = defineProps<{
  canContinue: boolean;
  connectionErrorMessage: string;
}>();

// 이전 이동·계좌 연결·온보딩 건너뛰기를 상위 화면에 요청한다.
const emit = defineEmits<{ back: []; connect: []; skip: [] }>();

// 계좌 연결 화면에서 입력하는 은행과 인터넷뱅킹 정보다.
const bank = defineModel<string>('bank', { required: true });
const internetBankingId = defineModel<string>('internetBankingId', {
  required: true,
});
const internetBankingPassword = defineModel<string>('internetBankingPassword', {
  required: true,
});

// 필수 입력을 완료한 경우에만 계좌 연결을 요청한다.
function handleSubmit() {
  if (props.canContinue) {
    emit('connect');
  }
}
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <OnboardingProgress
      :current-step="1"
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

      <form
        class="mt-6 space-y-4"
        aria-label="인터넷뱅킹 계좌 연결"
        @submit.prevent="handleSubmit"
      >
        <div>
          <label
            class="mb-2 block text-[12px] font-extrabold"
            for="onboarding-bank"
          >
            은행 선택
          </label>
          <div class="relative">
            <Landmark
              class="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-btn-pk"
              :stroke-width="1.8"
              aria-hidden="true"
            />
            <select
              id="onboarding-bank"
              v-model="bank"
              class="h-[52px] w-full appearance-none rounded-[13px] border border-dm-gray/35 bg-dm-gray-light pl-11 pr-11 text-[14px] font-bold outline-none transition focus:border-btn-pk focus:ring-3 focus:ring-btn-pk/10"
              name="bank"
            >
              <option value="국민은행">국민은행</option>
              <option value="신한은행">신한은행</option>
              <option value="하나은행">하나은행</option>
              <option value="우리은행">우리은행</option>
            </select>
            <ChevronDown
              class="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-dm-gray-dark"
              :stroke-width="1.8"
              aria-hidden="true"
            />
          </div>
        </div>

        <div>
          <label
            class="mb-2 block text-[12px] font-extrabold"
            for="onboarding-banking-id"
          >
            인터넷뱅킹 아이디
          </label>
          <input
            id="onboarding-banking-id"
            v-model="internetBankingId"
            class="h-[52px] w-full rounded-[13px] border border-dm-gray/35 bg-dm-gray-light px-4 text-[14px] font-semibold outline-none transition focus:border-btn-pk focus:ring-3 focus:ring-btn-pk/10"
            name="internetBankingId"
            type="text"
            autocomplete="username"
            placeholder="인터넷뱅킹 아이디"
          />
        </div>

        <div>
          <label
            class="mb-2 block text-[12px] font-extrabold"
            for="onboarding-banking-password"
          >
            인터넷뱅킹 비밀번호
          </label>
          <input
            id="onboarding-banking-password"
            v-model="internetBankingPassword"
            class="h-[52px] w-full rounded-[13px] border border-dm-gray/35 bg-dm-gray-light px-4 text-[14px] font-semibold outline-none transition focus:border-btn-pk focus:ring-3 focus:ring-btn-pk/10"
            name="internetBankingPassword"
            type="password"
            autocomplete="current-password"
            placeholder="인터넷뱅킹 비밀번호"
          />
          <p
            v-if="internetBankingPassword.length > 0"
            class="mt-2 flex items-center gap-1 text-[11px] text-btn-mt-dark"
          >
            <Check
              class="h-3.5 w-3.5"
              :stroke-width="2"
              aria-hidden="true"
            />
            비밀번호가 입력되었어요
          </p>
          <p
            v-if="connectionErrorMessage"
            class="mt-2 text-[11px] leading-4 text-btn-pk-dark"
            role="alert"
          >
            {{ connectionErrorMessage }}
          </p>
        </div>

        <button
          class="sr-only"
          type="submit"
          :disabled="!canContinue"
        >
          계좌 조회
        </button>
      </form>
    </div>

    <OnboardingActionFooter
      label="은행 선택하기"
      secondary-label="다음에 하기"
      :disabled="!canContinue"
      @primary="handleSubmit"
      @secondary="$emit('skip')"
    />
  </section>
</template>
