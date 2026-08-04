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

export interface CardBenefitItemDto {
  title: string;
  description: string;
  benefit_rate: number | null;
  fixed_benefit_amount: number | null;
  monthly_limit_amount: number | null;
  minimum_performance_amount: number | null;
  excluded_keywords: string[];
}

export interface CardDetailResponseDto {
  user_card_key: number;
  card_product_id: number;
  company: string;
  card_name: string;
  image: string;
  annual_fee: number;
  benefits: CardBenefitItemDto[];
  condition: string;
  condition_checked_at: string;
  official_url: string | null;
  sale_status: string;
  recommendable_status: string;
  benefit_notice: string;
}
