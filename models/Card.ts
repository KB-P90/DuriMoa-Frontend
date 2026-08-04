import type {
  BestCardDto,
  CardDetailResponseDto,
  CardStrategyDataDto,
  OwnerCardDto,
  OwnerCardGroupDto,
} from '@/types/dto/card.dto';
import type {
  BestCardRecommendation,
  CardBenefitItem,
  CardDetail,
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
    rank: dto?.rank ?? index + 1,
    rankLabel: `${dto?.rank ?? index + 1}순위`,
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

export function toCardDetail(dto: CardDetailResponseDto): CardDetail {
  const annualFeeVal = dto?.annual_fee ?? 0;
  const annualFeeFormatted = annualFeeVal ? `${annualFeeVal.toLocaleString()}원` : '0원';

  const rawCondition = dto?.condition ?? '';
  const cleanedCondition = rawCondition
    ? rawCondition.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
    : '';

  const termsList = cleanedCondition ? [cleanedCondition] : [];

  const benefits: CardBenefitItem[] = (dto?.benefits || []).map((item) => {
    const title = item?.title ?? '';
    const description = item?.description ?? '';

    let iconType: 'shopping' | 'transport' | 'coffee' | 'default' = 'default';
    if (
      title.includes('가맹점') ||
      title.includes('쇼핑') ||
      title.includes('적립') ||
      title.includes('할인') ||
      title.includes('KB Pay')
    ) {
      iconType = 'shopping';
    } else if (title.includes('대중교통') || title.includes('교통') || title.includes('주유')) {
      iconType = 'transport';
    } else if (
      title.includes('커피') ||
      title.includes('카페') ||
      title.includes('음식점') ||
      title.includes('미용')
    ) {
      iconType = 'coffee';
    }

    return {
      iconType,
      title,
      description,
    };
  });

  return {
    id: String(dto?.user_card_key ?? ''),
    userCardKey: String(dto?.user_card_key ?? ''),
    cardProductKey: String(dto?.card_product_id ?? ''),
    cardCompany: dto?.company ?? '',
    cardName: dto?.card_name ?? '',
    cardImage: dto?.image ?? '',
    annualFee: annualFeeVal,
    annualFeeFormatted,
    annualFeeObj: {
      domestic: annualFeeFormatted,
      foreign: annualFeeFormatted,
    },
    cardBgColor: 'bg-[#FF4983]',
    benefits,
    usageCondition: cleanedCondition,
    terms: termsList,
    conditionCheckedAt: dto?.condition_checked_at ?? '',
  };
}
