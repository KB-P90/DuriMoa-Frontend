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
