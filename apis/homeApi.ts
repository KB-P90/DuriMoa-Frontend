import { api } from '@/apis/axios.js';
import type { ApiResponse } from '@/types/common';
import type { HomeDashboardResponseDto, MonthlySavingMissionsResponseDto } from '@/types/dto/home.dto';

export const getHomeDashboard = async () => {
  const { data } = await api.get<ApiResponse<HomeDashboardResponseDto>>('/home');
  return data.data;
};

export const getMonthlySavingMissions = async (year: number, month: number) => {
  const { data } = await api.get<ApiResponse<MonthlySavingMissionsResponseDto>>('/expense/saving-missions', {
    params: { year, month },
  });
  return data.data;
};
