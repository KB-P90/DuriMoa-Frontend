export type MonthlyExpenseCategoryCodeDto = 'FOOD' | 'LIVING' | 'SHOPPING' | 'CULTURE' | 'ETC';

export interface MonthlyExpenseCategoryDto {
  categoryId: number;
  categoryCode: MonthlyExpenseCategoryCodeDto;
  categoryName: string;
  amount: number;
  rate: number;
}

export interface MonthlyExpenseUserDto {
  userId: number;
  name: string;
  expenseCategories: MonthlyExpenseCategoryDto[];
}

export interface ExpenseFeedbackDto {
  feedbackId: number;
  writerUserId: number;
  writerName: string;
  writerProfileImageUrl?: string | null;
  receiverUserId: number;
  content: string;
}

export interface ExpenseFeedbackUpsertRequestDto {
  year: number;
  month: number;
  content: string;
}

export interface ExpenseFeedbackUpsertResponseDto {
  feedbackId: number;
  writerUserId: number;
  writerName: string;
  receiverUserId: number;
  receiverName: string;
  year: number;
  month: number;
  content: string;
}

export interface MonthlyExpenseResponseDto {
  year: number;
  month: number;
  me: MonthlyExpenseUserDto;
  partner: MonthlyExpenseUserDto;
  feedbacks: ExpenseFeedbackDto[];
}
