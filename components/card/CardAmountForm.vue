<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowRight } from '@lucide/vue';
import { formatAmount, parseFormattedAmount } from '@/utils/format';
import type { QuickAmountOption } from '@/types/card';

const props = defineProps<{
  amount: number;
  isValid: boolean;
  minAmount: number;
}>();

const emit = defineEmits<{
  'update:amount': [amount: number];
  'add-amount': [val: number];
  submit: [];
}>();

const quickOptions: QuickAmountOption[] = [
  { label: '+ 5만원', value: 50_000 },
  { label: '+ 10만원', value: 100_000 },
  { label: '+ 30만원', value: 300_000 },
];

// 방금 전 가장 최근에 클릭한 퀵 버튼 선택 상태 유지
const selectedQuickValue = ref<number | null>(null);

const formattedAmount = computed({
  get: () => (props.amount > 0 ? formatAmount(props.amount) : ''),
  set: (val: string) => {
    const num = parseFormattedAmount(val);
    emit('update:amount', Number.isNaN(num) ? 0 : num);
  },
});

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const rawValue = target.value.replace(/[^0-9]/g, '');
  const numValue = Number(rawValue);
  selectedQuickValue.value = null; // 직접 입력 시 퀵 버튼 선택 하이라이트 초기화
  emit('update:amount', numValue);
}

function handleQuickAdd(value: number) {
  selectedQuickValue.value = value; // 최근 누른 버튼 상태 유지
  emit('add-amount', value);
}
</script>

<template>
  <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
    <label
      for="amount-input"
      class="block text-[13px] font-bold text-[#5A5B69]"
    >
      결제 예정 금액
    </label>

    <div class="mt-3 flex items-center justify-between rounded-2xl bg-[#F8F9FB] px-5 py-4">
      <input
        id="amount-input"
        type="text"
        inputmode="numeric"
        :value="formattedAmount"
        placeholder="0"
        class="w-full bg-transparent text-right text-2xl font-extrabold text-[#292934] outline-none placeholder:text-gray-300 sm:text-3xl"
        @input="handleInputChange"
      />
      <span class="ml-2 shrink-0 text-base font-bold text-[#5A5B69]">원</span>
    </div>

    <!-- Quick Amount Add Buttons (+5만원, +10만원, +30만원) -->
    <div class="mt-3 flex items-center gap-2">
      <button
        v-for="option in quickOptions"
        :key="option.value"
        type="button"
        class="flex-1 cursor-pointer rounded-xl border py-2.5 text-xs font-semibold transition-all"
        :class="
          selectedQuickValue === option.value
            ? 'border-pink-03 bg-[#FFF0EF] text-brand font-bold shadow-xs'
            : 'border-gray-200 bg-white text-[#5A5B69] hover:bg-gray-50'
        "
        @click="handleQuickAdd(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <p class="mt-2 text-xs text-dm-gray-dark">
      {{ minAmount.toLocaleString('ko-KR') }}원 이상 입력해 주세요.
    </p>

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
