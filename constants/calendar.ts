import type { CalendarMode, TransactionType } from '@/types/calendar';

export const CALENDAR_CATEGORIES = {
  personal: {
    income: ['급여', '부수입', '기타'],
    expense: [
      '식비',
      '교통',
      '쇼핑',
      '카페/간식',
      '배달/외식',
      '구독 서비스',
      '문화/여가',
      '미용/패션',
      '기타',
    ],
    saving: ['저축'],
  },
  wedding: {
    income: ['축의금'],
    expense: ['예식장', '스튜디오', '메이크업', '드레스', '예물', '예비비'],
    saving: ['결혼 저축'],
  },
} as const satisfies Record<CalendarMode, Record<TransactionType, readonly string[]>>;

export const TRANSACTION_TYPES = [
  { key: 'income', label: '수입' },
  { key: 'expense', label: '지출' },
  { key: 'saving', label: '저축' },
] as const;
