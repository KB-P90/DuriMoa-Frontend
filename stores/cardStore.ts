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

  // 카드 상세 정보 메모리 캐시 맵 (중복 네트워크 요청 방지)
  const cardDetailCache = new Map<string, CardDetail>();

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

      // 추천 카드 목록에 주요 혜택 3개가 표시될 수 있도록 각 카드의 혜택 정보 병렬 채우기 및 캐싱
      if (domainData?.userCardGroups) {
        const fetchPromises: Promise<void>[] = [];

        domainData.userCardGroups.forEach((group) => {
          group.cards.forEach((card) => {
            if (card.userCardKey && !card.benefits) {
              const promise = getCardDetailApi(card.userCardKey)
                .then((detailDto) => {
                  const cardDetailObj = toCardDetail(detailDto);
                  // 캐시에 저장하여 클릭 시 또 요청하지 않고 즉시 재사용
                  cardDetailCache.set(card.userCardKey, cardDetailObj);

                  if (cardDetailObj?.benefits && cardDetailObj.benefits.length > 0) {
                    const topBenefits = cardDetailObj.benefits
                      .slice(0, 3)
                      .map((b) => b.title || b.description)
                      .filter(Boolean)
                      .join(', ');
                    if (topBenefits) {
                      card.benefits = topBenefits;
                    }
                  }
                })
                .catch(() => {
                  // 카드 상세 개별 조회 실패 시 무시
                });
              fetchPromises.push(promise);
            }
          });
        });

        await Promise.allSettled(fetchPromises);
      }
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

    // 이미 저장(캐싱)된 카드 상세 데이터가 있는 경우 굳이 또 API 요청하지 않고 즉시 가져옴
    if (cardDetailCache.has(userCardKey)) {
      console.log(`[CARD STORE] ⚡ 캐시된 카드 상세 데이터를 재사용합니다. (userCardKey: ${userCardKey})`);
      selectedCardDetail.value = cardDetailCache.get(userCardKey)!;
      return;
    }

    isDetailLoading.value = true;
    try {
      const dto = await getCardDetailApi(userCardKey);
      const detailObj = toCardDetail(dto);
      cardDetailCache.set(userCardKey, detailObj);
      selectedCardDetail.value = detailObj;
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
