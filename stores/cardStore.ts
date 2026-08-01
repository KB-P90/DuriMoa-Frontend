import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { BestCardRecommendation, CardDetail, UserCardGroup } from '@/types/card';

export const useCardStore = defineStore('card', () => {
  const DEFAULT_AMOUNT = 100000;
  const amount = ref<number>(DEFAULT_AMOUNT);
  const MIN_AMOUNT = 1000;
  const isCustomAmountSet = ref<boolean>(false);
  const selectedCardDetail = ref<CardDetail | null>(null);

  const sampleCardDetail: CardDetail = {
    id: 'zero-edition2',
    cardCompany: '현대카드',
    cardName: 'ZERO Edition2',
    annualFee: {
      domestic: '10,000원',
      foreign: '10,000원',
    },
    cardBgColor: 'bg-[#FF4983]',
    benefits: [
      {
        iconType: 'shopping',
        title: '국내외 가맹점 할인',
        description: '국내외 모든 가맹점에서 청구 할인',
      },
      {
        iconType: 'transport',
        title: '대중교통 할인',
        description: '버스·지하철 이용 시 청구 할인',
      },
      {
        iconType: 'coffee',
        title: '커피전문점 할인',
        description: '스타벅스·투썸플레이스 등 청구 할인',
      },
    ],
    terms: [
      '전월 이용실적 30만원 이상 시 혜택 제공',
      '할인 한도는 통합 월 1만원까지 제공',
      '일부 가맹점 및 서비스는 혜택에서 제외',
      '카드 발급 후 다음 달부터 실적 기준 적용',
    ],
  };

  const bestRecommendation = computed<BestCardRecommendation>(() => {
    const rate = 1.2;
    const benefitAmount = Math.floor((amount.value * rate) / 100);
    return {
      cardName: '신한 Mr.Life',
      expectedBenefitAmount: benefitAmount > 0 ? benefitAmount : 1200,
      benefitRate: rate,
      ownerName: '김민준',
      cardBgColor: 'bg-[#FF4D88]',
    };
  });

  const userCardGroups = ref<UserCardGroup[]>([
    {
      userId: 'groom',
      userName: '김민준',
      ownedCardCount: 3,
      cards: [
        {
          id: 'm1',
          name: '신한 Mr.Life',
          rank: 1,
          rankLabel: '1순위',
          benefits: '온라인쇼핑 10%, 카페 10%',
          bgColor: 'bg-[#91BAF8]',
        },
        {
          id: 'm2',
          name: '신한 Mr.Life',
          rank: 2,
          rankLabel: '2순위',
          benefits: '온라인쇼핑 10%, 카페 10%',
          bgColor: 'bg-[#F8B3C5]',
        },
      ],
    },
    {
      userId: 'bride',
      userName: '이서연',
      ownedCardCount: 3,
      cards: [
        {
          id: 'b1',
          name: '신한 Mr.Life',
          rank: 1,
          rankLabel: '1순위',
          benefits: '온라인쇼핑 10%, 카페 10%',
          bgColor: 'bg-[#FF85B3]',
        },
        {
          id: 'b2',
          name: '신한 Mr.Life',
          rank: 2,
          rankLabel: '2순위',
          benefits: '온라인쇼핑 10%, 카페 10%',
          bgColor: 'bg-[#FFC67A]',
        },
      ],
    },
  ]);

  const isValidAmount = computed(() => amount.value >= MIN_AMOUNT);

  function setAmount(val: number) {
    amount.value = Math.max(0, Number.isNaN(val) ? 0 : val);
  }

  function addAmount(val: number) {
    amount.value = (amount.value || 0) + val;
  }

  function applyCustomAmount() {
    if (isValidAmount.value) {
      isCustomAmountSet.value = true;
    }
  }

  function resetToDefaultView() {
    isCustomAmountSet.value = false;
    amount.value = DEFAULT_AMOUNT;
  }

  function openCardDetail(cardName?: string) {
    if (cardName && cardName.includes('Mr.Life')) {
      selectedCardDetail.value = {
        ...sampleCardDetail,
        cardCompany: '신한카드',
        cardName: '신한 Mr.Life',
      };
    } else {
      selectedCardDetail.value = sampleCardDetail;
    }
  }

  function closeCardDetail() {
    selectedCardDetail.value = null;
  }

  return {
    amount,
    isValidAmount,
    MIN_AMOUNT,
    isCustomAmountSet,
    selectedCardDetail,
    bestRecommendation,
    userCardGroups,
    setAmount,
    addAmount,
    applyCustomAmount,
    resetToDefaultView,
    openCardDetail,
    closeCardDetail,
  };
});
