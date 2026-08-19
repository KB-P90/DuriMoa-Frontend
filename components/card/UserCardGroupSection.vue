<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDown, ChevronUp } from '@lucide/vue';
import type { RecommendedCard, UserCardGroup } from '@/types/card';
import { getCardCompanyColor } from '@/utils/card';

const props = defineProps<{
  group: UserCardGroup;
}>();

defineEmits<{
  'select-card': [card: RecommendedCard];
}>();

const isExpanded = ref(false);
const failedImageCardIds = ref<Set<string>>(new Set());
const portraitImageCardIds = ref<Set<string>>(new Set());

const displayedCards = computed(() => {
  if (isExpanded.value || props.group.cards.length <= 2) {
    return props.group.cards;
  }
  return props.group.cards.slice(0, 2);
});

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function hasUsableImage(card: RecommendedCard) {
  return Boolean(card.cardImage) && !failedImageCardIds.value.has(card.id);
}

function handleImageError(cardId: string) {
  failedImageCardIds.value = new Set(failedImageCardIds.value).add(cardId);
}

function handleImageLoad(cardId: string, event: Event) {
  const image = event.currentTarget;
  if (!(image instanceof HTMLImageElement)) return;

  const portraitCardIds = new Set(portraitImageCardIds.value);
  if (image.naturalHeight > image.naturalWidth) {
    portraitCardIds.add(cardId);
  } else {
    portraitCardIds.delete(cardId);
  }
  portraitImageCardIds.value = portraitCardIds;
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
        class="flex cursor-pointer items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-gray-50/80 min-[390px]:gap-4"
        @click="$emit('select-card', card)"
      >
        <!-- Card Graphic Plate -->
        <div
          class="relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm min-[390px]:h-16 min-[390px]:w-24"
          :class="hasUsableImage(card) ? 'bg-white' : getCardCompanyColor(card.cardCompany)"
        >
          <img
            v-if="hasUsableImage(card)"
            :src="card.cardImage"
            :alt="card.name"
            class="object-contain"
            :class="
              portraitImageCardIds.has(card.id)
                ? 'h-20 w-14 max-w-none rotate-90 min-[390px]:h-24 min-[390px]:w-16'
                : 'h-full w-full'
            "
            @load="handleImageLoad(card.id, $event)"
            @error="handleImageError(card.id)"
          />
          <div
            v-else
            class="flex h-full w-full p-2 min-[390px]:p-2.5"
            aria-hidden="true"
          >
            <div class="h-2.5 w-3.5 rounded-[2px] bg-white/70" />
          </div>
        </div>

        <!-- Card Info -->
        <div class="flex min-w-0 flex-1 flex-col">
          <div class="flex min-w-0 items-center gap-2">
            <strong class="min-w-0 flex-1 truncate text-sm font-bold text-gray-900">{{ card.name }}</strong>
            <span
              class="ml-auto shrink-0 rounded-full bg-dm-mint-light px-2 py-0.5 text-[11px] font-bold text-btn-mt-dark"
            >
              {{ card.rankLabel }}
            </span>
          </div>
          <!-- 주요 혜택 최대 3개 (콤마 연결, 전월실적 스타일) -->
          <p class="mt-1 line-clamp-2 break-words text-xs text-dm-gray-dark">
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
