export type CalendarRecordTypeDto = 'INCOME' | 'EXPENSE' | 'SAVING';

export interface CalendarDayDto {
  date: string;
  hasIncome: boolean;
  hasExpense: boolean;
  hasSaving: boolean;
}

export interface MonthlyPersonalSummaryDto {
  income: number;
  expense: number;
  saving: number;
}

export interface MonthlyWeddingSummaryDto {
  goalAmount: number;
  expense: number;
  saving: number;
}

export interface MonthlyPersonalResponseDto {
  summary: MonthlyPersonalSummaryDto;
  calendar: CalendarDayDto[];
}

export interface MonthlyWeddingResponseDto {
  summary: MonthlyWeddingSummaryDto;
  calendar: CalendarDayDto[];
}

export type MonthlyCalendarResponseDto = MonthlyPersonalResponseDto | MonthlyWeddingResponseDto;

export interface DailyRecordDto {
  recordId: number;
  type: CalendarRecordTypeDto;
  category: string;
  amount: number;
  memo: string | null;
  owner: string;
  ownerId: number;
  isMine: boolean;
  isUserCreated: boolean;
}

export interface DailyCalendarResponseDto {
  date: string;
  count: number;
  records: DailyRecordDto[];
}

export interface RecordRequestDto {
  type: CalendarRecordTypeDto;
  category: string;
  amount: number;
  recordDate: string;
  memo: string;
}

export interface RecordResponseDto {
  recordId: number;
}
