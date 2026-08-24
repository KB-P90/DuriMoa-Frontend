<script setup lang="ts">
import { ChevronRight, Info } from 'lucide-vue-next';
import { computed } from 'vue';

import CalendarSummary from '@/components/calendar/CalendarSummary.vue';
import MonthCalendar from '@/components/calendar/MonthCalendar.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import CalendarContentSkeleton from '@/components/skeleton/calendar/CalendarContentSkeleton.vue';
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
  {
    value: 'wedding',
    label: '결혼비용',
    description: '결혼비용은 두 사람이 함께 확인할 수 있어요.',
  },
  {
    value: 'personal',
    label: '개인소비',
    description: '개인 소비 내역은 나만 볼 수 있어요.',
  },
] as const;

const activeCalendar = computed(
  () => CALENDAR_MODE_OPTIONS.find((item) => item.value === props.mode) ?? CALENDAR_MODE_OPTIONS[0]
);
const activeCalendarLabel = computed(() => activeCalendar.value.label);
</script>

<template>
  <div class="mx-auto w-full overflow-hidden">
    <PageHeader
      title="캘린더"
      :show-back="false"
    />
    <div class="mx-4 mb-4 mt-4">
      <nav
        class="flex border-b border-dm-gray"
        role="tablist"
        aria-label="캘린더 전환"
      >
        <button
          v-for="item in CALENDAR_MODE_OPTIONS"
          :key="item.value"
          type="button"
          role="tab"
          :aria-selected="mode === item.value"
          class="relative flex-1 cursor-pointer whitespace-nowrap pb-3 text-base font-semibold transition-colors"
          :class="[
            mode === item.value
              ? `text-brand after:absolute after:-bottom-px after:left-0 after:h-[3.5px] after:w-full after:bg-brand after:content-['']`
              : 'text-dm-gray-dark hover:bg-dm-gray-light/60',
          ]"
          @click="emit('update:mode', item.value)"
        >
          {{ item.label }}
        </button>
      </nav>
      <p
        class="mt-2 flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-dm-gray-light/60 px-4 py-1.5 text-center text-sm font-normal leading-5 text-dm-gray-dark"
        aria-live="polite"
      >
        <Info
          class="h-3.5 w-3.5 shrink-0 text-dm-gray"
          :stroke-width="1.8"
          aria-hidden="true"
        />
        {{ activeCalendar.description }}
      </p>
    </div>

    <div class="p-4 pt-0">
      <CalendarContentSkeleton
        v-if="isLoading"
        :cell-count="days.length"
      />

      <CalendarSummary
        v-if="!isLoading"
        :items="summary"
      />

      <button
        v-if="!isLoading"
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

      <div
        v-if="!isLoading"
        class="mt-5"
      >
        <MonthCalendar
          :days="days"
          :selected-date="selectedDate"
          :month-label="monthLabel"
          @select="emit('select-date', $event)"
          @change-month="emit('change-month', $event)"
        />
      </div>

      <section
        v-if="!isLoading"
        class="mt-5"
      >
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
        v-if="!isLoading && showWeddingEmptyState"
        class="mt-4"
      />
    </div>
  </div>
</template>
