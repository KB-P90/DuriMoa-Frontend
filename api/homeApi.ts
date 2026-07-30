import { apiClient } from '@/api/axios';
import type { ApiResponse } from '@/types/common';
import type { HomeDashboardResponseDto, MonthlySavingMissionsResponseDto } from '@/types/dto/home.dto';

export const getHomeDashboard = async () => {
  const { data } = await apiClient.get<ApiResponse<HomeDashboardResponseDto>>('/api/home');
  return data.data;
};

export const getMonthlySavingMissions = async (year: number, month: number) => {
  const { data } = await apiClient.get<ApiResponse<MonthlySavingMissionsResponseDto>>('/api/expense/saving-missions', {
    params: { year, month },
  });
  return data.data;
};
