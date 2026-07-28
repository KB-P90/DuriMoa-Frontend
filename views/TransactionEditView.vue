<script setup lang="ts">
import { ArrowLeft, CalendarDays, ChevronDown } from '@lucide/vue';
import { ref } from 'vue';
import type { Transaction, TransactionType } from '@/types/calendar';

const props = defineProps<{ transaction: Transaction }>();
const emit = defineEmits<{ close: []; delete: []; save: [transaction: Transaction] }>();

const selectedType = ref<TransactionType>(props.transaction.type);
const amount = ref(Math.abs(props.transaction.amount).toLocaleString());
const memo = ref(props.transaction.memo);
const TYPES = [
  { key: 'income', label: '수입' },
  { key: 'expense', label: '지출' },
  { key: 'saving', label: '저축' },
] as const;

function save() {
  const numericAmount = Number(amount.value.replaceAll(',', ''));
  emit('save', {
    ...props.transaction,
    type: selectedType.value,
    amount: selectedType.value === 'income' ? numericAmount : -numericAmount,
    memo: memo.value,
  });
}
</script>

<template>
  <div class="mx-auto w-full max-w-[560px] px-5 pb-8 pt-6">
    <header class="mb-6 grid grid-cols-3 items-center">
      <button type="button" class="justify-self-start" aria-label="뒤로 가기" @click="emit('close')">
        <ArrowLeft class="h-6 w-6" />
      </button>
      <h1 class="whitespace-nowrap text-center text-[22px] font-bold text-[#292934]">내역 수정</h1>
      <button type="button" class="justify-self-end font-bold text-[#d26f5e]" @click="emit('delete')">삭제</button>
    </header>

    <section class="flex items-center gap-4 rounded-[20px] border border-[#f0dfdc] p-5 shadow-[0_4px_10px_rgba(40,30,30,0.06)]">
      <span class="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#ffecac] text-xl">
        {{ transaction.icon }}
      </span>
      <div class="min-w-0 flex-1">
        <strong class="block text-[18px]">{{ transaction.title }}</strong>
        <span class="block text-[14px] text-[#9293a2]">{{ transaction.category }} · {{ transaction.owner }}</span>
        <span class="block text-[14px] text-[#9293a2]">{{ transaction.date }}</span>
      </div>
      <strong class="whitespace-nowrap text-[17px] text-[#73a4a7]">
        {{ transaction.amount > 0 ? '+' : '-' }}{{ Math.abs(transaction.amount).toLocaleString() }}원
      </strong>
    </section>

    <form class="mt-4 space-y-4" @submit.prevent="save">
      <fieldset>
        <legend class="mb-3 text-[17px] font-bold">구분</legend>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="type in TYPES"
            :key="type.key"
            type="button"
            class="relative rounded-[17px] border py-4 font-bold"
            :class="selectedType === type.key ? 'border-[#72b0b3] bg-[#e9f5f5]' : 'border-[#f0dfdc] text-[#60606b]'"
            @click="selectedType = type.key"
          >
            {{ type.label }}
            <span
              v-if="selectedType === type.key"
              class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#72b0b3] text-sm text-white"
            >✓</span>
          </button>
        </div>
      </fieldset>

      <label class="block">
        <span class="mb-3 block text-[17px] font-bold">카테고리</span>
        <span class="flex items-center rounded-[17px] border border-[#f0dfdc] px-4 py-4">
          <span class="mr-3 rounded-lg bg-[#eef7ef] p-2">{{ transaction.icon }}</span>
          <strong class="flex-1">{{ transaction.title }}</strong>
          <ChevronDown class="h-4 w-4 text-[#9293a2]" />
        </span>
      </label>

      <label class="block">
        <span class="mb-3 block text-[17px] font-bold">금액</span>
        <span class="flex items-center rounded-[17px] border border-[#f0dfdc] px-4 py-4">
          <input v-model="amount" inputmode="numeric" class="min-w-0 flex-1 text-right text-[18px] font-bold outline-none" />
          <span class="ml-3 font-bold text-[#9293a2]">원</span>
        </span>
      </label>

      <label class="block">
        <span class="mb-3 block text-[17px] font-bold">날짜</span>
        <span class="flex items-center rounded-[17px] border border-[#f0dfdc] px-4 py-4">
          <strong class="flex-1">2026.07.15 (수)</strong>
          <CalendarDays class="h-5 w-5 text-[#9293a2]" />
        </span>
      </label>

      <label class="block">
        <span class="mb-3 block text-[17px] font-bold">메모</span>
        <textarea v-model="memo" class="h-24 w-full resize-none rounded-[17px] border border-[#f0dfdc] p-4 outline-none" />
      </label>

      <button type="submit" class="w-full rounded-[18px] bg-[#f28f86] py-4 text-[18px] font-bold text-white">저장하기</button>
      <button type="button" class="w-full rounded-[18px] border border-[#e6e6e9] bg-white py-4 text-[17px] font-bold text-[#60606b] shadow-md" @click="emit('close')">
        취소
      </button>
    </form>
  </div>
</template>
