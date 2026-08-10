<script setup lang="ts">
import CategoryExpenseCard from '@/components/expense/CategoryExpenseCard.vue';
import MonthPicker from '@/components/expense/MonthPicker.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import SavingMissionCard from '@/components/expense/SavingMissionCard.vue';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useExpenseStore } from '@/stores/expenseStore';

interface Props {
  yearMonth?: string;
}

const props = defineProps<Props>();

useAuthCheck();

const router = useRouter();

const expenseStore = useExpenseStore();

// yearMonth가 있으면 해당 연월(예: 2026-07)을 사용하고, 없으면 현재 연월 적용
const selectedMonth = computed(() => {
  return props.yearMonth ? parseYearMonth(props.yearMonth) : getCurrentYearMonth();
});

function parseYearMonth(yearMonth: String) {
  const [year, month] = yearMonth.split('-');

  return {
    year: Number(year),
    month: Number(month),
  };
}

function getCurrentYearMonth() {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}

// 카테고리별 지출, 절약 미션 데이터 로드
const loadData = async (year: number, month: number) => {
  await Promise.all([
    expenseStore.fetchMonthlyExpense(year, month),
    expenseStore.fetchSavingMissions(year, month),
  ]);
};

watch(
  selectedMonth,
  (newMonth) => {
    loadData(newMonth.year, newMonth.month);
  },
  { immediate: true }
);

// MonthPicker에서 특정 달 선택 시 해당 기간 데이터 조회
function changeMonth({ year, month }: { year: number; month: number }) {
  router.replace({
    name: 'expense',
    params: {
      yearMonth: `${year}-${String(month).padStart(2, '0')}`,
    },
  });
}
</script>

<template>
  <div class="whitespace-nowrap">
    <PageHeader :title="`${selectedMonth.year}년 ${selectedMonth.month}월 지출 관리`" />
    <div class="flex items-center justify-end p-4">
      <MonthPicker
        :year="selectedMonth.year"
        :month="selectedMonth.month"
        @change="changeMonth"
      />
    </div>

    <div class="p-4 pt-0">
      <CategoryExpenseCard :month="selectedMonth.month" />

      <SavingMissionCard
        :year="selectedMonth.year"
        :month="selectedMonth.month"
      />
    </div>
  </div>
</template>
