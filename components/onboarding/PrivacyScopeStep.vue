<script setup lang="ts">
import { LockKeyhole, WalletCards } from '@lucide/vue';
import OnboardingActionFooter from '@/components/onboarding/OnboardingActionFooter.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';
import type { FinancialVisibility } from '@/types/onboarding';

// 공개범위 저장 상태와 오류 안내를 상위 화면에서 전달받는다.
defineProps<{
  errorMessage: string;
  isLoading: boolean;
}>();

// 이전·다음 단계 이동과 온보딩 건너뛰기를 상위 화면에 요청한다.
defineEmits<{ back: []; next: []; skip: [] }>();

// 사용자가 선택한 재무정보 공개 범위다.
const selection = defineModel<FinancialVisibility>({ required: true });

// 공개 범위 선택 카드에 표시할 정적 옵션이다.
const PRIVACY_OPTIONS = [
  {
    value: 'WEDDING',
    label: '결혼자금만 공개',
    description: '결혼 준비 수입, 지출 내역만 보여줘요',
    icon: WalletCards,
  },
  {
    value: 'ALL',
    label: '전체 공개',
    description: '현재 자산 정보까지 보여줘요',
    icon: LockKeyhole,
  },
] as const;
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <OnboardingProgress
      :current-step="4"
      @back="$emit('back')"
    />

    <div
      class="min-h-0 flex-1 overflow-y-auto scrollbar-none overscroll-y-contain px-4 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[359px]:px-3 sm:px-5"
    >
      <h1
        class="text-[21px] font-extrabold leading-tight tracking-[-0.055em] min-[360px]:text-[23px]"
      >
        상대에게 어디까지 공개할까요?
      </h1>
      <p class="mt-1.5 text-[12px] leading-5 text-dm-gray-dark">
        언제든 마이페이지에서 바꿀 수 있어요
      </p>

      <fieldset class="mt-6 flex flex-col gap-3">
        <legend class="sr-only">재무정보 공개 범위</legend>
        <label
          v-for="option in PRIVACY_OPTIONS"
          :key="option.value"
          class="flex min-h-[82px] cursor-pointer items-center gap-3 rounded-[16px] border px-4 py-3 shadow-sm transition"
          :class="
            selection === option.value
              ? 'border-pink-03 bg-pink-01'
              : 'border-dm-gray/30 bg-dm-gray-light hover:border-brand-dark'
          "
        >
          <input
            v-model="selection"
            class="sr-only"
            type="radio"
            name="financialVisibility"
            :value="option.value"
            :disabled="isLoading"
          />
          <span
            class="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-dm-gray-light text-brand-dark"
            aria-hidden="true"
          >
            <component
              :is="option.icon"
              class="h-5 w-5"
              :stroke-width="1.8"
            />
          </span>
          <span class="min-w-0 flex-1">
            <strong class="block text-[14px] font-extrabold">{{ option.label }}</strong>
            <span class="mt-1 block text-[11px] leading-4 text-dm-gray-dark">
              {{ option.description }}
            </span>
          </span>
          <span
            class="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full border"
            :class="selection === option.value ? 'border-pink-03' : 'border-dm-gray/35'"
            aria-hidden="true"
          >
            <span
              v-if="selection === option.value"
              class="h-[9px] w-[9px] rounded-full bg-brand"
            ></span>
          </span>
        </label>
      </fieldset>

      <p
        v-if="errorMessage"
        class="mt-3 text-[11px] leading-4 text-brand-dark"
        role="alert"
      >
        {{ errorMessage }}
      </p>
    </div>

    <OnboardingActionFooter
      :label="isLoading ? '저장하는 중...' : '다음'"
      secondary-label="다음에 하기"
      :disabled="isLoading"
      :secondary-disabled="isLoading"
      @primary="$emit('next')"
      @secondary="$emit('skip')"
    />
  </section>
</template>
