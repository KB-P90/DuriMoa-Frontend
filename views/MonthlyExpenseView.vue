<script setup lang="ts">
import { useRouter } from 'vue-router';
import CategoryExpenseCard from '@/components/expense/CategoryExpenseCard.vue';
import CoupleFeedbackCard from '@/components/expense/CoupleFeedbackCard.vue';
import MonthPicker from '@/components/expense/MonthPicker.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import SavingMissionCard from '@/components/expense/SavingMissionCard.vue';
import ExpenseOverviewSkeleton from '@/components/skeleton/expense/ExpenseOverviewSkeleton.vue';
import SavingMissionSkeleton from '@/components/skeleton/expense/SavingMissionSkeleton.vue';
import { useMonthlyExpense } from '@/composables/useMonthlyExpense';

const props = defineProps<{
  yearMonth?: string;
}>();

const router = useRouter();

const { selectedMonth, expenseLoading, missionLoading } = useMonthlyExpense(() => props.yearMonth);

function changeMonth({ year, month }: { year: number; month: number }) {
  void router.replace({
    name: 'expense',
    params: {
      yearMonth: `${year}-${String(month).padStart(2, '0')}`,
    },
  });
}
</script>

<template>
  <div class="min-h-full bg-white pb-6 text-gray-800">
    <PageHeader
      :title="`${selectedMonth.year}년 ${selectedMonth.month}월 지출 관리`"
      :show-back="true"
      :on-back="() => router.push({ name: 'calendar' })"
    />

    <div class="flex items-center justify-center p-4">
      <MonthPicker
        :year="selectedMonth.year"
        :month="selectedMonth.month"
        @change="changeMonth"
      />
    </div>

    <main class="space-y-4 px-5 pt-0">
      <ExpenseOverviewSkeleton v-if="expenseLoading" />
      <template v-else>
        <CategoryExpenseCard :month="selectedMonth.month" />
        <CoupleFeedbackCard
          :year="selectedMonth.year"
          :month="selectedMonth.month"
        />
      </template>
      <SavingMissionSkeleton v-if="missionLoading" />
      <SavingMissionCard
        v-else
        :year="selectedMonth.year"
        :month="selectedMonth.month"
      />
    </main>
  </div>
</template>
