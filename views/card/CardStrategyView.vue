<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ChevronLeft } from '@lucide/vue';
import CardSmartBanner from '@/components/card/CardSmartBanner.vue';
import UserCardGroupSection from '@/components/card/UserCardGroupSection.vue';
import CardDisclaimer from '@/components/card/CardDisclaimer.vue';
import { useCardStore } from '@/stores/cardStore';
import { formatWon } from '@/utils/format';

const router = useRouter();
const cardStore = useCardStore();

function handleBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'home' });
  }
}

function handleGoToAmountInput() {
  router.push({ name: 'card-amount' });
}
</script>

<template>
  <div class="mx-auto w-full max-w-xl px-5 pb-10 pt-4">
    <!-- Header -->
    <header class="mb-5 flex items-center gap-2">
      <button
        type="button"
        aria-label="뒤로가기"
        class="-ml-2 grid h-10 w-10 place-items-center rounded-full text-gray-800 transition-colors hover:bg-gray-100"
        @click="handleBack"
      >
        <ChevronLeft class="h-6 w-6" :stroke-width="2" />
      </button>
      <h1 class="text-lg font-bold text-gray-900">카드 전략</h1>
    </header>

    <!-- Smart Recommend Banner Section -->
    <section class="mb-7">
      <CardSmartBanner @click-input-amount="handleGoToAmountInput" />
    </section>

    <!-- Recommend Card Rank Section Header -->
    <section class="mb-4">
      <h2 class="text-lg font-bold text-gray-900">추천 카드 순위</h2>
      <p class="mt-1 text-xs text-dm-gray-dark">
        해당 화면은
        <strong class="font-bold text-btn-mt-dark">{{ formatWon(cardStore.amount) }}</strong>
        결제를 기준으로 나열됐습니다.
      </p>
    </section>

    <!-- User Card Groups -->
    <section class="mb-6 flex flex-col gap-4">
      <UserCardGroupSection
        v-for="group in cardStore.userCardGroups"
        :key="group.userId"
        :group="group"
      />
    </section>

    <!-- Disclaimer Section -->
    <section>
      <CardDisclaimer />
    </section>
  </div>
</template>
