<script setup lang="ts">
import type { SummaryItem } from '@/types/calendar';
import { formatAmount } from '@/utils/format';

defineProps<{ items: readonly SummaryItem[] }>();

const DOT_COLORS = {
  goal: 'bg-[#65C466]',
  income: 'bg-[#65C466]',
  expense: 'bg-brand',
  saving: 'bg-[#3B86F7]',
} as const;

const LABEL_COLORS = {
  goal: 'text-[#65C466]',
  income: 'text-[#65C466]',
  expense: 'text-brand',
  saving: 'text-[#3B86F7]',
} as const;

const ONE_HUNDRED_MILLION_WON = 100_000_000;

function formatSummaryAmount(amount: number): string {
  if (Math.abs(amount) < ONE_HUNDRED_MILLION_WON) return `${formatAmount(amount)} 원`;

  const amountInHundredMillions = Math.trunc((amount / ONE_HUNDRED_MILLION_WON) * 10) / 10;
  return `${formatAmount(amountInHundredMillions)} 억 원`;
}
</script>

<template>
  <section class="grid grid-cols-3 gap-2.5">
    <article
      v-for="item in items"
      :key="item.label"
      class="min-w-0 rounded-2xl border border-dm-gray/30 bg-background px-3 py-3 shadow-sm sm:px-4"
    >
      <div
        class="flex items-center gap-1.5 text-xs font-medium"
        :class="LABEL_COLORS[item.type]"
      >
        <span
          class="h-2.5 w-2.5 rounded-full"
          :class="DOT_COLORS[item.type]"
        />
        {{ item.label }}
      </div>
      <strong class="mt-1 block text-xs font-semibold tracking-tight text-gray-800">
        {{ formatSummaryAmount(item.amount) }}
      </strong>
    </article>
  </section>
</template>
