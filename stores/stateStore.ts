import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getProgressStatus } from '@/server/statusApi';
import type {
  MonthlyProgress,
  OverallStatus,
  PersonalStatus,
  ProgressStatusResponse,
} from '@/types/status';

const EMPTY_OVERALL_STATUS: OverallStatus = {
  targetAmount: 0,
  currentAmount: 0,
  progressRate: 0,
  completedItemCount: 0,
  totalItemCount: 0,
  items: [],
};

const EMPTY_PERSONAL_STATUS: PersonalStatus = {
  members: [],
};

const EMPTY_MONTHLY_PROGRESS: MonthlyProgress = {
  overallProgressRate: 0,
  months: [],
};

export const useStateStore = defineStore('state', () => {
  const progressStatus = ref<ProgressStatusResponse | null>(null);
  const loading = ref(false);
  const error = ref<unknown>(null);

  const overallStatus = computed<OverallStatus>(
    () => progressStatus.value?.overall ?? EMPTY_OVERALL_STATUS
  );

  const personalStatus = computed<PersonalStatus>(
    () => progressStatus.value?.personal ?? EMPTY_PERSONAL_STATUS
  );

  const monthlyProgress = computed<MonthlyProgress>(
    () => progressStatus.value?.monthlyProgress ?? EMPTY_MONTHLY_PROGRESS
  );

  async function fetchProgressStatus() {
    loading.value = true;

    try {
      const data = await getProgressStatus();
      progressStatus.value = data;
    } catch (err) {
      console.error('진행 현황 조회 실패: ', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    progressStatus.value = null;
    error.value = null;
  }

  return {
    loading,
    error,
    overallStatus,
    personalStatus,
    monthlyProgress,
    fetchProgressStatus,
    reset,
  };
});
