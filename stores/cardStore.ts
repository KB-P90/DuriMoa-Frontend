import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { BestCardRecommendation, UserCardGroup } from '@/types/card';

export const useCardStore = defineStore('card', () => {
  const DEFAULT_AMOUNT = 100000;
  const amount = ref<number>(DEFAULT_AMOUNT);
  const MIN_AMOUNT = 1000;
  const isCustomAmountSet = ref<boolean>(false);

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

  return {
    amount,
    isValidAmount,
    MIN_AMOUNT,
    isCustomAmountSet,
    bestRecommendation,
    userCardGroups,
    setAmount,
    addAmount,
    applyCustomAmount,
    resetToDefaultView,
  };
});
