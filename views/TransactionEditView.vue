<script setup lang="ts">
import { ArrowLeft, Banknote, CalendarDays, ChevronDown, Landmark, Utensils } from '@lucide/vue';
import { ref } from 'vue';
import type { Component } from 'vue';
import type { Transaction, TransactionType } from '@/types/calendar';
import { formatAmount, formatSignedAmount, parseFormattedAmount } from '@/utils/format';

const props = defineProps<{ transaction: Transaction }>();
const emit = defineEmits<{ close: []; delete: []; save: [transaction: Transaction] }>();

const selectedType = ref<TransactionType>(props.transaction.type);
const amount = ref(formatAmount(props.transaction.amount));
const memo = ref(props.transaction.memo);
const TYPES = [
  { key: 'income', label: '수입' },
  { key: 'expense', label: '지출' },
  { key: 'saving', label: '저축' },
] as const;

const TRANSACTION_ICONS: Record<TransactionType, Component> = {
  income: Banknote,
  expense: Utensils,
  saving: Landmark,
};

const TYPE_COLORS: Record<TransactionType, string> = {
  income: 'text-[#65C466]',
  expense: 'text-[#F09488]',
  saving: 'text-[#3B86F7]',
};

function save() {
  const numericAmount = parseFormattedAmount(amount.value);
  emit('save', {
    ...props.transaction,
    type: selectedType.value,
    amount: selectedType.value === 'income' ? numericAmount : -numericAmount,
    memo: memo.value,
  });
}
</script>

<template>
  <div class="mx-auto w-full max-w-xl px-4 pb-6 pt-5 sm:px-5">
    <header class="mb-5 grid grid-cols-3 items-center">
      <button type="button" class="justify-self-start" aria-label="뒤로 가기" @click="emit('close')">
        <ArrowLeft class="h-6 w-6" />
      </button>
      <h1 class="whitespace-nowrap text-center text-xl font-semibold text-gray-800">내역 수정</h1>
      <button type="button" class="justify-self-end text-sm font-semibold text-dm-co-darker" @click="emit('delete')">삭제</button>
    </header>

    <section
      class="flex items-center gap-3 rounded-2xl border border-dm-gray/30 p-4 shadow-sm"
    >
      <span
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-dm-gray/15"
        :class="TYPE_COLORS[transaction.type]"
      >
        <component :is="TRANSACTION_ICONS[transaction.type]" class="h-6 w-6" :stroke-width="1.8" />
      </span>
      <div class="min-w-0 flex-1">
        <strong class="block text-base font-semibold">{{ transaction.title }}</strong>
        <span class="block text-xs text-dm-gray-dark">{{ transaction.category }} · {{ transaction.owner }}</span>
        <span class="block text-xs text-dm-gray-dark">{{ transaction.date }}</span>
      </div>
      <strong class="whitespace-nowrap text-sm font-semibold tracking-tight" :class="TYPE_COLORS[transaction.type]">
        {{ formatSignedAmount(transaction.amount, '원') }}
      </strong>
    </section>

    <form class="mt-4 space-y-3.5" @submit.prevent="save">
      <fieldset>
        <legend class="mb-2 text-sm font-semibold">구분</legend>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="type in TYPES"
            :key="type.key"
            type="button"
            class="relative rounded-2xl border py-3.5 text-sm font-semibold"
            :class="
              selectedType === type.key
                ? 'border-dm-mint-dark bg-btn-mt'
                : 'border-dm-gray/30 text-gray-600'
            "
            @click="selectedType = type.key"
          >
            {{ type.label }}
            <span
              v-if="selectedType === type.key"
              class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-dm-mint-dark text-sm text-white"
            >✓</span>
          </button>
        </div>
      </fieldset>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold">카테고리</span>
        <span class="flex items-center rounded-2xl border border-dm-gray/30 px-4 py-3">
          <span class="mr-3 rounded-lg bg-dm-gray/15 p-2" :class="TYPE_COLORS[transaction.type]">
            <component :is="TRANSACTION_ICONS[transaction.type]" class="h-4 w-4" :stroke-width="1.8" />
          </span>
          <strong class="flex-1 text-sm font-semibold">{{ transaction.title }}</strong>
          <ChevronDown class="h-4 w-4 text-dm-gray-dark" />
        </span>
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold">금액</span>
        <span class="flex items-center rounded-2xl border border-dm-gray/30 px-4 py-3.5">
          <input v-model="amount" inputmode="numeric" class="min-w-0 flex-1 text-right text-base font-semibold outline-none" />
          <span class="ml-3 text-sm font-medium text-dm-gray-dark">원</span>
        </span>
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold">날짜</span>
        <span class="flex items-center rounded-2xl border border-dm-gray/30 px-4 py-3.5">
          <strong class="flex-1 text-sm font-semibold">2026.07.15 (수)</strong>
          <CalendarDays class="h-5 w-5 text-dm-gray-dark" />
        </span>
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold">메모</span>
        <textarea
          v-model="memo"
          class="h-20 w-full resize-none rounded-2xl border border-dm-gray/30 p-3 text-sm outline-none"
        />
      </label>

      <button type="submit" class="w-full rounded-2xl bg-btn-pk py-3.5 text-base font-semibold text-white">저장하기</button>
      <button type="button" class="w-full rounded-2xl border border-dm-gray/30 bg-dm-gray-light py-3.5 text-base font-semibold text-gray-600 shadow-sm" @click="emit('close')">
        취소
      </button>
    </form>
  </div>
</template>
