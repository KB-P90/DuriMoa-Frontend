export type LocalDateDto = string | [number, number, number];

export interface SpendingReportTrendResponseDto {
  key: string;
  label: string;
  startDate: LocalDateDto;
  endDate: LocalDateDto;
  amount: number;
  transactionCount: number;
  partialPeriod: boolean;
}

export interface SpendingReportCategoryResponseDto {
  code: string;
  name: string;
  amount: number;
  ratio: number;
  transactionCount: number;
}

export interface SpendingReportWeekdayResponseDto {
  code: string;
  name: string;
  totalAmount: number;
  averageAmount: number;
  calendarDayCount: number;
  relativeStrength: number;
}

export interface SpendingReportWeekdayAnalysisResponseDto {
  weekdays: SpendingReportWeekdayResponseDto[];
  weekdayDailyAverage: number;
  weekendDailyAverage: number;
  weekendToWeekdayRatio: number | null;
  peakDayCode: string;
  peakDayName: string;
  peakDayAverage: number;
  topWeekendCategoryName: string | null;
}

export interface SpendingReportResponseDto {
  analysisStartDate: LocalDateDto;
  analysisEndDate: LocalDateDto;
  dataStartDate: LocalDateDto | null;
  generatedAt: string;
  analysisDays: number;
  dataSufficient: boolean;
  totalExpense: number;
  averageMonthlyExpense: number;
  transactionCount: number;
  topCategoryName: string | null;
  topCategoryRatio: number;
  recentTrendRate: number | null;
  trendUnit: 'WEEKLY' | 'MONTHLY';
  trend: SpendingReportTrendResponseDto[];
  categories: SpendingReportCategoryResponseDto[];
  weekdayAnalysis: SpendingReportWeekdayAnalysisResponseDto;
  summary: string;
  warning: string | null;
}
