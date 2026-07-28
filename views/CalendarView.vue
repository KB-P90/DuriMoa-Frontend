<script setup lang="ts">
import CalendarSummary from '@/components/calendar/CalendarSummary.vue';
import MonthCalendar from '@/components/calendar/MonthCalendar.vue';
import TransactionList from '@/components/calendar/TransactionList.vue';
import type { Transaction } from '@/types/calendar';
import type { CalendarMode } from '@/types/calendar';

defineProps<{
  mode: CalendarMode;
  selectedDate: number;
  days: InstanceType<typeof MonthCalendar>['$props']['days'];
  summary: InstanceType<typeof CalendarSummary>['$props']['items'];
  transactions: readonly Transaction[];
}>();

const emit = defineEmits<{
  'update:mode': [mode: CalendarMode];
  'select-date': [date: number];
  'select-transaction': [transaction: Transaction];
}>();
</script>

<template>
  <div class="mx-auto w-full max-w-[560px] overflow-hidden px-4 pb-6 pt-8 sm:px-5">
    <header class="mb-5 flex items-center justify-between gap-4">
      <h1 class="whitespace-nowrap text-[21px] font-bold tracking-[-0.04em] text-[#292934] sm:text-[24px]">2026년 7월</h1>
      <div class="flex shrink-0 rounded-[16px] bg-[#f4f4f8] p-1 text-[13px] font-bold text-[#9293a2] sm:text-[14px]">
        <button
          v-for="item in ([['wedding', '결혼비용'], ['personal', '개인소비']] as const)"
          :key="item[0]"
          type="button"
          class="rounded-[13px] px-2.5 py-3 sm:px-4"
          :class="mode === item[0] ? 'bg-white text-[#f28f86] shadow-[0_2px_5px_rgba(30,30,40,0.09)]' : ''"
          @click="emit('update:mode', item[0])"
        >
          {{ item[1] }}
        </button>
      </div>
    </header>

    <CalendarSummary :items="summary" />
    <div class="mt-5">
      <MonthCalendar :days="days" :selected-date="selectedDate" @select="emit('select-date', $event)" />
    </div>

    <section class="mt-5">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-[18px] font-bold text-[#292934]">7월 {{ selectedDate }}일 (수)</h2>
        <span class="rounded-full bg-[#f6f6f9] px-3 py-1 text-[12px] font-bold text-[#9293a2]">
          {{ transactions.length }}건
        </span>
      </div>
      <TransactionList :transactions="transactions" @select="emit('select-transaction', $event)" />
    </section>

    <button
      type="button"
      class="mt-5 w-full rounded-[18px] bg-[#f28f86] py-4 text-[18px] font-bold text-white shadow-[0_2px_5px_rgba(242,143,134,0.2)]"
    >
      7월 지출 분석 보기
    </button>
  </div>
</template>
