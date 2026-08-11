import { api } from '@/server/axios';
import type { ApiResponse } from '@/types/common';
import type {
  MonthlyProgressResponse,
  ProgressCompletionResponse,
  ProgressResponse,
} from '@/types/progress';

export const getProgress = async () => {
  const { data } = await api.get<ApiResponse<ProgressResponse>>('/progress');

  return data.data;
};

export const getMonthlyProgress = async () => {
  const { data } = await api.get<ApiResponse<MonthlyProgressResponse>>('/progress/monthly');

  return data.data;
};

export const patchProgressCompletion = async (goalItemId: number) => {
  const { data } = await api.patch<ApiResponse<ProgressCompletionResponse>>(
    `/progress/items/${goalItemId}/completion`
  );

  return data.data;
};
