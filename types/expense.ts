import { ExpenseCategoryCode } from './category';

export interface ExpenseCategory {
  categoryId: number;
  categoryCode: ExpenseCategoryCode;
  amount: number;
  comparisonRate: number;
  expenseRate: number;
}

export interface MonthlyExpenseResponse {
  year: number;
  month: number;
  expenseCategories: ExpenseCategory[];
}

export interface SavingMission {
  missionId: number;
  categoryCode: ExpenseCategoryCode;
  title: string;
  expectedSavingAmount: number;
  status: '도전하기' | '도전중';
  isSelectable: boolean;
}

export interface MonthlySavingMissionResponse {
  yearMonth: string;
  totalExpectedSavingAmount: number;
  missions: SavingMission[];
}

export interface SavingMissionChallengeRequest {
  yearMonth: string;
}
