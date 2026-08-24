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

const BG_COLORS = ['bg-[#FF4983]', 'bg-[#91BAF8]', 'bg-[#FF85B3]', 'bg-[#F8B3C5]', 'bg-[#FFC67A]'];

function toBenefitIconType(title: string): CardBenefitItem['iconType'] {
  if (
    title.includes('가맹점') ||
    title.includes('쇼핑') ||
    title.includes('적립') ||
    title.includes('할인') ||
    title.includes('KB Pay')
  ) {
    return 'shopping';
  }

  if (title.includes('대중교통') || title.includes('교통') || title.includes('주유')) {
    return 'transport';
  }

  if (
    title.includes('커피') ||
    title.includes('카페') ||
    title.includes('음식점') ||
    title.includes('미용')
  ) {
    return 'coffee';
  }

  return 'default';
}

export function toRecommendedCard(dto: OwnerCardDto, index: number): RecommendedCard {
  let benefitTitles: string[] = [];

  const rawList = dto?.benefits || dto?.benefit_list;
  if (Array.isArray(rawList) && rawList.length > 0) {
    benefitTitles = rawList
      .map((benefit) =>
        typeof benefit === 'string' ? benefit : benefit.title || benefit.description || ''
      )
      .filter(Boolean);
  } else if (dto?.benefit_summary) {
    const raw = dto.benefit_summary;
    if (raw.includes(',')) {
      benefitTitles = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      benefitTitles = [raw];
    }
  }

  const formattedBenefits = benefitTitles.slice(0, 3).join(', ');

  return {
    id: String(dto?.card_id ?? ''),
    cardId: String(dto?.card_id ?? ''),
    cardProductId: String(dto?.card_product_id ?? ''),
    cardCompany: dto?.company ?? '',
    name: dto?.card_name ?? '',
    rank: dto?.rank ?? index + 1,
    rankLabel: `${dto?.rank ?? index + 1}순위`,
    benefits: formattedBenefits,
    expectedBenefitAmount: dto?.expected_benefit_amount ?? 0,
    cardImage: dto?.image ?? '',
    bgColor: BG_COLORS[index % BG_COLORS.length],
  };
}

export function toUserCardGroup(dto: OwnerCardGroupDto): UserCardGroup {
  return {
    userId: dto?.user_id ?? '',
    userName: dto?.owner_name ?? '',
    ownedCardCount: dto?.card_count ?? 0,
    cards: (dto?.cards || []).map((card, idx) => toRecommendedCard(card, idx)),
  };
}

export function toBestCard(dto: BestCardDto | null | undefined): BestCardRecommendation | null {
  if (!dto) return null;

  const expectedBenefitAmount = dto.expected_benefit_amount ?? 0;
  let rate: number | null = null;
  if (dto.benefit_rate !== undefined && dto.benefit_rate !== null) {
    rate = Number((dto.benefit_rate * 100).toFixed(1));
  }

  let categoryName = dto.category_name ?? '';
  if (!categoryName && dto.category) {
    if (dto.category === 'FURNITURE') {
      categoryName = '가구';
    } else if (dto.category === 'TRAVEL') {
      categoryName = '여행';
    } else {
      categoryName = '카테고리';
    }
  }

  return {
    rank: 1,
    cardId: String(dto.card_id ?? ''),
    userId: 0,
    userName: dto.owner_name ?? '',
    cardProductId: String(dto.card_product_id ?? ''),
    cardCompany: dto.company ?? '',
    cardName: dto.card_name ?? '',
    cardImage: dto.image ?? '',
    annualFee: dto.annual_fee ?? 0,
    expectedBenefitAmount,
    benefitRate: rate,
    ownerName: dto.owner_name ?? '',
    categoryCode: dto.category ?? '',
    categoryName,
    recommendationLabel: categoryName ? `${categoryName} 추천 카드` : '이번 결제 추천 카드',
    benefitTitle: dto.benefit_title ?? '',
    conditionSummary: dto.condition_summary ?? '',
    recommendationNotice: dto.recommendation_notice ?? '',
    cardBgColor: 'bg-[#FF4983]',
  };
}

export function toCardStrategy(dto: CardStrategyDataDto): CardStrategy {
  const paymentAmount = dto?.payment_amount ?? 0;
  return {
    paymentAmount,
    bestCard: toBestCard(dto?.best_card),
    userCardGroups: (dto?.owners || []).map(toUserCardGroup),
  };
}

export function toCardDetail(dto: CardDetailResponseDto): CardDetail {
  const annualFeeVal = dto?.annual_fee ?? 0;
  const annualFeeFormatted = annualFeeVal ? `${annualFeeVal.toLocaleString()}원` : '0원';

  const rawCondition = dto?.condition ?? '';
  const cleanedCondition = rawCondition
    ? rawCondition
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    : '';

  const termsList = cleanedCondition ? [cleanedCondition] : [];

  const benefits: CardBenefitItem[] = (dto?.benefits || []).map((item) => {
    const title = item?.title ?? '';
    const description = item?.description ?? '';

    return {
      iconType: toBenefitIconType(title),
      title,
      description,
    };
  });

  return {
    id: String(dto?.card_id ?? dto?.card_product_id ?? ''),
    cardId: String(dto?.card_id ?? ''),
    cardProductId: String(dto?.card_product_id ?? ''),
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

export function toRecommendedProductDetail(
  dto: CardDetailResponseDto | null | undefined,
  recommendation: BestCardRecommendation
): CardDetail {
  const annualFeeFormatted = recommendation.annualFee
    ? `${recommendation.annualFee.toLocaleString()}원`
    : '0원';
  const benefitTitle =
    recommendation.benefitTitle ||
    (recommendation.categoryName ? `${recommendation.categoryName} 추천 혜택` : '추천 혜택');
  const benefitDescription = recommendation.recommendationNotice || recommendation.conditionSummary;
  const fallbackDetail: CardDetail = {
    id: recommendation.cardProductId,
    cardId: '',
    cardProductId: recommendation.cardProductId,
    cardCompany: recommendation.cardCompany,
    cardName: recommendation.cardName,
    cardImage: recommendation.cardImage,
    annualFee: recommendation.annualFee,
    annualFeeFormatted,
    annualFeeObj: {
      domestic: annualFeeFormatted,
      foreign: annualFeeFormatted,
    },
    cardBgColor: recommendation.cardBgColor,
    benefits:
      recommendation.benefitTitle || benefitDescription
        ? [
            {
              iconType: toBenefitIconType(benefitTitle),
              title: benefitTitle,
              description: benefitDescription,
            },
          ]
        : [],
    usageCondition: recommendation.conditionSummary,
    terms: recommendation.conditionSummary ? [recommendation.conditionSummary] : [],
  };

  if (!dto) return fallbackDetail;

  const apiDetail = toCardDetail(dto);
  return {
    ...apiDetail,
    id: apiDetail.id || fallbackDetail.id,
    cardProductId: apiDetail.cardProductId || fallbackDetail.cardProductId,
    cardCompany: apiDetail.cardCompany || fallbackDetail.cardCompany,
    cardName: apiDetail.cardName || fallbackDetail.cardName,
    cardImage: apiDetail.cardImage || fallbackDetail.cardImage,
    annualFee: apiDetail.annualFee || fallbackDetail.annualFee,
    annualFeeFormatted:
      apiDetail.annualFeeFormatted !== '0원'
        ? apiDetail.annualFeeFormatted
        : fallbackDetail.annualFeeFormatted,
    annualFeeObj:
      apiDetail.annualFeeFormatted !== '0원' ? apiDetail.annualFeeObj : fallbackDetail.annualFeeObj,
    benefits: apiDetail.benefits.length > 0 ? apiDetail.benefits : fallbackDetail.benefits,
    usageCondition: apiDetail.usageCondition || fallbackDetail.usageCondition,
    terms: apiDetail.terms.length > 0 ? apiDetail.terms : fallbackDetail.terms,
  };
}
