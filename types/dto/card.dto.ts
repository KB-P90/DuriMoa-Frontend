export interface BestCardDto {
  user_card_key: number;
  owner_type: string;
  owner_name: string;
  company: string;
  card_name: string;
  image: string;
  expected_benefit_amount: number;
  benefit_rate: number;
  recommendable_status: string;
}

export interface OwnerCardDto {
  rank: number;
  user_card_key: number;
  card_product_id: number;
  company: string;
  card_name: string;
  image: string;
  annual_fee: number;
  expected_benefit_amount: number;
  current_performance_amount: number;
  performance_after_payment: number;
  next_benefit_threshold: number | null;
  shortage_amount: number;
  monthly_benefit_limit: number | null;
  benefit_rate: number;
  condition_summary?: string;
  benefit_summary?: string;
  benefits?: CardBenefitItemDto[] | string[];
  benefit_list?: CardBenefitItemDto[] | string[];
  recommendable: boolean;
  recommendable_status: string;
  recommendation_notice: string;
  condition_checked_at: string;
}

export interface OwnerCardGroupDto {
  owner_type: string;
  user_id: number;
  owner_name: string;
  owner_role: string;
  card_count: number;
  cards: OwnerCardDto[];
}

export interface CardStrategyDataDto {
  payment_amount: number;
  best_card: BestCardDto | null;
  owners: OwnerCardGroupDto[];
  benefit_notice: string;
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
