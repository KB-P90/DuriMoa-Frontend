import type {
  BestCardDto,
  CardStrategyDataDto,
  OwnerCardDto,
  OwnerCardGroupDto,
} from '@/types/dto/card.dto';
import type {
  BestCardRecommendation,
  CardStrategy,
  RecommendedCard,
  UserCardGroup,
} from '@/types/card';

const BG_COLORS = [
  'bg-[#FF4983]',
  'bg-[#91BAF8]',
  'bg-[#FF85B3]',
  'bg-[#F8B3C5]',
  'bg-[#FFC67A]',
];

export function toRecommendedCard(dto: OwnerCardDto, index: number): RecommendedCard {
  return {
    id: dto?.user_card_key ?? '',
    userCardKey: dto?.user_card_key ?? '',
    cardProductKey: dto?.card_product_key ?? '',
    cardCompany: dto?.card_company ?? '',
    name: dto?.card_name ?? '',
    rank: dto?.rank ?? (index + 1),
    rankLabel: `${dto?.rank ?? (index + 1)}순위`,
    benefits: dto?.benefit_summary ?? '',
    expectedBenefitAmount: dto?.expected_benefit_amount ?? 0,
    cardImage: dto?.card_image ?? '',
    bgColor: BG_COLORS[index % BG_COLORS.length],
  };
}

export function toUserCardGroup(dto: OwnerCardGroupDto): UserCardGroup {
  return {
    userId: dto?.user_id ?? '',
    userName: dto?.user_name ?? '',
    ownedCardCount: dto?.card_count ?? 0,
    cards: (dto?.cards || []).map((card, idx) => toRecommendedCard(card, idx)),
  };
}

export function toBestCard(
  dto: BestCardDto | null | undefined,
  paymentAmount: number
): BestCardRecommendation | null {
  if (!dto) return null;

  const expectedBenefitAmount = dto.expected_benefit_amount ?? 0;
  const rate =
    paymentAmount > 0
      ? Number(((expectedBenefitAmount / paymentAmount) * 100).toFixed(1))
      : 0;

  return {
    rank: dto.rank ?? 1,
    userCardKey: dto.user_card_key ?? '',
    userId: dto.user_id ?? 0,
    userName: dto.user_name ?? '',
    cardProductKey: dto.card_product_key ?? '',
    cardCompany: dto.card_company ?? '',
    cardName: dto.card_name ?? '',
    cardImage: dto.card_image ?? '',
    annualFee: dto.annual_fee ?? 0,
    expectedBenefitAmount,
    benefitRate: rate,
    ownerName: dto.user_name ?? '',
    cardBgColor: 'bg-[#FF4983]',
  };
}

export function toCardStrategy(dto: CardStrategyDataDto): CardStrategy {
  const paymentAmount = dto?.payment_amount ?? 0;
  return {
    paymentAmount,
    bestCard: toBestCard(dto?.best_card, paymentAmount),
    userCardGroups: (dto?.owners || []).map(toUserCardGroup),
  };
}
