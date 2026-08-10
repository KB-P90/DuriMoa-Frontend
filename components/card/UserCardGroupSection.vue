<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDown, ChevronUp } from '@lucide/vue';
import type { RecommendedCard, UserCardGroup } from '@/types/card';

const props = defineProps<{
  group: UserCardGroup;
}>();

defineEmits<{
  'select-card': [card: RecommendedCard];
}>();

const isExpanded = ref(false);

const displayedCards = computed(() => {
  if (isExpanded.value || props.group.cards.length <= 2) {
    return props.group.cards;
  }
  return props.group.cards.slice(0, 2);
});

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}
</script>

<template>
  <div class="rounded-3xl border border-gray-100 bg-white p-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-gray-900">{{ group.userName }} 님의 카드</h3>
      <span class="text-xs font-semibold text-brand"> 보유 카드 {{ group.ownedCardCount }}개 </span>
    </div>

    <!-- Cards List -->
    <div class="mt-4 flex flex-col gap-3">
      <div
        v-for="card in displayedCards"
        :key="card.id"
        class="flex cursor-pointer items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-gray-50/80"
        @click="$emit('select-card', card)"
      >
        <!-- Card Graphic Plate -->
        <div
          class="relative flex h-16 w-24 shrink-0 flex-col justify-between rounded-xl p-2.5 shadow-sm"
          :class="card.bgColor"
        >
          <div class="h-2.5 w-3.5 rounded-[2px] bg-white/70" />
          <span class="self-end text-[9px] font-bold tracking-wider text-white/90">
            {{ card.cardCompany || 'CARD' }}
          </span>
        </div>

        <!-- Card Info -->
        <div class="flex flex-1 flex-col">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <strong class="text-sm font-bold text-gray-900">{{ card.name }}</strong>
              <span
                class="rounded-full bg-dm-mint-light px-2 py-0.5 text-[11px] font-bold text-btn-mt-dark"
              >
                {{ card.rankLabel }}
              </span>
            </div>
          </div>
          <!-- 주요 혜택 최대 3개 (콤마 연결, 전월실적 스타일) -->
          <p class="mt-1 text-xs text-dm-gray-dark">
            {{ card.benefits }}
          </p>
        </div>
      </div>
    </div>

    <!-- Expand More Button -->
    <button
      v-if="group.cards.length > 2"
      type="button"
      class="mt-3 flex w-full cursor-pointer items-center justify-center gap-1 py-1.5 text-xs font-medium text-dm-gray-dark transition-colors hover:text-gray-700"
      @click="toggleExpand"
    >
      <span>{{ group.userName }}님 카드 {{ isExpanded ? '접기' : '더보기' }}</span>
      <ChevronUp
        v-if="isExpanded"
        class="h-3.5 w-3.5"
      />
      <ChevronDown
        v-else
        class="h-3.5 w-3.5"
      />
    </button>
  </div>
</template>
