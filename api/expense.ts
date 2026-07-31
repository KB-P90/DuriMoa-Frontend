import { api } from '@/api/axios';
import { MonthlyExpenseResponse, MonthlySavingMissionResponse } from '@/types/expense';
import { ApiResponse } from '@/types/common';

export const getMonthlyExpense = async (
  year: number,
  month: number
): Promise<MonthlyExpenseResponse> => {
  const { data } = await api.get<ApiResponse<MonthlyExpenseResponse>>('/expense/monthly', {
    params: {
      year,
      month,
    },
  });

  return data.data;
};

export const getMonthlySavingMissions = async (
  year: number,
  month: number
): Promise<MonthlySavingMissionResponse> => {
  const { data } = await api.get<ApiResponse<MonthlySavingMissionResponse>>(
    '/expense/saving-missions',
    {
      params: {
        year,
        month,
      },
    }
  );

  return data.data;
};

export const startSavingMission = async (missionId: number, yearMonth: string): Promise<void> => {
  await api.post(`/expense/saving-missions/${missionId}`, {
    yearMonth,
  });
};
