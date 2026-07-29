export type CalendarMode = 'wedding' | 'personal';
export type TransactionType = 'income' | 'expense' | 'saving';

export interface CalendarDay {
  date: number;
  currentMonth: boolean;
  markers: readonly TransactionType[];
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

export interface SummaryItem {
  label: string;
  amount: number;
  type: TransactionType | 'goal';
}
