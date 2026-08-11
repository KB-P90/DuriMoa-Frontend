import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getMonthlyProgress, getProgress } from '@/server/progressApi';
import type {
  MonthlyProgressResponse,
  OverallProgress,
  PersonalProgress,
  ProgressResponse,
} from '@/types/progress';

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

  const monthlyProgress = ref<MonthlyProgressResponse | null>(null);

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

  async function fetchMonthlyProgress() {
    loading.value = true;

    try {
      const data = await getMonthlyProgress();
      monthlyProgress.value = data;
    } catch (err) {
      console.error('월별 예산 달성 현황 조회 실패: ', err);
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
    fetchProgress,
    fetchMonthlyProgress,
    reset,
  };
});
