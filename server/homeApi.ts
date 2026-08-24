import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { HomeDashboardResponseDto } from '@/types/dto/home.dto';
import type { MonthlySavingMissionResponse } from '@/types/expense';

export const getHomeDashboard = async () => {
  const { data } = await api.get<ApiResponse<HomeDashboardResponseDto>>('/home');
  if (data.success === false) {
    return null;
  }

  return data.data;
};

// /expense/saving-missions는 월별 지출 화면(expenseApi.getMonthlySavingMissions)과 같은 엔드포인트라
// 실제 응답 형태(camelCase)를 그대로 따르는 MonthlySavingMissionResponse 타입을 재사용한다.
export const getMonthlySavingMissions = async (year: number, month: number) => {
  const { data } = await api.get<ApiResponse<MonthlySavingMissionResponse>>(
    '/expense/saving-missions',
    {
      params: { year, month },
    }
  );
  return data.data;
};
