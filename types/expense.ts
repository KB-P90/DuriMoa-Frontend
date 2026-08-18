import type { ExpenseCategoryCode } from './category';
import type { MonthlyExpenseCategoryCodeDto } from './dto/expense.dto';

export type MonthlyExpenseCategoryCode = MonthlyExpenseCategoryCodeDto;

export interface MonthlyExpenseCategory {
  categoryId: number;
  categoryCode: MonthlyExpenseCategoryCode;
  categoryName: string;
  amount: number;
  rate: number;
}

export interface MonthlyExpenseUser {
  userId: number;
  name: string;
  expenseCategories: MonthlyExpenseCategory[];
}

export interface ExpenseFeedback {
  feedbackId: number | null;
  writerUserId: number;
  writerName: string;
  receiverId: number;
  content: string;
}

export interface MonthlyExpense {
  year: number;
  month: number;
  me: MonthlyExpenseUser;
  partner: MonthlyExpenseUser;
  feedbacks: ExpenseFeedback[];
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
