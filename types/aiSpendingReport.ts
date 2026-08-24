import type { ExpenseCategoryCode } from '@/types/category';

export type AiSpendingReportStep = 'idle' | 'analyzing' | 'result';

export interface SpendingReportTrend {
  key: string;
  label: string;
  startDate: string;
  endDate: string;
  amount: number;
  transactionCount: number;
  partialPeriod: boolean;
}

export interface SpendingReportCategory {
  code: ExpenseCategoryCode;
  name: string;
  amount: number;
  ratio: number;
  transactionCount: number;
}

export interface SpendingReportWeekday {
  code: string;
  name: string;
  totalAmount: number;
  averageAmount: number;
  calendarDayCount: number;
  relativeStrength: number;
}

export interface SpendingReportWeekdayAnalysis {
  weekdays: SpendingReportWeekday[];
  weekdayDailyAverage: number;
  weekendDailyAverage: number;
  weekendToWeekdayRatio: number | null;
  peakDayCode: string;
  peakDayName: string;
  peakDayAverage: number;
  topWeekendCategoryName: string | null;
}

export interface SpendingReport {
  analysisStartDate: string;
  analysisEndDate: string;
  dataStartDate: string | null;
  generatedAt: string;
  analysisDays: number;
  dataSufficient: boolean;
  totalExpense: number;
  averageMonthlyExpense: number;
  transactionCount: number;
  topCategoryName: string | null;
  topCategoryRatio: number;
  recentTrendRate: number | null;
  trendUnit: 'weekly' | 'monthly';
  trend: SpendingReportTrend[];
  categories: SpendingReportCategory[];
  weekdayAnalysis: SpendingReportWeekdayAnalysis;
  summary: string;
  warning: string | null;
}
