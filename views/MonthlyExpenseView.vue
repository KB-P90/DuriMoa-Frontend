<script setup lang="ts">
import { getMonthlyExpense } from '@/api/expense';
import CategoryExpenseCard from '@/components/expense/CategoryExpenseCard.vue';
import MonthPicker from '@/components/expense/MonthPicker.vue';
import SavingMissionCard from '@/components/expense/SavingMissionCard.vue';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Props {
  title: string;
  yearMonth?: string;
}

const props = defineProps<Props>();

const route = useRoute();
const router = useRouter();

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

// MonthPicker에서 특정 달 선택 시 해당 기간 데이터 조회
function changeMonth({ year, month }: { year: number; month: number }) {
  router.push({
    name: 'expense',
    params: {
      yearMonth: `${year}-${String(month).padStart(2, '0')}`,
    },
  });
}

async function fetchExpense() {
  await getMonthlyExpense(selectedMonth.value.year, selectedMonth.value.month);
}

watch(() => route.params.yearMonth, fetchExpense, { immediate: true });
</script>

<template>
  <div>
    <header>
      <h1>{{ selectedMonth.year }}년 {{ selectedMonth.month }}월 지출 관리</h1>
      <MonthPicker
        :year="selectedMonth.year"
        :month="selectedMonth.month"
        @change="changeMonth"
      />
    </header>

    <CategoryExpenseCard />

    <SavingMissionCard />
  </div>
</template>
