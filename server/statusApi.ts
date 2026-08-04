import { api } from '@/server/axios';
import { ApiResponse } from '@/types/common';
import { ProgressStatusResponse } from '@/types/status';

export const getProgressStatus = async () => {
  const { data } = await api.get<ApiResponse<ProgressStatusResponse>>('/progress');

  return data.data;
};
