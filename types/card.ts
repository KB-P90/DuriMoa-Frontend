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

export interface CardAmountInput {
  amount: number;
}

export interface QuickAmountOption {
  label: string;
  value: number;
}
