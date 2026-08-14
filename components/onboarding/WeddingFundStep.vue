<script setup lang="ts">
import { computed } from 'vue';
import { PiggyBank } from '@lucide/vue';
import OnboardingActionFooter from '@/components/onboarding/OnboardingActionFooter.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';
import { formatAmount } from '@/utils/format';

const MAX_AMOUNT_DIGITS = 9;

const props = defineProps<{
  amount: number | null;
  canContinue: boolean;
}>();

const emit = defineEmits<{
  back: [];
  next: [];
  skip: [];
  'update:amount': [amount: number | null];
}>();

const formattedAmount = computed(() =>
  props.amount === null ? '' : formatAmount(props.amount)
);

function handleAmountInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const digits = target.value.replace(/[^0-9]/g, '').slice(0, MAX_AMOUNT_DIGITS);
  emit('update:amount', digits.length > 0 ? Number(digits) : null);
}
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <OnboardingProgress
      :current-step="2"
      :show-step-indicator="false"
      :total-steps="2"
      @back="$emit('back')"
    />

    <div
      class="min-h-0 flex-1 overflow-y-auto scrollbar-none overscroll-y-contain px-4 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[359px]:px-3 sm:px-5"
    >
      <h1
        class="break-keep text-[21px] font-extrabold leading-tight tracking-[-0.055em] min-[360px]:text-[23px]"
      >
        현재까지 모은 결혼자금을 알려주세요
      </h1>
      <p class="mt-2 break-keep text-[12px] leading-5 text-dm-gray-dark">
        결혼 목표 달성률과 앞으로 필요한 저축 금액을 계산할 때 사용해요
      </p>

      <div
        class="mt-8 rounded-[20px] border border-pink-03/55 bg-white px-5 py-6 shadow-sm"
      >
        <span
          class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pink-01 text-brand"
          aria-hidden="true"
        >
          <PiggyBank
            class="h-7 w-7"
            :stroke-width="1.8"
          />
        </span>

        <label
          for="onboarding-wedding-fund"
          class="mt-5 block text-center text-[13px] font-extrabold"
        >
          현재 보유한 결혼자금
        </label>

        <div
          class="relative mt-3 flex h-[60px] items-center rounded-[14px] border border-dm-gray/35 bg-dm-gray-light px-4 focus-within:border-pink-03 focus-within:ring-3 focus-within:ring-brand/10"
        >
          <input
            id="onboarding-wedding-fund"
            :value="formattedAmount"
            class="min-w-0 flex-1 bg-transparent text-right font-mono text-[24px] font-extrabold text-black outline-none placeholder:text-dm-gray"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="0"
            aria-describedby="onboarding-wedding-fund-description"
            @input="handleAmountInput"
          />
          <span class="ml-2 shrink-0 text-[14px] font-bold text-dm-gray-dark">만원</span>
        </div>

        <p
          id="onboarding-wedding-fund-description"
          class="mt-3 break-keep text-center text-[11px] leading-5 text-dm-gray-dark"
        >
          계좌에 연결되지 않은 현금과 예금도 포함해서 입력해주세요.
        </p>
      </div>

      <div class="mt-4 rounded-[14px] bg-pink-01 px-4 py-3.5">
        <p class="break-keep text-[11px] font-medium leading-5 text-brand-dark">
          입력한 금액은 두 사람의 결혼자금 현황을 보여주는 기준으로 사용돼요.
        </p>
      </div>
    </div>

    <OnboardingActionFooter
      label="입력 완료"
      secondary-label="다음에 하기"
      :disabled="!canContinue"
      @primary="$emit('next')"
      @secondary="$emit('skip')"
    />
  </section>
</template>
