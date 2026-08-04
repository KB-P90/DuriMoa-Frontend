export interface BestCardDto {
  rank: number;
  user_card_key: string;
  user_id: number;
  user_name: string;
  card_product_key: string;
  card_company: string;
  card_name: string;
  card_image: string;
  annual_fee: number;
  expected_benefit_amount: number;
}

export interface OwnerCardDto {
  rank: number;
  user_card_key: string;
  card_product_key: string;
  card_company: string;
  card_name: string;
  card_image: string;
  benefit_summary: string;
  expected_benefit_amount: number;
}

export interface OwnerCardGroupDto {
  user_id: number;
  user_name: string;
  card_count: number;
  cards: OwnerCardDto[];
}

export interface CardStrategyDataDto {
  payment_amount: number;
  best_card: BestCardDto | null;
  owners: OwnerCardGroupDto[];
}
