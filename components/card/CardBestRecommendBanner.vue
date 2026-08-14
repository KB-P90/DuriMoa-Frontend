<script setup lang="ts">
import { ref } from 'vue';
import { ChevronRight } from '@lucide/vue';
import type { BestCardRecommendation } from '@/types/card';
import { formatAmount, formatWon } from '@/utils/format';

defineProps<{
  amount: number;
  best: BestCardRecommendation;
}>();

defineEmits<{
  'click-change-amount': [];
  'click-card': [cardId: string];
}>();

const imageError = ref(false);
</script>

<template>
  <div>
    <!-- Top Header & Change Amount Button -->
    <div class="mb-4 flex items-start justify-between gap-2">
      <div class="min-w-0">
        <h2 class="text-xl font-extrabold text-gray-900 sm:text-2xl">
          {{ formatWon(amount) }} 결제라면
        </h2>
        <p class="mt-1 text-xs text-dm-gray-dark">예상 혜택이 가장 큰 카드를 찾았어요!</p>
      </div>

      <button
        type="button"
        class="inline-flex shrink-0 cursor-pointer items-center gap-0.5 rounded-full bg-[#FFF0EF] px-3 py-1.5 text-xs font-bold text-brand transition-colors hover:bg-pink-01 min-[390px]:px-3.5"
        @click="$emit('click-change-amount')"
      >
        <span>금액 변경</span>
        <ChevronRight class="h-3.5 w-3.5" />
      </button>
    </div>

    <!-- Best Recommend Card Box -->
    <div
      class="relative cursor-pointer overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-[#FFF0EF] via-[#FFF4F5] to-[#FFEFEF] p-4 shadow-sm transition-transform hover:scale-[1.01]"
      @click="$emit('click-card', best.cardId)"
    >
      <!-- BEST 1 Badge -->
      <span
        class="absolute right-5 top-5 rounded-full bg-[#FF7666] px-3 py-1 text-[10px] font-bold text-white shadow-2xs"
      >
        BEST {{ best.rank || 1 }}
      </span>

      <div class="flex items-center gap-3 min-[390px]:gap-5">
        <!-- Vertical Card Visual Plate -->
        <div
          class="relative flex h-32 w-20 shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-2.5 shadow-md min-[390px]:h-36 min-[390px]:w-24 min-[390px]:p-3"
          :class="best.cardBgColor || 'bg-[#FF4983]'"
        >
          <template v-if="best.cardImage && !imageError">
            <img
              :src="best.cardImage"
              :alt="best.cardName"
              class="h-full w-full object-contain"
              @error="imageError = true"
            />
          </template>
          <template v-else>
            <div class="h-3.5 w-5 rounded-sm bg-white/70" />
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-xs font-bold tracking-widest text-white/80">{{
                best.cardCompany
              }}</span>
              <span class="text-[11px] font-extrabold tracking-wider text-white line-clamp-1">{{
                best.cardName
              }}</span>
            </div>
          </template>
        </div>

        <!-- Card Detail Info -->
        <div class="flex min-w-0 flex-1 flex-col pt-1">
          <span class="text-[11px] font-bold text-brand"> 이번 결제 추천 </span>
          <strong class="mt-0.5 line-clamp-2 break-keep text-base font-extrabold leading-tight text-gray-900 min-[390px]:text-lg sm:text-xl">
            {{ best.cardName }}
          </strong>

          <hr class="my-2.5 border-t border-rose-100" />

          <span class="text-[10px] font-medium text-gray-400"> 예상 혜택 </span>
          <div class="mt-0.5 flex items-baseline">
            <strong class="text-xl font-extrabold text-gray-900">
              {{ formatAmount(best.expectedBenefitAmount) }}원
            </strong>
            <span
              v-if="best.benefitRate > 0"
              class="ml-1.5 text-xs font-bold text-brand"
            >
              {{ best.benefitRate }}%
            </span>
          </div>

          <div
            class="mt-2.5 max-w-full self-start truncate rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#5A5B69] shadow-2xs min-[390px]:px-3"
          >
            <span class="mr-1 text-brand">●</span> {{ best.ownerName || best.userName }} 님의 카드
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
