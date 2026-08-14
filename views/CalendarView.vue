<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import { computed } from 'vue';

import CalendarSummary from '@/components/calendar/CalendarSummary.vue';
import MonthCalendar from '@/components/calendar/MonthCalendar.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import TransactionList from '@/components/calendar/TransactionList.vue';
import WeddingCalendarEmptyState from '@/components/calendar/WeddingCalendarEmptyState.vue';
import type { Transaction } from '@/types/calendar';
import type { CalendarMode } from '@/types/calendar';

const props = defineProps<{
  mode: CalendarMode;
  selectedDate: string;
  selectedDateLabel: string;
  monthLabel: string;
  expenseAnalysisLabel: string;
  days: InstanceType<typeof MonthCalendar>['$props']['days'];
  summary: InstanceType<typeof CalendarSummary>['$props']['items'];
  transactions: readonly Transaction[];
  showWeddingEmptyState: boolean;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  'update:mode': [mode: CalendarMode];
  'select-date': [date: string];
  'change-month': [offset: number];
  'select-transaction': [transaction: Transaction];
  'create-transaction': [calendarLabel: string];
  'view-expense-analysis': [];
}>();

const CALENDAR_MODE_OPTIONS = [
  { value: 'wedding', label: '결혼비용' },
  { value: 'personal', label: '개인소비' },
] as const;

const activeCalendarLabel = computed(
  () => CALENDAR_MODE_OPTIONS.find((item) => item.value === props.mode)?.label ?? ''
);
</script>

<template>
  <div class="mx-auto w-full overflow-hidden">
    <PageHeader
      title="캘린더"
      :show-back="false"
    />
    <div class="flex items-center justify-end p-4">
      <div
        class="flex shrink-0 rounded-2xl bg-gray-100 p-1 text-xs font-medium text-dm-gray-dark sm:text-sm"
      >
        <button
          v-for="item in CALENDAR_MODE_OPTIONS"
          :key="item.value"
          type="button"
          class="rounded-xl px-2.5 py-2.5 sm:px-4"
          :class="
            mode === item.value
              ? item.value === 'wedding'
                ? 'bg-background text-brand shadow-sm'
                : 'bg-background text-btn-mt-dark shadow-sm'
              : ''
          "
          @click="emit('update:mode', item.value)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="p-4 pt-0">
      <CalendarSummary :items="summary" />

      <button
        type="button"
        class="mt-4 flex w-full items-center justify-between rounded-2xl bg-brand px-4 py-3 text-left shadow-md transition-colors hover:bg-brand-dark"
        @click="emit('view-expense-analysis')"
      >
        <span class="flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-white/90">
            <img
              src="/icons/expense-analytics.png"
              alt=""
              class="h-6 w-6 object-contain"
            />
          </span>
          <span>
            <span class="block text-sm font-bold text-white">{{ expenseAnalysisLabel }}</span>
            <span class="mt-0.5 block text-xs text-white/80">지출 흐름과 비율을 확인해 보세요</span>
          </span>
        </span>
        <ChevronRight class="h-5 w-5 shrink-0 text-white/80" />
      </button>

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
          <h2 class="text-base font-bold text-gray-800">{{ selectedDateLabel }}</h2>
          <div class="flex items-center gap-2">
            <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-dm-gray-dark">
              {{ isLoading ? '조회 중' : `${transactions.length}건` }}
            </span>
            <button
              type="button"
              class="rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm"
              @click="emit('create-transaction', activeCalendarLabel)"
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

      <WeddingCalendarEmptyState
        v-if="showWeddingEmptyState"
        class="mt-4"
      />
    </div>
  </div>
</template>
