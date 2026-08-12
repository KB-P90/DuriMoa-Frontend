import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axios from 'axios';

import { getMonthlyProgress, getProgress, patchProgressCompletion } from '@/server/progressApi';
import type {
  MonthlyProgressResponse,
  OverallProgress,
  PersonalProgress,
  ProgressResponse,
} from '@/types/progress';
import { ApiErrorResponse } from '@/types/common';

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
  const monthlyProgress = ref<MonthlyProgressResponse | null>(null);

  const loading = ref(false);
  const completingGoalItemId = ref<number | null>(null);

  const error = ref<unknown>(null);
  const unavailableReason = ref<'NO_COUPLE' | 'NO_GOAL' | null>(null);

  const overallProgress = computed<OverallProgress>(
    () => progress.value?.overall ?? EMPTY_OVERALL_PROGRESS
  );

  const personalProgress = computed<PersonalProgress>(
    () => progress.value?.personal ?? EMPTY_PERSONAL_PROGRESS
  );

  async function fetchProgress() {
    loading.value = true;

    try {
      const data = await getProgress();
      progress.value = data;
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        if (err.response?.status === 404) {
          const message = err.response.data.message;

          if (message === '활성 결혼 목표를 찾을 수 없습니다.') {
            unavailableReason.value = 'NO_GOAL';
          } else if (message === '연결된 커플을 찾을 수 없습니다.') {
            unavailableReason.value = 'NO_COUPLE';
          }
        } else {
          error.value = err.message;
        }
      } else {
        error.value = '진행 현황을 불러오지 못했습니다.';
      }
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
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        if (err.response?.status === 404) {
          const message = err.response.data.message;

          if (message === '활성 결혼 목표를 찾을 수 없습니다.') {
            unavailableReason.value = 'NO_GOAL';
          } else if (message === '연결된 커플을 찾을 수 없습니다.') {
            unavailableReason.value = 'NO_COUPLE';
          }
        } else {
          error.value = err.message;
        }
      } else {
        error.value = '월별 예산 달성 현황을 불러오지 못했습니다.';
      }
    } finally {
      loading.value = false;
    }
  }

  async function toggleProgressCompletion(goalItemId: number, completed: boolean) {
    completingGoalItemId.value = goalItemId;

    try {
      const data = await patchProgressCompletion(goalItemId, completed);

      if (!progress.value?.overall) return;

      const item = progress.value.overall.items.find((item) => item.goalItemId === data.goalItemId);

      if (item) {
        item.completed = data.completed;
      }

      progress.value.overall.completedItemCount = data.completedItemCount;
      progress.value.overall.totalItemCount = data.totalItemCount;

      return data;
    } catch (err) {
      console.error('계약 완료 상태 변경 실패: ', err);
      error.value = err;
    } finally {
      completingGoalItemId.value = null;
    }
  }

  function reset() {
    progress.value = null;
    error.value = null;
  }

  return {
    loading,
    error,
    unavailableReason,
    overallProgress,
    personalProgress,
    monthlyProgress,
    fetchProgress,
    fetchMonthlyProgress,
    completingGoalItemId,
    toggleProgressCompletion,
    reset,
  };
});
