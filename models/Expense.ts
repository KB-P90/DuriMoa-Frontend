import type {
  ExpenseFeedbackDto,
  ExpenseFeedbackUpsertResponseDto,
  MonthlyExpenseCategoryDto,
  MonthlyExpenseResponseDto,
  MonthlyExpenseUserDto,
} from '@/types/dto/expense.dto';
import type {
  ExpenseFeedback,
  MonthlyExpense,
  MonthlyExpenseCategory,
  MonthlyExpenseUser,
} from '@/types/expense';

export function toMonthlyExpenseCategory(dto: MonthlyExpenseCategoryDto): MonthlyExpenseCategory {
  return {
    ...dto,
    categoryCode: dto.categoryCode === 'CULTURE' ? 'CULTURE_TRAVEL' : dto.categoryCode,
  };
}

export function toMonthlyExpenseUser(dto: MonthlyExpenseUserDto): MonthlyExpenseUser {
  return {
    userId: dto.userId,
    name: dto.name,
    expenseCategories: dto.expenseCategories.map(toMonthlyExpenseCategory),
  };
}

export function toExpenseFeedback(dto: ExpenseFeedbackDto): ExpenseFeedback {
  return {
    feedbackId: dto.feedbackId,
    writerUserId: dto.writerUserId,
    writerName: dto.writerName,
    writerProfileImageUrl: dto.writerProfileImageUrl ?? null,
    receiverId: dto.receiverUserId,
    content: dto.content,
  };
}

export function toUpsertedExpenseFeedback(dto: ExpenseFeedbackUpsertResponseDto): ExpenseFeedback {
  return {
    feedbackId: dto.feedbackId,
    writerUserId: dto.writerUserId,
    writerName: dto.writerName,
    writerProfileImageUrl: null,
    receiverId: dto.receiverUserId,
    content: dto.content,
  };
}

export function toMonthlyExpense(dto: MonthlyExpenseResponseDto): MonthlyExpense {
  return {
    year: dto.year,
    month: dto.month,
    me: toMonthlyExpenseUser(dto.me),
    partner: toMonthlyExpenseUser(dto.partner),
    feedbacks: [],
  };
}
