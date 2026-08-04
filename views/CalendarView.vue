<script setup lang="ts">
import CalendarSummary from '@/components/calendar/CalendarSummary.vue';
import MonthCalendar from '@/components/calendar/MonthCalendar.vue';
import TransactionList from '@/components/calendar/TransactionList.vue';
import type { Transaction } from '@/types/calendar';
import type { CalendarMode } from '@/types/calendar';

defineProps<{
  mode: CalendarMode;
  selectedDate: string;
  selectedDateLabel: string;
  monthLabel: string;
  expenseAnalysisLabel: string;
  days: InstanceType<typeof MonthCalendar>['$props']['days'];
  summary: InstanceType<typeof CalendarSummary>['$props']['items'];
  transactions: readonly Transaction[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  'update:mode': [mode: CalendarMode];
  'select-date': [date: string];
  'change-month': [offset: number];
  'select-transaction': [transaction: Transaction];
  'create-transaction': [];
  'view-expense-analysis': [];
}>();
</script>

<template>
  <div class="mx-auto w-full max-w-xl overflow-hidden px-4 pb-5 pt-6 sm:px-5">
    <header class="mb-4 flex items-center justify-between gap-3">
      <h1 class="whitespace-nowrap text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl">
        {{ monthLabel }}
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
          :class="
            mode === item[0]
              ? item[0] === 'wedding'
                ? 'bg-dm-gray-light text-btn-pk shadow-sm'
                : 'bg-dm-gray-light text-btn-mt-dark shadow-sm'
              : ''
          "
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
        :month-label="monthLabel"
        @select="emit('select-date', $event)"
        @change-month="emit('change-month', $event)"
      />
    </div>

    <section class="mt-5">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-800">{{ selectedDateLabel }}</h2>
        <div class="flex items-center gap-2">
          <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-dm-gray-dark">
            {{ isLoading ? '조회 중' : `${transactions.length}건` }}
          </span>
          <button
            type="button"
            class="rounded-full bg-btn-pk px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm"
            @click="emit('create-transaction')"
          >
            내역 추가
          </button>
        </div>
      </div>
      <TransactionList
        :transactions="transactions"
        @select="emit('select-transaction', $event)"
      />
    </section>

    <button
      type="button"
      class="mt-4 w-full rounded-2xl bg-btn-pk py-3.5 text-base font-semibold text-white shadow-sm"
      @click="emit('view-expense-analysis')"
    >
      {{ expenseAnalysisLabel }}
    </button>
  </div>
</template>
