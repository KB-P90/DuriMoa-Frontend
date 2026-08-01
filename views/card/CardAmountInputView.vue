<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ChevronLeft } from '@lucide/vue';
import CardAmountForm from '@/components/card/CardAmountForm.vue';
import CardSecurityNotice from '@/components/card/CardSecurityNotice.vue';
import { useCardStore } from '@/stores/cardStore';

const router = useRouter();
const cardStore = useCardStore();

function handleBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'card' });
  }
}

function handleSubmit() {
  if (!cardStore.isValidAmount) return;
  cardStore.applyCustomAmount();
  router.push({ name: 'card' });
}
</script>

<template>
  <div class="mx-auto min-h-dvh w-full max-w-[768px] bg-white px-5 pb-10 pt-4">
    <!-- Top Header -->
    <header class="mb-6 flex items-center gap-2">
      <button
        type="button"
        aria-label="뒤로가기"
        class="-ml-2 grid h-10 w-10 place-items-center rounded-full text-gray-800 transition-colors hover:bg-gray-100"
        @click="handleBack"
      >
        <ChevronLeft class="h-6 w-6" :stroke-width="2" />
      </button>
      <h1 class="text-lg font-bold text-gray-900">결제 금액 입력</h1>
    </header>

    <!-- Main Title Banner Section -->
    <section class="mb-8 text-center">
      <span class="text-xs font-bold tracking-wider text-btn-pk uppercase">
        PAYMENT AMOUNT
      </span>
      <h2 class="mt-2 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
        결제할 금액을<br />
        입력해 주세요
      </h2>
      <p class="mt-3 text-xs font-medium text-dm-gray-dark sm:text-sm">
        입력한 금액을 기준으로 카드별 예상 혜택을 비교해 드려요.
      </p>
    </section>

    <!-- Amount Input Form Component -->
    <section class="mb-6">
      <CardAmountForm
        v-model:amount="cardStore.amount"
        :is-valid="cardStore.isValidAmount"
        :min-amount="cardStore.MIN_AMOUNT"
        @add-amount="cardStore.addAmount"
        @submit="handleSubmit"
      />
    </section>

    <!-- Security Notice Component -->
    <section>
      <CardSecurityNotice />
    </section>
  </div>
</template>
