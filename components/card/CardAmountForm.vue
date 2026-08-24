<script setup lang="ts">
import { computed } from 'vue';
import { ArrowRight, RotateCcw } from '@lucide/vue';
import { formatAmount } from '@/utils/format';
import type { CardRecommendationCategory, QuickAmountOption } from '@/types/card';

const props = defineProps<{
  amount: number;
  category: CardRecommendationCategory;
  isValid: boolean;
  minAmount: number;
}>();

const emit = defineEmits<{
  'update:amount': [amount: number];
  'update:category': [category: CardRecommendationCategory];
  'add-amount': [val: number];
  reset: [];
  submit: [];
}>();

const quickOptions: QuickAmountOption[] = [
  { label: '+ 5만원', value: 50_000 },
  { label: '+ 10만원', value: 100_000 },
  { label: '+ 30만원', value: 300_000 },
];

const categoryOptions: { label: string; value: CardRecommendationCategory }[] = [
  { label: '가구', value: '가구' },
  { label: '여행', value: '여행' },
];

const formattedAmount = computed(() => (props.amount > 0 ? formatAmount(props.amount) : ''));

function blockNonNumericInput(event: InputEvent) {
  if (event.data && /[^0-9]/.test(event.data)) {
    event.preventDefault();
  }
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const rawValue = target.value.replace(/[^0-9]/g, '');
  const numValue = Number(rawValue);
  emit('update:amount', numValue);
}

function handleQuickAdd(value: number) {
  emit('add-amount', value);
}
</script>

<template>
  <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <label
        for="amount-input"
        class="block text-[13px] font-bold text-[#5A5B69]"
      >
        결제 예정 금액
      </label>
      <button
        type="button"
        class="flex items-center gap-1 text-xs font-semibold text-dm-gray-dark transition-colors hover:text-brand"
        :disabled="amount === 0"
        @click="emit('reset')"
      >
        <RotateCcw
          class="h-3.5 w-3.5"
          :stroke-width="2"
        />
        초기화
      </button>
    </div>

    <div class="mt-3 flex items-center justify-between rounded-2xl bg-[#F8F9FB] px-5 py-4">
      <input
        id="amount-input"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        autocomplete="off"
        :value="formattedAmount"
        placeholder="0"
        class="w-full bg-transparent text-right text-2xl font-extrabold text-[#292934] outline-none placeholder:text-gray-300 sm:text-3xl"
        @input="handleInputChange"
        @beforeinput="blockNonNumericInput"
      />
      <span class="ml-2 shrink-0 text-base font-bold text-[#5A5B69]">원</span>
    </div>

    <!-- Quick Amount Add Buttons (+5만원, +10만원, +30만원) -->
    <div class="mt-3 flex items-center gap-2">
      <button
        v-for="option in quickOptions"
        :key="option.value"
        type="button"
        class="flex-1 cursor-pointer rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-[#5A5B69] transition-all hover:bg-gray-50 active:border-pink-03 active:bg-pink-01 active:font-bold active:text-brand active:shadow-xs"
        @click="handleQuickAdd(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <p class="mt-2 text-xs text-dm-gray-dark">
      {{ minAmount.toLocaleString('ko-KR') }}원 이상 입력해 주세요.
    </p>

    <fieldset class="mt-6 border-t border-gray-100 pt-5">
      <legend class="text-[13px] font-bold text-dm-gray-dark">추천 카테고리</legend>
      <p class="mt-1 text-xs text-dm-gray-dark">추천받을 카테고리를 선택해 주세요.</p>

      <div class="mt-3 grid grid-cols-2 gap-2">
        <button
          v-for="option in categoryOptions"
          :key="option.label"
          type="button"
          class="cursor-pointer rounded-xl border py-2.5 text-xs font-bold transition-colors"
          :class="
            category === option.value
              ? 'border-pink-04 bg-pink-01 text-brand'
              : 'border-gray-200 bg-white text-dm-gray-dark hover:bg-dm-gray-light'
          "
          :aria-pressed="category === option.value"
          @click="emit('update:category', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </fieldset>

    <button
      type="button"
      :disabled="!isValid"
      class="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
      @click="emit('submit')"
    >
      <span>이 금액으로 추천받기</span>
      <ArrowRight
        class="h-4 w-4"
        :stroke-width="2.5"
      />
    </button>
  </div>
</template>
