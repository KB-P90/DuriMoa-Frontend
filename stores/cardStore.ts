import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type {
  BestCardRecommendation,
  CardDetail,
  CardStrategy,
  UserCardGroup,
} from '@/types/card';
import { getCardDetailApi, getCardStrategyApi } from '@/server/cardApi';
import { toCardDetail, toCardStrategy } from '@/models/Card';

export const useCardStore = defineStore('card', () => {
  const DEFAULT_AMOUNT = 100000;
  const MIN_AMOUNT = 1000;

  const amount = ref<number>(DEFAULT_AMOUNT);
  const isCustomAmountSet = ref<boolean>(false);
  const selectedCardDetail = ref<CardDetail | null>(null);
  const isLoading = ref<boolean>(false);
  const isDetailLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const cardStrategyData = ref<CardStrategy | null>(null);

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

  async function openCardDetail(userCardKey?: string) {
    if (!userCardKey) return;
    isDetailLoading.value = true;
    try {
      const dto = await getCardDetailApi(userCardKey);
      selectedCardDetail.value = toCardDetail(dto);
    } catch (e: unknown) {
      console.error(`Failed to fetch card detail for key (${userCardKey}):`, e);
    } finally {
      isDetailLoading.value = false;
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
    isDetailLoading,
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
