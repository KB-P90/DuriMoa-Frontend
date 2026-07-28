<script setup lang="ts">
import type { SummaryItem } from '@/types/calendar';
import { formatAmount } from '@/utils/format';

defineProps<{ items: readonly SummaryItem[] }>();

const DOT_COLORS = {
  goal: 'bg-dm-mint-dark',
  income: 'bg-btn-mt-dark',
  expense: 'bg-btn-pk',
  saving: 'bg-btn-mt-dark',
} as const;
</script>

<template>
  <section class="grid grid-cols-3 gap-2.5">
    <article
      v-for="item in items"
      :key="item.label"
      class="min-w-0 rounded-2xl border border-dm-gray/30 bg-dm-gray-light px-3 py-3 shadow-sm sm:px-4"
    >
      <div
        class="flex items-center gap-1.5 text-xs font-medium"
        :class="item.type === 'expense' ? 'text-btn-pk' : 'text-dm-mint-dark'"
      >
        <span class="h-2.5 w-2.5 rounded-full" :class="DOT_COLORS[item.type]" />
        {{ item.label }}
      </div>
      <strong class="mt-1 block text-sm font-semibold tracking-tight text-gray-800 sm:text-base">
        {{ formatAmount(item.amount) }}
      </strong>
    </article>
  </section>
</template>
