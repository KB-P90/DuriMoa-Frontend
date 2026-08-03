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
  <div class="mx-auto w-full max-w-xl overflow-hidden px-4 pb-5 pt-6 sm:px-5">
    <header class="mb-4 flex items-center justify-between gap-3">
      <h1 class="whitespace-nowrap text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl">
        2026년 7월
      </h1>
      <div
        class="flex shrink-0 rounded-2xl bg-gray-100 p-1 text-xs font-medium text-dm-gray-dark sm:text-sm"
      >
        <button
          v-for="item in [
            ['wedding', '결혼비용'],
            ['personal', '개인소비'],
          ] as const"
          :key="item[0]"
          type="button"
          class="rounded-xl px-2.5 py-2.5 sm:px-4"
          :class="mode === item[0] ? 'bg-dm-gray-light text-btn-pk shadow-sm' : ''"
          @click="emit('update:mode', item[0])"
        >
          {{ item[1] }}
        </button>
      </div>
    </header>

    <CalendarSummary :items="summary" />
    <div class="mt-5">
      <MonthCalendar
        :days="days"
        :selected-date="selectedDate"
        @select="emit('select-date', $event)"
      />
    </div>

    <section class="mt-5">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-800">7월 {{ selectedDate }}일 (수)</h2>
        <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-dm-gray-dark">
          {{ transactions.length }}건
        </span>
      </div>
      <TransactionList
        :transactions="transactions"
        @select="emit('select-transaction', $event)"
      />
    </section>

    <button
      type="button"
      class="mt-4 w-full rounded-2xl bg-btn-pk py-3.5 text-base font-semibold text-white shadow-sm"
    >
      7월 지출 분석 보기
    </button>
  </div>
</template>
