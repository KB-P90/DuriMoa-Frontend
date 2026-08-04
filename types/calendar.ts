export type CalendarMode = 'wedding' | 'personal';
export type TransactionType = 'income' | 'expense' | 'saving';

export interface CalendarDay {
  isoDate: string;
  date: number;
  currentMonth: boolean;
  markers: readonly TransactionType[];
}

export interface CalendarMonthData {
  summary: readonly SummaryItem[];
  markersByDate: Readonly<Record<string, readonly TransactionType[]>>;
}

export interface Transaction {
  id: number;
  title: string;
  category: string;
  owner: string;
  type: TransactionType;
  amount: number;
  icon: string;
  date: string;
  memo: string;
}

export interface TransactionForm {
  type: TransactionType;
  category: string;
  amount: number;
  recordDate: string;
  memo: string;
}

export interface SummaryItem {
  label: string;
  amount: number;
  type: TransactionType | 'goal';
}
