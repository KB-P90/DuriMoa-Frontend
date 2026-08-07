import { api } from '@/server/axios';
import type { ApiResponse } from '@/types/common';
import type { ProgressResponse } from '@/types/progress';

export const getProgress = async () => {
  const { data } = await api.get<ApiResponse<ProgressResponse>>('/progress');

  return data.data;
};
