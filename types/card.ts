export interface RecommendedCard {
  id: string;
  userCardKey: string;
  cardProductKey: string;
  cardCompany: string;
  name: string;
  rank: number;
  rankLabel: string;
  benefits: string;
  expectedBenefitAmount: number;
  cardImage: string;
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
  userCardKey: string;
  userId: number;
  userName: string;
  cardProductKey: string;
  cardCompany: string;
  cardName: string;
  cardImage: string;
  annualFee: number;
  expectedBenefitAmount: number;
  benefitRate: number;
  ownerName: string;
  cardBgColor: string;
}

export interface CardStrategy {
  paymentAmount: number;
  bestCard: BestCardRecommendation | null;
  userCardGroups: UserCardGroup[];
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
