<script setup lang="ts">
import { Banknote, Landmark, Utensils } from '@lucide/vue';
import type { Component } from 'vue';
import type { Transaction, TransactionType } from '@/types/calendar';
import { formatSignedAmount } from '@/utils/format';

defineProps<{ transactions: readonly Transaction[] }>();
const emit = defineEmits<{ select: [transaction: Transaction] }>();

const TRANSACTION_ICONS: Record<TransactionType, Component> = {
  income: Banknote,
  expense: Utensils,
  saving: Landmark,
};

function amountColor(transaction: Transaction) {
  if (transaction.type === 'expense') return 'text-btn-pk-dark';
  return 'text-dm-mint-dark';
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-dm-gray/30 bg-dm-gray-light">
    <button
      v-for="transaction in transactions"
      :key="transaction.id"
      type="button"
      class="flex w-full items-center gap-3 border-b border-dm-gray/30 px-4 py-3.5 text-left last:border-b-0"
      @click="emit('select', transaction)"
    >
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dm-mint-light text-dm-mint-darker">
        <component :is="TRANSACTION_ICONS[transaction.type]" class="h-5 w-5" :stroke-width="1.8" />
      </span>
      <span class="min-w-0 flex-1">
        <strong class="block text-sm font-semibold text-gray-800">{{ transaction.title }}</strong>
        <small class="mt-0.5 block text-xs text-dm-gray-dark">
          {{ transaction.category }} · {{ transaction.owner }}
        </small>
      </span>
      <strong class="shrink-0 text-sm font-semibold tracking-tight" :class="amountColor(transaction)">
        {{ formatSignedAmount(transaction.amount) }}
      </strong>
    </button>
  </div>
</template>
