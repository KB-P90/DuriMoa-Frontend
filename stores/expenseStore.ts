import { defineStore } from 'pinia';
import { getMonthlyExpense, getMonthlySavingMissions } from '@/server/expenseApi';
import type { MonthlyExpenseResponse, MonthlySavingMissionResponse } from '@/types/expense';

const EMPTY_MONTHLY_EXPENSE: MonthlyExpenseResponse = {
  year: 0,
  month: 0,
  totalAmount: 0,
  expenseCategories: [],
};

const EMPTY_SAVING_MISSIONS: MonthlySavingMissionResponse = {
  yearMonth: '',
  totalExpectedSavingAmount: 0,
  missions: [],
};

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    monthlyExpense: EMPTY_MONTHLY_EXPENSE,
    savingMissions: EMPTY_SAVING_MISSIONS,
    expenseLoading: false,
    missionLoading: false,
  }),

  actions: {
    async fetchMonthlyExpense(year: number, month: number) {
      this.expenseLoading = true;

      try {
        const data = await getMonthlyExpense(year, month);
        this.monthlyExpense = data;
      } catch (error) {
        console.error('월별 지출 조회 실패', error);
      } finally {
        this.expenseLoading = false;
      }
    },

    async fetchSavingMissions(year: number, month: number) {
      this.missionLoading = true;

      try {
        const data = await getMonthlySavingMissions(year, month);
        this.savingMissions = data;
      } catch (error) {
        console.error('절약 미션 조회 실패', error);
      } finally {
        this.missionLoading = false;
      }
    },
  },
});
