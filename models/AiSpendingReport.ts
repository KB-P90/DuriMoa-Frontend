import type { ExpenseCategoryCode } from '@/types/category';
import type { LocalDateDto, SpendingReportResponseDto } from '@/types/dto/aiSpendingReport.dto';
import type { SpendingReport } from '@/types/aiSpendingReport';

const EXPENSE_CATEGORY_CODES: readonly ExpenseCategoryCode[] = [
  'FOOD',
  'LIVING',
  'SHOPPING',
  'CULTURE',
  'WEDDINGHALL',
  'STUDIO',
  'MAKEUP',
  'DRESS',
  'EMERGENCY',
  'ETC',
];

function toExpenseCategoryCode(code: string): ExpenseCategoryCode {
  return EXPENSE_CATEGORY_CODES.includes(code as ExpenseCategoryCode)
    ? (code as ExpenseCategoryCode)
    : 'ETC';
}

function toIsoDate(value: LocalDateDto): string {
  if (typeof value === 'string') return value;

  const [year, month, day] = value;
  return [year, month, day]
    .map((part, index) => (index === 0 ? String(part) : String(part).padStart(2, '0')))
    .join('-');
}

export function toSpendingReport(dto: SpendingReportResponseDto): SpendingReport {
  return {
    analysisStartDate: toIsoDate(dto.analysisStartDate),
    analysisEndDate: toIsoDate(dto.analysisEndDate),
    dataStartDate: dto.dataStartDate ? toIsoDate(dto.dataStartDate) : null,
    generatedAt: dto.generatedAt,
    analysisDays: dto.analysisDays,
    dataSufficient: dto.dataSufficient,
    totalExpense: dto.totalExpense,
    averageMonthlyExpense: dto.averageMonthlyExpense,
    transactionCount: dto.transactionCount,
    topCategoryName: dto.topCategoryName,
    topCategoryRatio: dto.topCategoryRatio,
    recentTrendRate: dto.recentTrendRate,
    trendUnit: dto.trendUnit === 'WEEKLY' ? 'weekly' : 'monthly',
    trend: dto.trend.map((item) => ({
      ...item,
      startDate: toIsoDate(item.startDate),
      endDate: toIsoDate(item.endDate),
    })),
    categories: dto.categories.map((item) => ({
      ...item,
      code: toExpenseCategoryCode(item.code),
    })),
    weekdayAnalysis: {
      ...dto.weekdayAnalysis,
      weekdays: dto.weekdayAnalysis.weekdays.map((item) => ({ ...item })),
    },
    summary: dto.summary,
    warning: dto.warning,
  };
}
