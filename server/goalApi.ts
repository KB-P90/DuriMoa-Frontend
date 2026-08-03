import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { GoalCategoryStat, GoalSubmission } from '@/types/goal';

export const getGoalCategoryStat = async (region: string, category: string) => {
  const { data } = await api.get<ApiResponse<GoalCategoryStat>>('/goal/stat', {
    params: { region, category },
  });
  return data.data;
};

export const postGoal = async (payload: GoalSubmission) => {
  const { data } = await api.post<ApiResponse<unknown>>('/goal', payload);
  return data.data;
};
