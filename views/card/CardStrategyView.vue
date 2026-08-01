<script setup lang="ts">
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { ChevronLeft } from '@lucide/vue';
import CardSmartBanner from '@/components/card/CardSmartBanner.vue';
import CardBestRecommendBanner from '@/components/card/CardBestRecommendBanner.vue';
import UserCardGroupSection from '@/components/card/UserCardGroupSection.vue';
import CardDisclaimer from '@/components/card/CardDisclaimer.vue';
import CardDetailModal from '@/components/card/CardDetailModal.vue';
import { useCardStore } from '@/stores/cardStore';
import { formatWon } from '@/utils/format';
import type { RecommendedCard } from '@/types/card';

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

function handleSelectCard(card: RecommendedCard) {
  cardStore.openCardDetail(card.name);
}

function handleSelectBestCard(cardName: string) {
  cardStore.openCardDetail(cardName);
}

// 네비바 또는 다른 메뉴로 이동할 때는 카드추천 화면2 상태로 초기화
onBeforeRouteLeave((to) => {
  if (to.name !== 'card-amount') {
    cardStore.resetToDefaultView();
  }
});
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

    <!-- Top Banner Section (Screen 2 vs Screen 3 Condition) -->
    <section class="mb-7">
      <!-- Screen 3 Banner: When Custom Amount is set -->
      <CardBestRecommendBanner
        v-if="cardStore.isCustomAmountSet"
        :amount="cardStore.amount"
        :best="cardStore.bestRecommendation"
        @click-change-amount="handleGoToAmountInput"
        @click-card="handleSelectBestCard"
      />

      <!-- Screen 2 Banner: Default View -->
      <CardSmartBanner
        v-else
        @click-input-amount="handleGoToAmountInput"
      />
    </section>

    <!-- Recommend Card Rank Section Header -->
    <section class="mb-4">
      <h2 class="text-lg font-bold text-gray-900">추천 카드 순위</h2>

      <!-- Subtext for Screen 3 -->
      <p v-if="cardStore.isCustomAmountSet" class="mt-1 text-xs text-dm-gray-dark">
        입력하신 금액에 따른 추천 카드 순위를 보여드려요.
      </p>

      <!-- Subtext for Screen 2 -->
      <p v-else class="mt-1 text-xs text-dm-gray-dark">
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
        @select-card="handleSelectCard"
      />
    </section>

    <!-- Disclaimer Section -->
    <section>
      <CardDisclaimer />
    </section>

    <!-- Card Detail Modal (Screen 4 UI) -->
    <CardDetailModal
      v-if="cardStore.selectedCardDetail"
      :detail="cardStore.selectedCardDetail"
      @close="cardStore.closeCardDetail"
    />
  </div>
</template>
