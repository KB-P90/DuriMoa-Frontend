<script setup lang="ts">
import { computed, ref } from 'vue';
import { X, ShoppingBag, Bus, Coffee, CreditCard } from '@lucide/vue';
import type { CardDetail } from '@/types/card';

defineProps<{
  detail: CardDetail;
}>();

const emit = defineEmits<{
  close: [];
}>();

const imageError = ref(false);
const isClosing = ref(false);
const isDragging = ref(false);
const dragOffsetY = ref(0);

const CLOSE_ANIMATION_DURATION = 300;
const CLOSE_DRAG_THRESHOLD = 96;

let dragStartY = 0;

const sheetStyle = computed(() => ({
  transform: isClosing.value
    ? 'translateY(100%)'
    : `translateY(${dragOffsetY.value}px)`,
  transition: isDragging.value ? 'none' : `transform ${CLOSE_ANIMATION_DURATION}ms ease-out`,
}));

function closeWithAnimation() {
  if (isClosing.value) return;

  isDragging.value = false;
  isClosing.value = true;
  window.setTimeout(() => emit('close'), CLOSE_ANIMATION_DURATION);
}

function startDrag(event: PointerEvent) {
  if (isClosing.value || !event.isPrimary) return;

  isDragging.value = true;
  dragStartY = event.clientY - dragOffsetY.value;
  event.currentTarget instanceof HTMLElement && event.currentTarget.setPointerCapture(event.pointerId);
}

function moveDrag(event: PointerEvent) {
  if (!isDragging.value || !event.isPrimary) return;

  const nextOffset = event.clientY - dragStartY;
  dragOffsetY.value = Math.max(nextOffset, 0);
}

function endDrag(event: PointerEvent) {
  if (!isDragging.value || !event.isPrimary) return;

  isDragging.value = false;
  if (dragOffsetY.value >= CLOSE_DRAG_THRESHOLD) {
    closeWithAnimation();
    return;
  }

  dragOffsetY.value = 0;
}

function cancelDrag() {
  if (!isDragging.value) return;

  isDragging.value = false;
  dragOffsetY.value = 0;
}
</script>

<template>
  <div
    class="fixed inset-0 z-[60] flex cursor-pointer items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-300"
    :class="isClosing ? 'opacity-0' : 'opacity-100'"
    @click.self="closeWithAnimation"
  >
    <div
      class="relative max-h-[85vh] w-full max-w-[768px] cursor-default overflow-y-auto scrollbar-none rounded-t-[32px] bg-white px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out"
      :style="sheetStyle"
    >
      <!-- Bottom Sheet Drag Handle Bar -->
      <div
        role="slider"
        aria-label="카드 상세 시트 위치"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.min(Math.max(Math.round(dragOffsetY), 0), 100)"
        tabindex="0"
        class="mx-auto mb-4 w-fit cursor-grab touch-none select-none px-3 py-1 active:cursor-grabbing"
        @pointerdown="startDrag"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="cancelDrag"
        @keydown.down.prevent="closeWithAnimation"
      >
        <span class="block h-1.5 w-12 rounded-full bg-gray-200" />
      </div>

      <!-- Close Button -->
      <button
        type="button"
        aria-label="닫기"
        class="absolute right-5 top-5 grid h-8 w-8 cursor-pointer place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        @click="closeWithAnimation"
      >
        <X
          class="h-5 w-5"
          :stroke-width="2.2"
        />
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
              <span class="text-xs font-bold tracking-widest text-white/80">{{
                detail.cardCompany
              }}</span>
              <span class="text-[11px] font-extrabold tracking-wider text-white line-clamp-1">{{
                detail.cardName
              }}</span>
            </div>
          </template>
        </div>

        <!-- Card Company, Name, Annual Fee -->
        <div class="flex flex-1 flex-col pt-1">
          <span
            class="self-start rounded-full border border-pink-300 px-3 py-0.5 text-xs font-semibold text-brand"
          >
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
                <p>
                  {{
                    detail.annualFeeFormatted ||
                    (detail.annualFee ? `${detail.annualFee.toLocaleString()}원` : '없음')
                  }}
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Major Benefits Section -->
      <section class="mt-7">
        <h3 class="text-base font-bold text-gray-900">주요 혜택</h3>

        <div
          v-if="detail.benefits && detail.benefits.length > 0"
          class="mt-3 flex flex-col gap-2.5"
        >
          <div
            v-for="(benefit, index) in detail.benefits"
            :key="index"
            class="flex items-center gap-3.5 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs"
          >
            <div
              class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FFF0EF] text-brand"
            >
              <ShoppingBag
                v-if="benefit.iconType === 'shopping'"
                class="h-5 w-5"
                :stroke-width="1.8"
              />
              <Bus
                v-else-if="benefit.iconType === 'transport'"
                class="h-5 w-5"
                :stroke-width="1.8"
              />
              <Coffee
                v-else-if="benefit.iconType === 'coffee'"
                class="h-5 w-5"
                :stroke-width="1.8"
              />
              <CreditCard
                v-else
                class="h-5 w-5"
                :stroke-width="1.8"
              />
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

        <p
          v-else
          class="mt-2 text-xs text-gray-400"
        >
          등록된 주요 혜택 정보가 없습니다.
        </p>
      </section>

      <!-- Terms and Conditions Section -->
      <section
        v-if="detail.terms && detail.terms.length > 0"
        class="mt-6"
      >
        <h3 class="text-base font-bold text-gray-900">이용 조건</h3>

        <ul class="mt-2.5 space-y-1.5 text-xs text-[#606170]">
          <li
            v-for="(term, index) in detail.terms"
            :key="index"
            class="flex items-start gap-1.5"
          >
            <span class="shrink-0 text-gray-400">·</span>
            <span>{{ term }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
