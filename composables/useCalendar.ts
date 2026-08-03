import { computed, ref, watch } from 'vue';
import {
  createRecord,
  deleteRecord,
  getDailyCalendar,
  getMonthlyCalendar,
  updateRecord,
} from '@/apis/calendarApi';
import type { CalendarApiType } from '@/apis/calendarApi';
import { toCalendarMonthData, toRecordRequest, toTransaction } from '@/models/Calendar';
import type {
  CalendarDay,
  CalendarMode,
  SummaryItem,
  Transaction,
  TransactionForm,
  TransactionType,
} from '@/types/calendar';

const EMPTY_SUMMARY: readonly SummaryItem[] = [];
const MODE_TO_API_TYPE: Record<CalendarMode, CalendarApiType> = {
  personal: 'PERSONAL',
  wedding: 'WEDDING',
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function toDateKey(year: number, monthIndex: number, date: number) {
  const normalizedDate = new Date(year, monthIndex, date);
  return `${normalizedDate.getFullYear()}-${pad(normalizedDate.getMonth() + 1)}-${pad(normalizedDate.getDate())}`;
}

function getInitialDate(month: Date) {
  const today = new Date();
  const date =
    today.getFullYear() === month.getFullYear() && today.getMonth() === month.getMonth()
      ? today.getDate()
      : 1;
  return toDateKey(month.getFullYear(), month.getMonth(), date);
}

function createCalendarDays(
  month: Date,
  markersByDate: Readonly<Record<string, readonly TransactionType[]>>
): readonly CalendarDay[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPreviousMonth = new Date(year, monthIndex, 0).getDate();
  const days: CalendarDay[] = [];

  for (let offset = firstWeekday; offset > 0; offset -= 1) {
    const date = daysInPreviousMonth - offset + 1;
    days.push({
      isoDate: toDateKey(year, monthIndex - 1, date),
      date,
      currentMonth: false,
      markers: [],
    });
  }

  for (let date = 1; date <= daysInMonth; date += 1) {
    const isoDate = toDateKey(year, monthIndex, date);
    days.push({
      isoDate,
      date,
      currentMonth: true,
      markers: markersByDate[isoDate] ?? [],
    });
  }

  const trailingDayCount = (7 - (days.length % 7)) % 7;
  for (let date = 1; date <= trailingDayCount; date += 1) {
    days.push({
      isoDate: toDateKey(year, monthIndex + 1, date),
      date,
      currentMonth: false,
      markers: [],
    });
  }

  return days;
}

export function useCalendar() {
  const today = new Date();
  const mode = ref<CalendarMode>('personal');
  const visibleMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1));
  const selectedDate = ref(getInitialDate(visibleMonth.value));
  const selectedTransaction = ref<Transaction | null>(null);
  const isEditorOpen = ref(false);
  const summary = ref<readonly SummaryItem[]>(EMPTY_SUMMARY);
  const markersByDate = ref<Readonly<Record<string, readonly TransactionType[]>>>({});
  const transactions = ref<readonly Transaction[]>([]);
  const isLoading = ref(false);
  const isSubmitting = ref(false);

  const monthKey = computed(() => toMonthKey(visibleMonth.value));
  const monthLabel = computed(
    () => `${visibleMonth.value.getFullYear()}년 ${visibleMonth.value.getMonth() + 1}월`
  );
  const selectedDateLabel = computed(() => {
    const [, month, date] = selectedDate.value.split('-');
    return `${Number(month)}월 ${Number(date)}일`;
  });
  const calendarDays = computed(() => createCalendarDays(visibleMonth.value, markersByDate.value));

  async function fetchDaily() {
    try {
      const response = await getDailyCalendar(selectedDate.value, MODE_TO_API_TYPE[mode.value]);
      transactions.value = response.records.map((record) => toTransaction(record, response.date));
    } catch {
      transactions.value = [];
    }
  }

  async function fetchMonth() {
    isLoading.value = true;
    summary.value = EMPTY_SUMMARY;
    markersByDate.value = {};
    transactions.value = [];
    try {
      const response = await getMonthlyCalendar(monthKey.value, MODE_TO_API_TYPE[mode.value]);
      const calendar = toCalendarMonthData(response, mode.value);
      summary.value = calendar.summary;
      markersByDate.value = calendar.markersByDate;
      await fetchDaily();
    } catch {
      summary.value = EMPTY_SUMMARY;
      markersByDate.value = {};
      transactions.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function selectDate(date: string) {
    selectedDate.value = date;
    await fetchDaily();
  }

  function changeMonth(offset: number) {
    const nextMonth = new Date(
      visibleMonth.value.getFullYear(),
      visibleMonth.value.getMonth() + offset,
      1
    );
    selectedDate.value = getInitialDate(nextMonth);
    visibleMonth.value = nextMonth;
  }

  function openCreateTransaction() {
    selectedTransaction.value = null;
    isEditorOpen.value = true;
  }

  function selectTransaction(transaction: Transaction) {
    selectedTransaction.value = { ...transaction };
    isEditorOpen.value = true;
  }

  function closeEditor() {
    isEditorOpen.value = false;
    selectedTransaction.value = null;
  }

  async function refreshAfterMutation(recordDate: string) {
    selectedDate.value = recordDate;
    const [year, month] = recordDate.split('-').map(Number);
    const targetMonth = new Date(year, month - 1, 1);

    if (toMonthKey(targetMonth) !== monthKey.value) {
      visibleMonth.value = targetMonth;
      return;
    }

    await fetchMonth();
  }

  async function saveTransaction(form: TransactionForm) {
    isSubmitting.value = true;

    try {
      const request = toRecordRequest(form);
      if (selectedTransaction.value) {
        await updateRecord(selectedTransaction.value.id, request);
      } else {
        await createRecord(request);
      }

      closeEditor();
      await refreshAfterMutation(form.recordDate);
    } finally {
      isSubmitting.value = false;
    }
  }

  async function removeTransaction() {
    if (!selectedTransaction.value) return;
    isSubmitting.value = true;

    try {
      await deleteRecord(selectedTransaction.value.id);
      closeEditor();
      await fetchMonth();
    } finally {
      isSubmitting.value = false;
    }
  }

  watch([mode, monthKey], fetchMonth, { immediate: true });

  return {
    mode,
    selectedDate,
    selectedDateLabel,
    selectedTransaction,
    isEditorOpen,
    calendarDays,
    monthLabel,
    summary,
    transactions,
    isLoading,
    isSubmitting,
    selectDate,
    changeMonth,
    openCreateTransaction,
    selectTransaction,
    closeEditor,
    saveTransaction,
    removeTransaction,
  };
}
