<script setup lang="ts">
import { ChevronLeft } from '@lucide/vue';
import CategoryExpenseCard from '@/components/expense/CategoryExpenseCard.vue';
import CoupleFeedbackCard from '@/components/expense/CoupleFeedbackCard.vue';
import MonthPicker from '@/components/expense/MonthPicker.vue';
import SavingMissionCard from '@/components/expense/SavingMissionCard.vue';
import ExpenseOverviewSkeleton from '@/components/skeleton/expense/ExpenseOverviewSkeleton.vue';
import SavingMissionSkeleton from '@/components/skeleton/expense/SavingMissionSkeleton.vue';
import { useMonthlyExpense } from '@/composables/useMonthlyExpense';

const props = defineProps<{
  yearMonth?: string;
}>();

const { selectedMonth, expenseLoading, missionLoading, goHome } = useMonthlyExpense(
  () => props.yearMonth
);
</script>

<template>
  <div class="min-h-full bg-white pb-6 text-gray-800">
    <header class="flex h-[72px] items-center px-5">
      <button
        type="button"
        aria-label="홈으로 돌아가기"
        class="grid h-8 w-8 place-items-center"
        @click="goHome"
      >
        <ChevronLeft class="h-5 w-5" :stroke-width="2.4" />
      </button>
      <h1 class="ml-1 flex-1 text-[17px] font-extrabold">
        {{ selectedMonth.month }}월 지출 관리
      </h1>
      <MonthPicker
        :year="selectedMonth.year"
        :month="selectedMonth.month"
      />
    </header>

    <main class="space-y-4 px-5">
      <ExpenseOverviewSkeleton v-if="expenseLoading" />
      <template v-else>
        <CategoryExpenseCard :month="selectedMonth.month" />
        <CoupleFeedbackCard />
      </template>
      <SavingMissionSkeleton v-if="missionLoading" />
      <SavingMissionCard v-else :year="selectedMonth.year" :month="selectedMonth.month" />
    </main>
  </div>
</template>
