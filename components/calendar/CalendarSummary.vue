<script setup lang="ts">
import type { SummaryItem } from '@/types/calendar';

defineProps<{ items: readonly SummaryItem[] }>();

const DOT_COLORS = {
  goal: 'bg-[#81a8aa]',
  income: 'bg-[#64c976]',
  expense: 'bg-[#f39189]',
  saving: 'bg-[#64c976]',
} as const;
</script>

<template>
  <section class="grid grid-cols-3 gap-2.5">
    <article
      v-for="item in items"
      :key="item.label"
      class="min-w-0 rounded-[18px] border border-[#e5e5eb] bg-white px-2.5 py-3 shadow-[0_3px_7px_rgba(35,35,45,0.08)] sm:rounded-[20px] sm:px-4 sm:py-4"
    >
      <div class="flex items-center gap-1.5 text-[13px]" :class="item.type === 'expense' ? 'text-[#f39189]' : 'text-[#7da5a8]'">
        <span class="h-2.5 w-2.5 rounded-full" :class="DOT_COLORS[item.type]" />
        {{ item.label }}
      </div>
      <strong class="mt-1 block text-[13px] text-[#292934] sm:text-[16px]">{{ item.amount.toLocaleString() }}</strong>
    </article>
  </section>
</template>
