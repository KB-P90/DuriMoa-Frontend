import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type {
  BestCardRecommendation,
  CardDetail,
  CardStrategy,
  UserCardGroup,
} from '@/types/card';
import { getCardStrategyApi } from '@/server/cardApi';
import { toCardStrategy } from '@/models/Card';

export const useCardStore = defineStore('card', () => {
  const DEFAULT_AMOUNT = 100000;
  const MIN_AMOUNT = 1000;

  const amount = ref<number>(DEFAULT_AMOUNT);
  const isCustomAmountSet = ref<boolean>(false);
  const selectedCardDetail = ref<CardDetail | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const cardStrategyData = ref<CardStrategy | null>(null);

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

  const bestRecommendation = computed<BestCardRecommendation | null>(() => {
    return cardStrategyData.value?.bestCard ?? null;
  });

  const userCardGroups = computed<UserCardGroup[]>(() => {
    return cardStrategyData.value?.userCardGroups ?? [];
  });

  const isValidAmount = computed(() => amount.value >= MIN_AMOUNT);

  function setAmount(val: number) {
    amount.value = Math.max(0, Number.isNaN(val) ? 0 : val);
  }

  function addAmount(val: number) {
    amount.value = (amount.value || 0) + val;
  }

  async function fetchCardStrategy(targetAmount?: number) {
    isLoading.value = true;
    error.value = null;
    try {
      const fetchVal = targetAmount !== undefined ? targetAmount : amount.value;
      const dto = await getCardStrategyApi(fetchVal);
      const domainData = toCardStrategy(dto);
      cardStrategyData.value = domainData;
      amount.value = domainData.paymentAmount;
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message;
      } else {
        error.value = '카드 추천 정보를 가져오는 데 실패했습니다.';
      }
      console.error('Failed to fetch card strategy:', e);
    } finally {
      isLoading.value = false;
    }
  }

  async function applyCustomAmount() {
    if (isValidAmount.value) {
      isCustomAmountSet.value = true;
      await fetchCardStrategy(amount.value);
    }
  }

  async function resetToDefaultView() {
    isCustomAmountSet.value = false;
    amount.value = DEFAULT_AMOUNT;
    await fetchCardStrategy(DEFAULT_AMOUNT);
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
    isLoading,
    error,
    selectedCardDetail,
    bestRecommendation,
    userCardGroups,
    cardStrategyData,
    setAmount,
    addAmount,
    fetchCardStrategy,
    applyCustomAmount,
    resetToDefaultView,
    openCardDetail,
    closeCardDetail,
  };
});
