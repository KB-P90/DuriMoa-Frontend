<script setup lang="ts">
import { ref } from 'vue';
import { X, ShoppingBag, Bus, Coffee, CreditCard } from '@lucide/vue';
import type { CardDetail } from '@/types/card';

defineProps<{
  detail: CardDetail;
}>();

const emit = defineEmits<{
  close: [];
}>();

const imageError = ref(false);
</script>

<template>
  <div
    class="fixed inset-0 z-[60] flex cursor-pointer items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-300"
    @click.self="emit('close')"
  >
    <div
      class="relative max-h-[85vh] w-full max-w-[768px] cursor-default overflow-y-auto rounded-t-[32px] bg-white px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out"
    >
      <!-- Bottom Sheet Drag Handle Bar -->
      <div class="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />

      <!-- Close Button -->
      <button
        type="button"
        aria-label="닫기"
        class="absolute right-5 top-5 grid h-8 w-8 cursor-pointer place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        @click="emit('close')"
      >
        <X class="h-5 w-5" :stroke-width="2.2" />
      </button>

      <!-- Top Card Visual & Basic Info -->
      <div class="mt-2 flex items-start gap-4">
        <!-- Card Visual Plate or Image -->
        <div
          class="relative flex h-36 w-24 shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-3 shadow-md"
          :class="detail.cardBgColor || 'bg-[#FF4983]'"
        >
          <template v-if="detail.cardImage && !imageError">
            <img
              :src="detail.cardImage"
              :alt="detail.cardName"
              class="h-full w-full object-contain"
              @error="imageError = true"
            />
          </template>
          <template v-else>
            <div class="flex items-center justify-between">
              <div class="h-3.5 w-5 rounded-sm bg-white/70" />
            </div>
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-xs font-bold tracking-widest text-white/80">{{ detail.cardCompany }}</span>
              <span class="text-[11px] font-extrabold tracking-wider text-white line-clamp-1">{{ detail.cardName }}</span>
            </div>
          </template>
        </div>

        <!-- Card Company, Name, Annual Fee -->
        <div class="flex flex-1 flex-col pt-1">
          <span class="self-start rounded-full border border-pink-300 px-3 py-0.5 text-xs font-semibold text-btn-pk">
            {{ detail.cardCompany }}
          </span>
          <h2 class="mt-2 text-xl font-extrabold text-gray-900">
            {{ detail.cardName }}
          </h2>

          <div class="mt-3 flex gap-3 text-xs leading-relaxed text-gray-500">
            <span class="font-bold text-gray-700 shrink-0">연회비</span>
            <div>
              <template v-if="detail.annualFeeObj">
                <p>국내전용 {{ detail.annualFeeObj.domestic }}</p>
                <p>해외겸용 {{ detail.annualFeeObj.foreign }}</p>
              </template>
              <template v-else>
                <p>{{ detail.annualFeeFormatted || (detail.annualFee ? `${detail.annualFee.toLocaleString()}원` : '없음') }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Major Benefits Section -->
      <section class="mt-7">
        <h3 class="text-base font-bold text-gray-900">주요 혜택</h3>

        <div v-if="detail.benefits && detail.benefits.length > 0" class="mt-3 flex flex-col gap-2.5">
          <div
            v-for="(benefit, index) in detail.benefits"
            :key="index"
            class="flex items-center gap-3.5 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs"
          >
            <div class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FFF0EF] text-btn-pk">
              <ShoppingBag v-if="benefit.iconType === 'shopping'" class="h-5 w-5" :stroke-width="1.8" />
              <Bus v-else-if="benefit.iconType === 'transport'" class="h-5 w-5" :stroke-width="1.8" />
              <Coffee v-else-if="benefit.iconType === 'coffee'" class="h-5 w-5" :stroke-width="1.8" />
              <CreditCard v-else class="h-5 w-5" :stroke-width="1.8" />
            </div>

            <div class="flex flex-col">
              <strong class="text-xs font-bold text-gray-900 sm:text-sm">
                {{ benefit.title }}
              </strong>
              <p
                v-if="benefit.description && benefit.description !== benefit.title"
                class="mt-0.5 text-[11px] text-dm-gray-dark sm:text-xs"
              >
                {{ benefit.description }}
              </p>
            </div>
          </div>
        </div>

        <p v-else class="mt-2 text-xs text-gray-400">
          등록된 주요 혜택 정보가 없습니다.
        </p>
      </section>

      <!-- Terms and Conditions Section -->
      <section v-if="detail.terms && detail.terms.length > 0" class="mt-6">
        <h3 class="text-base font-bold text-gray-900">이용 조건</h3>

        <ul class="mt-2.5 space-y-1.5 text-xs text-[#606170]">
          <li v-for="(term, index) in detail.terms" :key="index" class="flex items-start gap-1.5">
            <span class="shrink-0 text-gray-400">·</span>
            <span>{{ term }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
