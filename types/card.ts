export type CardRecommendationCategory = '가구' | '여행';

export interface RecommendedCard {
  id: string;
  cardId: string;
  cardProductId: string;
  cardCompany: string;
  name: string;
  rank: number;
  rankLabel: string;
  benefits: string;
  expectedBenefitAmount: number;
  cardImage: string | null;
  bgColor: string;
}

export interface UserCardGroup {
  userId: number | string;
  userName: string;
  ownedCardCount: number;
  cards: RecommendedCard[];
}

export interface BestCardRecommendation {
  rank: number;
  cardId: string;
  userId: number;
  userName: string;
  cardProductId: string;
  cardCompany: string;
  cardName: string;
  cardImage: string | null;
  annualFee: number;
  expectedBenefitAmount: number;
  benefitRate: number | null;
  ownerName: string;
  categoryCode: string;
  categoryName: string;
  recommendationLabel: string;
  benefitTitle: string;
  conditionSummary: string;
  recommendationNotice: string;
  cardBgColor: string;
}

export interface CardStrategy {
  paymentAmount: number;
  bestCard: BestCardRecommendation | null;
  userCardGroups: UserCardGroup[];
}

export interface CardBenefitItem {
  iconType: 'shopping' | 'transport' | 'coffee' | 'default';
  title: string;
  description: string;
}

export interface CardDetail {
  id: string;
  cardId: string;
  cardProductId: string;
  cardCompany: string;
  cardName: string;
  cardImage: string | null;
  annualFee: number;
  annualFeeFormatted: string;
  annualFeeObj?: {
    domestic: string;
    foreign: string;
  };
  cardBgColor: string;
  benefits: CardBenefitItem[];
  usageCondition: string;
  terms: string[];
  conditionCheckedAt?: string;
}

export interface CardAmountInput {
  amount: number;
}

export interface QuickAmountOption {
  label: string;
  value: number;
}
