<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import CardSmartBanner from '@/components/card/CardSmartBanner.vue';
import CardBestRecommendBanner from '@/components/card/CardBestRecommendBanner.vue';
import UserCardGroupSection from '@/components/card/UserCardGroupSection.vue';
import CardDisclaimer from '@/components/card/CardDisclaimer.vue';
import CardDetailModal from '@/components/card/CardDetailModal.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { useCardStore } from '@/stores/cardStore';
import { formatWon } from '@/utils/format';
import type { RecommendedCard } from '@/types/card';

const router = useRouter();
const cardStore = useCardStore();

onMounted(async () => {
  if (!cardStore.cardStrategyData) {
    await cardStore.fetchCardStrategy(cardStore.amount);
  }
});

function handleGoToAmountInput() {
  router.push({ name: 'card-amount' });
}

function handleSelectCard(card: RecommendedCard) {
  const key = card.cardId || card.id;
  if (key) {
    cardStore.openCardDetail(key);
  }
}

function handleSelectBestCard(cardId: string) {
  if (cardId) {
    cardStore.openCardDetail(cardId);
  }
}

onBeforeRouteLeave((to) => {
  if (to.name !== 'card-amount') {
    cardStore.resetToDefaultView();
  }
});
</script>

<template>
  <div class="mx-auto w-full max-w-4xl">
    <PageHeader
      title="카드 추천"
      :showBack="true"
    />

    <div class="p-4">
      <!-- Loading State -->
      <div
        v-if="cardStore.isLoading"
        class="py-12 text-center text-dm-gray-dark"
      >
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-pink-03 border-t-transparent mb-2"
        ></div>
        <p class="text-sm font-semibold">카드 추천 정보를 불러오는 중입니다...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="cardStore.error"
        class="rounded-2xl bg-rose-50 p-6 text-center text-rose-600"
      >
        <p class="text-sm font-bold">{{ cardStore.error }}</p>
        <button
          type="button"
          class="mt-3 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white shadow-sm"
          @click="cardStore.fetchCardStrategy(cardStore.amount)"
        >
          다시 시도
        </button>
      </div>

      <!-- Main Content -->
      <template v-else>
        <!-- Top Banner Section (Screen 2 vs Screen 3 Condition) -->
        <section class="mb-7">
          <!-- Screen 3 Banner: When Custom Amount is set -->
          <CardBestRecommendBanner
            v-if="cardStore.isCustomAmountSet && cardStore.bestRecommendation"
            :amount="cardStore.amount"
            :best="cardStore.bestRecommendation"
            @click-change-amount="handleGoToAmountInput"
            @click-card="handleSelectBestCard"
          />

          <!-- Screen 2 Banner: Default View ("다음 결제, 어떤 카드가 좋을까요?") -->
          <CardSmartBanner
            v-else
            @click-input-amount="handleGoToAmountInput"
          />
        </section>

        <!-- Recommend Card Rank Section Header -->
        <section class="mb-4">
          <h2 class="text-lg font-bold text-gray-900">추천 카드 순위</h2>

          <!-- Subtext for Screen 3 -->
          <p
            v-if="cardStore.isCustomAmountSet"
            class="mt-1 text-xs text-dm-gray-dark"
          >
            입력하신
            <strong class="font-bold text-btn-mt-dark">{{ formatWon(cardStore.amount) }}</strong>
            기준 추천 카드 순위입니다.
          </p>

          <!-- Subtext for Screen 2 -->
          <p
            v-else
            class="mt-1 text-xs text-dm-gray-dark"
          >
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
      </template>

      <!-- Card Detail Modal (Screen 4 UI) -->
      <CardDetailModal
        v-if="cardStore.selectedCardDetail"
        :detail="cardStore.selectedCardDetail"
        @close="cardStore.closeCardDetail"
      />
    </div>
  </div>
</template>
