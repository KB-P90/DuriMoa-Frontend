export interface RecommendedCard {
  id: string;
  name: string;
  rank: number;
  rankLabel: string;
  benefits: string;
  bgColor: string;
}

export interface UserCardGroup {
  userId: string;
  userName: string;
  ownedCardCount: number;
  cards: RecommendedCard[];
}

export interface BestCardRecommendation {
  cardName: string;
  expectedBenefitAmount: number;
  benefitRate: number;
  ownerName: string;
  cardBgColor: string;
}

export interface CardBenefitItem {
  iconType: 'shopping' | 'transport' | 'coffee';
  title: string;
  description: string;
}

export interface CardDetail {
  id: string;
  cardCompany: string;
  cardName: string;
  annualFee: {
    domestic: string;
    foreign: string;
  };
  cardBgColor: string;
  benefits: CardBenefitItem[];
  terms: string[];
}

export interface CardAmountInput {
  amount: number;
}

export interface QuickAmountOption {
  label: string;
  value: number;
}
