<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

export interface UsageTip {
  label: string;
  title: string;
  description: string;
  actionLabel: string;
  to: RouteLocationRaw;
  cardClass?: string;
  ctaTextClass?: string;
}

const props = withDefaults(
  defineProps<{
    heading?: string;
    moreLabel?: string;
    tips: UsageTip[];
  }>(),
  {
    heading: '두리모아, 이렇게 써보세요',
    moreLabel: '더보기 ›',
  }
);

const scrollEl = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
const dragStartX = ref<number | null>(null);
const dragStartScrollLeft = ref(0);

function startDrag(event: PointerEvent) {
  if (!scrollEl.value) return;
  dragStartX.value = event.clientX;
  dragStartScrollLeft.value = scrollEl.value.scrollLeft;
  scrollEl.value.setPointerCapture(event.pointerId);
}

function moveDrag(event: PointerEvent) {
  if (dragStartX.value === null || !scrollEl.value) return;
  scrollEl.value.scrollLeft = dragStartScrollLeft.value - (event.clientX - dragStartX.value);
}

function endDrag() {
  dragStartX.value = null;
}

function handleScroll() {
  if (!scrollEl.value) return;
  const index = Math.round(scrollEl.value.scrollLeft / scrollEl.value.clientWidth);
  activeIndex.value = Math.min(Math.max(index, 0), props.tips.length - 1);
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between">
      <h2 class="text-base font-bold leading-4 tracking-[-0.27px] text-[#292934]">
        {{ heading }}
      </h2>
      <span
        v-if="moreLabel"
        class="text-[11px] leading-4 text-dm-gray-dark"
        >{{ moreLabel }}</span
      >
    </div>

    <div
      ref="scrollEl"
      class="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none"
      @pointerdown="startDrag"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @pointerleave="endDrag"
      @scroll="handleScroll"
    >
      <RouterLink
        v-for="tip in tips"
        :key="tip.label"
        :to="tip.to"
        class="min-w-full shrink-0 snap-center rounded-2xl p-5 text-white"
        :class="tip.cardClass ?? 'bg-dm-mint-darker'"
      >
        <span class="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">{{
          tip.label
        }}</span>
        <p class="mt-3 whitespace-pre-line text-lg font-bold leading-6">{{ tip.title }}</p>
        <p class="mt-2 text-xs leading-5 text-white/85">{{ tip.description }}</p>
        <span
          class="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold"
          :class="tip.ctaTextClass ?? 'text-dm-mint-darker'"
        >
          {{ tip.actionLabel }} →
        </span>
      </RouterLink>
    </div>

    <div class="mt-3 flex justify-center gap-1.5">
      <span
        v-for="(tip, index) in tips"
        :key="tip.label"
        class="h-1.5 w-1.5 rounded-full"
        :class="index === activeIndex ? 'bg-dm-mint-darker' : 'bg-[#E5E5EA]'"
      />
    </div>
  </section>
</template>
