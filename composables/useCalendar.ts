import { computed, ref } from 'vue';
import type {
  CalendarDay,
  CalendarMode,
  SummaryItem,
  Transaction,
  TransactionType,
} from '@/types/calendar';

const MARKERS: Partial<Record<number, readonly TransactionType[]>> = {
  4: ['expense'],
  9: ['saving'],
  11: ['saving', 'expense'],
  15: ['income', 'expense', 'saving'],
  16: ['expense'],
  20: ['expense', 'saving'],
  23: ['saving'],
  28: ['expense'],
};

const TRANSACTIONS: readonly Transaction[] = [
  {
    id: 1,
    title: '급여',
    category: '수입',
    owner: '김민준',
    type: 'income',
    amount: 3000000,
    icon: '💰',
    date: '2026년 7월 15일 (수)',
    memo: '',
  },
  {
    id: 2,
    title: '결혼식장',
    category: '개인저축',
    owner: '이서연',
    type: 'expense',
    amount: -80000,
    icon: '🍽️',
    date: '2026년 7월 15일 (수)',
    memo: '',
  },
  {
    id: 3,
    title: '저축 (자동이체)',
    category: '저축',
    owner: '김민준',
    type: 'saving',
    amount: -1000000,
    icon: '🏦',
    date: '2026년 7월 15일 (수)',
    memo: '',
  },
];

export function useCalendar() {
  const mode = ref<CalendarMode>('wedding');
  const selectedDate = ref(15);
  const selectedTransaction = ref<Transaction | null>(null);

  const calendarDays = computed<readonly CalendarDay[]>(() => [
    ...[28, 29, 30].map((date) => ({ date, currentMonth: false, markers: [] })),
    ...Array.from({ length: 31 }, (_, index) => {
      const date = index + 1;
      return { date, currentMonth: true, markers: MARKERS[date] ?? [] };
    }),
  ]);

  const summary = computed<readonly SummaryItem[]>(() =>
    mode.value === 'wedding'
      ? [
          { label: '목표 금액', amount: 5000000, type: 'goal' },
          { label: '지출', amount: 3200000, type: 'expense' },
          { label: '저축', amount: 1800000, type: 'saving' },
        ]
      : [
          { label: '수입', amount: 5000000, type: 'income' },
          { label: '지출', amount: 3200000, type: 'expense' },
          { label: '저축', amount: 1800000, type: 'saving' },
        ],
  );

  const transactions = computed<readonly Transaction[]>(() =>
    mode.value === 'personal'
      ? TRANSACTIONS.map((transaction) =>
          transaction.id === 2 ? { ...transaction, title: '식비', category: '개인소비' } : transaction,
        )
      : TRANSACTIONS,
  );

  function selectTransaction(transaction: Transaction) {
    selectedTransaction.value = { ...transaction };
  }

  function closeTransaction() {
    selectedTransaction.value = null;
  }

  return {
    mode,
    selectedDate,
    selectedTransaction,
    calendarDays,
    summary,
    transactions,
    selectTransaction,
    closeTransaction,
  };
}
