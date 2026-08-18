import type {
  ExpenseFeedbackDto,
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
  return { ...dto };
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
    receiverId: dto.receiver_id,
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
