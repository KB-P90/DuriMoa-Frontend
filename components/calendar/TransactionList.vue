<script setup lang="ts">
import type { Transaction } from '@/types/calendar';

defineProps<{ transactions: readonly Transaction[] }>();
const emit = defineEmits<{ select: [transaction: Transaction] }>();

function amountColor(transaction: Transaction) {
  if (transaction.type === 'expense') return 'text-[#ff8178]';
  return 'text-[#7da5a8]';
}
</script>

<template>
  <div class="overflow-hidden rounded-[20px] border border-[#e3e4ea] bg-white">
    <button
      v-for="transaction in transactions"
      :key="transaction.id"
      type="button"
      class="flex w-full items-center gap-3 border-b border-[#ececf1] px-4 py-4 text-left last:border-b-0"
      @click="emit('select', transaction)"
    >
      <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#eef8f8] text-lg">
        {{ transaction.icon }}
      </span>
      <span class="min-w-0 flex-1">
        <strong class="block text-[16px] text-[#292934]">{{ transaction.title }}</strong>
        <small class="mt-0.5 block text-[13px] text-[#9293a2]">
          {{ transaction.category }} · {{ transaction.owner }}
        </small>
      </span>
      <strong class="shrink-0 text-[13px] sm:text-[15px]" :class="amountColor(transaction)">
        {{ transaction.amount > 0 ? '+' : '-' }}{{ Math.abs(transaction.amount).toLocaleString() }}
      </strong>
    </button>
  </div>
</template>
