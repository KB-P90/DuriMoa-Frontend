import {
  LucideProps,
  Utensils,
  Bus,
  ShoppingBag,
  Coffee,
  Bike,
  Tv,
  Ticket,
  Sparkles,
  Building2,
  Camera,
  Brush,
  Shirt,
  Gem,
  ShieldAlert,
  Package,
} from '@lucide/vue';

export type ExpenseCategoryCode =
  | 'FOOD'
  | 'TRANSPORT'
  | 'SHOPPING'
  | 'CAFE'
  | 'DELIVERY'
  | 'SUBSCRIPTION'
  | 'CULTURE'
  | 'BEAUTY'
  | 'WEDDINGHALL'
  | 'STUDIO'
  | 'MAKEUP'
  | 'DRESS'
  | 'JEWELRY'
  | 'EMERGENCY'
  | 'ETC';

export const ExpenseCategoryName: Record<ExpenseCategoryCode, string> = {
  FOOD: '식비',
  TRANSPORT: '교통',
  SHOPPING: '쇼핑',
  CAFE: '카페/간식',
  DELIVERY: '배달/외식',
  SUBSCRIPTION: '구독 서비스',
  CULTURE: '문화/여가',
  BEAUTY: '미용/패션',

  WEDDINGHALL: '예식장',
  STUDIO: '스튜디오',
  MAKEUP: '메이크업',
  DRESS: '드레스',
  JEWELRY: '예물',
  EMERGENCY: '예비비',

  ETC: '기타',
};

export const ExpenseCategoryColors: Record<ExpenseCategoryCode, string> = {
  FOOD: '#ff9ebf',
  CAFE: '#7DD3C7',
  SHOPPING: '#8B5CF6',
  TRANSPORT: '#FBBF24',
  DELIVERY: '#60A5FA',
  SUBSCRIPTION: '#64748B',
  CULTURE: '#A78BFA',
  BEAUTY: '#EC4899',

  WEDDINGHALL: '#ffdfea',
  STUDIO: '#ffbed4',
  MAKEUP: '#ff9ebf',
  DRESS: '#ff5d94',
  JEWELRY: '#ff4081',

  EMERGENCY: '#EF4444',
  ETC: '#9CA3AF',
};

export const ExpenseCategoryIcon: Record<
  ExpenseCategoryCode,
  __VLS_FunctionalComponent<LucideProps>
> = {
  FOOD: Utensils,
  TRANSPORT: Bus,
  SHOPPING: ShoppingBag,
  CAFE: Coffee,
  DELIVERY: Bike,
  SUBSCRIPTION: Tv,
  CULTURE: Ticket,
  BEAUTY: Sparkles,

  WEDDINGHALL: Building2,
  STUDIO: Camera,
  MAKEUP: Brush,
  DRESS: Shirt,
  JEWELRY: Gem,
  EMERGENCY: ShieldAlert,

  ETC: Package,
};
