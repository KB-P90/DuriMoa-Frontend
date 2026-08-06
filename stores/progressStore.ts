import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getProgress } from '@/server/progressApi';
import type {
  MonthlyProgress,
  OverallProgress,
  PersonalProgress,
  ProgressResponse,
} from '@/types/progress';

export const MOCK_MONTHLY_PROGRESS: MonthlyProgress = {
  overallProgressRate: 79,
  months: [
    {
      yearMonth: '2026-08',
      expenseAmount: 4800000,
      cumulativeExpenseAmount: 25000000,
      progressRate: 79,
    },
    {
      yearMonth: '2026-07',
      expenseAmount: 3900000,
      cumulativeExpenseAmount: 20200000,
      progressRate: 64,
    },
    {
      yearMonth: '2026-06',
      expenseAmount: 3600000,
      cumulativeExpenseAmount: 16300000,
      progressRate: 51,
    },
    {
      yearMonth: '2026-05',
      expenseAmount: 3300000,
      cumulativeExpenseAmount: 12700000,
      progressRate: 39,
    },
    {
      yearMonth: '2026-04',
      expenseAmount: 2900000,
      cumulativeExpenseAmount: 9400000,
      progressRate: 27,
    },
    {
      yearMonth: '2026-03',
      expenseAmount: 2400000,
      cumulativeExpenseAmount: 6500000,
      progressRate: 18,
    },
    {
      yearMonth: '2026-02',
      expenseAmount: 2100000,
      cumulativeExpenseAmount: 4100000,
      progressRate: 11,
    },
    {
      yearMonth: '2026-01',
      expenseAmount: 2000000,
      cumulativeExpenseAmount: 2000000,
      progressRate: 5,
    },
  ],
};

const EMPTY_OVERALL_PROGRESS: OverallProgress = {
  targetAmount: 0,
  currentAmount: 0,
  progressRate: 0,
  completedItemCount: 0,
  totalItemCount: 0,
  items: [],
};

const EMPTY_PERSONAL_PROGRESS: PersonalProgress = {
  members: [],
};

const EMPTY_MONTHLY_PROGRESS: MonthlyProgress = {
  overallProgressRate: 0,
  months: [],
};

export const useProgressStore = defineStore('progress', () => {
  const progress = ref<ProgressResponse | null>(null);
  const loading = ref(false);
  const error = ref<unknown>(null);

  const overallProgress = computed<OverallProgress>(
    () => progress.value?.overall ?? EMPTY_OVERALL_PROGRESS
  );

  const personalProgress = computed<PersonalProgress>(
    () => progress.value?.personal ?? EMPTY_PERSONAL_PROGRESS
  );

  // const monthlyProgress = computed<MonthlyProgress>(
  //   () => progress.value?.monthlyProgress ?? EMPTY_MONTHLY_PROGRESS
  // );

  // TODO API에서 데이터가 8월 데이터만 와서 임시로 mock 데이터로 작업
  const monthlyProgress = computed<MonthlyProgress>(() => {
    if (!progress.value) return EMPTY_MONTHLY_PROGRESS;

    return {
      ...progress.value.monthlyProgress,
      months: MOCK_MONTHLY_PROGRESS.months,
    };
  });

  const isLoaded = computed(() => progress.value !== null);

  async function fetchProgress() {
    loading.value = true;

    try {
      const data = await getProgress();
      progress.value = data;
    } catch (err) {
      console.error('진행 현황 조회 실패: ', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    progress.value = null;
    error.value = null;
  }

  return {
    loading,
    error,
    overallProgress,
    personalProgress,
    monthlyProgress,
    isLoaded,
    fetchProgress,
    reset,
  };
});
