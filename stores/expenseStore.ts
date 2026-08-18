import { defineStore } from 'pinia';
import { getMonthlyExpense, getMonthlySavingMissions } from '@/server/expenseApi';
import { toExpenseFeedback, toMonthlyExpense } from '@/models/Expense';
import type { MonthlyExpense, MonthlySavingMissionResponse } from '@/types/expense';

const EMPTY_MONTHLY_EXPENSE: MonthlyExpense = {
  year: 0,
  month: 0,
  me: { userId: 0, name: '', expenseCategories: [] },
  partner: { userId: 0, name: '', expenseCategories: [] },
  feedbacks: [],
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
        this.monthlyExpense = {
          ...toMonthlyExpense(data),
          feedbacks: data.feedbacks.map(toExpenseFeedback),
        };
      } catch (error) {
        console.error('월별 지출 조회 실패', error);
      } finally {
        this.expenseLoading = false;
      }
    },

    async fetchSavingMissions(year: number, month: number) {
      this.missionLoading = true;
      try {
        this.savingMissions = await getMonthlySavingMissions(year, month);
      } catch (error) {
        console.error('절약 미션 조회 실패', error);
      } finally {
        this.missionLoading = false;
      }
    },
  },
});
