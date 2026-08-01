import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCardStore = defineStore('card', () => {
  const amount = ref<number>(300000);
  const MIN_AMOUNT = 1000;

  const isValidAmount = computed(() => amount.value >= MIN_AMOUNT);

  function setAmount(val: number) {
    amount.value = Math.max(0, Number.isNaN(val) ? 0 : val);
  }

  function addAmount(val: number) {
    amount.value = (amount.value || 0) + val;
  }

  function clearAmount() {
    amount.value = 0;
  }

  return {
    amount,
    isValidAmount,
    MIN_AMOUNT,
    setAmount,
    addAmount,
    clearAmount,
  };
});
