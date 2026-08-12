import {
  LucideProps,
  Utensils,
  House,
  ShoppingBag,
  Ticket,
  Building2,
  Camera,
  Brush,
  Shirt,
  ShieldAlert,
  Package,
} from '@lucide/vue';

export type ExpenseCategoryCode =
  | 'FOOD'
  | 'LIVING'
  | 'SHOPPING'
  | 'CULTURE'
  | 'WEDDINGHALL'
  | 'STUDIO'
  | 'MAKEUP'
  | 'DRESS'
  | 'EMERGENCY'
  | 'ETC';

export const ExpenseCategoryName: Record<ExpenseCategoryCode, string> = {
  FOOD: '식비',
  LIVING: '생활',
  SHOPPING: '쇼핑',
  CULTURE: '문화/여가',

  WEDDINGHALL: '예식장',
  STUDIO: '스튜디오',
  MAKEUP: '메이크업',
  DRESS: '드레스',
  EMERGENCY: '예비비',

  ETC: '기타',
};

export const ExpenseCategoryColors: Record<ExpenseCategoryCode, string> = {
  FOOD: '#ff9ebf',
  LIVING: '#7DD3C7',
  SHOPPING: '#8B5CF6',
  CULTURE: '#A78BFA',

  WEDDINGHALL: '#ffdfea',
  STUDIO: '#ffbed4',
  MAKEUP: '#ff9ebf',
  DRESS: '#ff5d94',
  EMERGENCY: '#EF4444',
  ETC: '#9CA3AF',
};

export const ExpenseCategoryIcon: Record<
  ExpenseCategoryCode,
  __VLS_FunctionalComponent<LucideProps>
> = {
  FOOD: Utensils,
  LIVING: House,
  SHOPPING: ShoppingBag,
  CULTURE: Ticket,

  WEDDINGHALL: Building2,
  STUDIO: Camera,
  MAKEUP: Brush,
  DRESS: Shirt,
  EMERGENCY: ShieldAlert,

  ETC: Package,
};
