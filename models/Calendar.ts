import type {
  CalendarDayDto,
  DailyRecordDto,
  MonthlyCalendarResponseDto,
  MonthlyPersonalResponseDto,
  RecordRequestDto,
} from '@/types/dto/calendar.dto';
import type {
  CalendarMode,
  CalendarMonthData,
  SummaryItem,
  Transaction,
  TransactionForm,
  TransactionType,
} from '@/types/calendar';

const RECORD_TYPE_MAP = {
  INCOME: 'income',
  EXPENSE: 'expense',
  SAVING: 'saving',
} as const satisfies Record<string, TransactionType>;

const TYPE_LABELS: Record<TransactionType, string> = {
  income: '수입',
  expense: '지출',
  saving: '저축',
};

function toMarkers(day: CalendarDayDto): readonly TransactionType[] {
  const markers: TransactionType[] = [];
  if (day.hasIncome) markers.push('income');
  if (day.hasExpense) markers.push('expense');
  if (day.hasSaving) markers.push('saving');
  return markers;
}

function isPersonalResponse(
  response: MonthlyCalendarResponseDto
): response is MonthlyPersonalResponseDto {
  return 'income' in response.summary;
}

function toSummary(
  response: MonthlyCalendarResponseDto,
  mode: CalendarMode
): readonly SummaryItem[] {
  if (mode === 'personal' && isPersonalResponse(response)) {
    return [
      { label: '수입', amount: response.summary.income, type: 'income' },
      { label: '지출', amount: response.summary.expense, type: 'expense' },
      { label: '저축', amount: response.summary.saving, type: 'saving' },
    ];
  }

  if (!isPersonalResponse(response)) {
    return [
      { label: '목표 금액', amount: response.summary.goalAmount, type: 'goal' },
      { label: '지출', amount: response.summary.expense, type: 'expense' },
      { label: '저축', amount: response.summary.saving, type: 'saving' },
    ];
  }

  return [];
}

export function toCalendarMonthData(
  response: MonthlyCalendarResponseDto,
  mode: CalendarMode
): CalendarMonthData {
  return {
    summary: toSummary(response, mode),
    markersByDate: Object.fromEntries(response.calendar.map((day) => [day.date, toMarkers(day)])),
  };
}

export function toTransaction(dto: DailyRecordDto, date: string): Transaction {
  const type = RECORD_TYPE_MAP[dto.type];

  return {
    id: dto.recordId,
    title: dto.category,
    category: TYPE_LABELS[type],
    owner: dto.owner,
    type,
    amount: type === 'income' ? dto.amount : -Math.abs(dto.amount),
    icon: '',
    date,
    memo: dto.memo ?? '',
  };
}

export function toRecordRequest(form: TransactionForm): RecordRequestDto {
  return {
    type: form.type.toUpperCase() as RecordRequestDto['type'],
    category: form.category,
    amount: Math.abs(form.amount),
    recordDate: form.recordDate,
    memo: form.memo,
  };
}
