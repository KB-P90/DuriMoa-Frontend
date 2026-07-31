import { defineStore } from 'pinia';
import { getMonthlyExpense, getMonthlySavingMissions } from '@/apis/expenseApi';
import type { MonthlyExpenseResponse, MonthlySavingMissionResponse } from '@/types/expense';

const MOCK_MONTHLY_EXPENSE: MonthlyExpenseResponse = {
  year: 2026,
  month: 7,
  expenseCategories: [
    {
      categoryId: 1,
      categoryCode: 'ETC',
      amount: 1046000,
      comparisonRate: 10,
      expenseRate: 31,
    },
    {
      categoryId: 2,
      categoryCode: 'DRESS',
      amount: 600000,
      comparisonRate: 10,
      expenseRate: 18,
    },
    {
      categoryId: 3,
      categoryCode: 'STUDIO',
      amount: 500000,
      comparisonRate: 10,
      expenseRate: 15,
    },
    {
      categoryId: 4,
      categoryCode: 'JEWELRY',
      amount: 300000,
      comparisonRate: 10,
      expenseRate: 9,
    },
    {
      categoryId: 5,
      categoryCode: 'FOOD',
      amount: 260500,
      comparisonRate: 10,
      expenseRate: 8,
    },
    {
      categoryId: 6,
      categoryCode: 'WEDDINGHALL',
      amount: 200000,
      comparisonRate: 10,
      expenseRate: 6,
    },
    {
      categoryId: 7,
      categoryCode: 'SHOPPING',
      amount: 186000,
      comparisonRate: 10,
      expenseRate: 6,
    },
    {
      categoryId: 8,
      categoryCode: 'MAKEUP',
      amount: 150000,
      comparisonRate: 10,
      expenseRate: 4,
    },
    {
      categoryId: 9,
      categoryCode: 'CULTURE',
      amount: 53000,
      comparisonRate: 10,
      expenseRate: 2,
    },
    {
      categoryId: 10,
      categoryCode: 'CAFE',
      amount: 38200,
      comparisonRate: 10,
      expenseRate: 1,
    },
    {
      categoryId: 11,
      categoryCode: 'TRANSPORT',
      amount: 23950,
      comparisonRate: 10,
      expenseRate: 1,
    },
  ],
};

const MOCK_SAVING_MISSIONS: MonthlySavingMissionResponse = {
  yearMonth: '2026-07',
  totalExpectedSavingAmount: 120000,
  missions: [
    {
      missionId: 101,
      categoryCode: 'CAFE',
      title: '주 3회에서 주 1회로 줄이기',
      expectedSavingAmount: 30000,
      status: '도전하기',
      isSelectable: true,
    },
    {
      missionId: 102,
      categoryCode: 'DELIVERY',
      title: '월 4회에서 월 2회로 줄이기',
      expectedSavingAmount: 40000,
      status: '도전중',
      isSelectable: false,
    },
    {
      missionId: 103,
      categoryCode: 'SHOPPING',
      title: '계획 없는 쇼핑 줄이기',
      expectedSavingAmount: 30000,
      status: '도전중',
      isSelectable: false,
    },
    {
      missionId: 104,
      categoryCode: 'SUBSCRIPTION',
      title: '사용하지 않는 구독 정리하기',
      expectedSavingAmount: 20000,
      status: '도전하기',
      isSelectable: true,
    },
  ],
};

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    monthlyExpense: MOCK_MONTHLY_EXPENSE,
    savingMissions: MOCK_SAVING_MISSIONS,
    expenseLoading: false,
    missionLoading: false,
  }),

  actions: {
    async fetchMonthlyExpense(year: number, month: number) {
      this.expenseLoading = true;

      try {
        const data = await getMonthlyExpense(year, month);
        this.monthlyExpense = data;
      } catch {
        this.monthlyExpense = MOCK_MONTHLY_EXPENSE;
      } finally {
        this.expenseLoading = false;
      }
    },

    async fetchSavingMissions(year: number, month: number) {
      this.missionLoading = true;

      try {
        const data = await getMonthlySavingMissions(year, month);
        this.savingMissions = data;
      } catch {
        this.savingMissions = MOCK_SAVING_MISSIONS;
      } finally {
        this.missionLoading = false;
      }
    },
  },
});
