import { api } from '@/server/axios';
import type { ApiResponse } from '@/types/common';
import type { MonthlyExpenseResponseDto } from '@/types/dto/expense.dto';
import type { MonthlySavingMissionResponse } from '@/types/expense';

export const getMonthlyExpense = async (year: number, month: number) => {
  const { data } = await api.get<ApiResponse<MonthlyExpenseResponseDto>>('/expense/monthly', {
    params: { year, month },
  });

  console.info('[월별 지출 관리 조회 성공]', data);

  return data.data;
};

export const getMonthlySavingMissions = async (year: number, month: number) => {
  const { data } = await api.get<ApiResponse<MonthlySavingMissionResponse>>(
    '/expense/saving-missions',
    {
      params: { year, month },
    }
  );

  return data.data;
};

export const startSavingMission = async (missionId: number, yearMonth: string): Promise<void> => {
  await api.post(`/expense/saving-missions/${missionId}`, {
    yearMonth,
  });
};
