<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  items: number[];
  modelValue: number;
  suffix: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [number];
}>();

const ITEM_HEIGHT = 40;

const containerRef = ref<HTMLDivElement | null>(null);
let settleTimer: ReturnType<typeof setTimeout> | null = null;
let isSyncingScroll = false;

function indexOf(value: number) {
  const index = props.items.indexOf(value);
  return index === -1 ? 0 : index;
}

function scrollToIndex(index: number, smooth: boolean) {
  const el = containerRef.value;
  if (!el) return;

  isSyncingScroll = true;
  el.scrollTo({ top: index * ITEM_HEIGHT, behavior: smooth ? 'smooth' : 'instant' });
  requestAnimationFrame(() => {
    isSyncingScroll = false;
  });
}

onMounted(() => {
  scrollToIndex(indexOf(props.modelValue), false);
});

watch(
  () => props.items,
  () => scrollToIndex(indexOf(props.modelValue), false)
);

watch(
  () => props.modelValue,
  (value) => {
    if (isSyncingScroll) return;
    scrollToIndex(indexOf(value), false);
  }
);

const isDragging = ref(false);
let dragStartY = 0;
let dragStartScrollTop = 0;

function onDragStart(event: MouseEvent) {
  const el = containerRef.value;
  if (!el) return;

  isDragging.value = true;
  dragStartY = event.clientY;
  dragStartScrollTop = el.scrollTop;
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
}

function onDragMove(event: MouseEvent) {
  const el = containerRef.value;
  if (!el || !isDragging.value) return;

  event.preventDefault();
  el.scrollTop = dragStartScrollTop - (event.clientY - dragStartY);
}

function onDragEnd() {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', onDragEnd);
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', onDragEnd);
});

function handleScroll() {
  if (isSyncingScroll) return;
  if (settleTimer) clearTimeout(settleTimer);

  settleTimer = setTimeout(() => {
    const el = containerRef.value;
    if (!el) return;

    const index = Math.min(
      Math.max(Math.round(el.scrollTop / ITEM_HEIGHT), 0),
      props.items.length - 1
    );
    scrollToIndex(index, true);

    const value = props.items[index];
    if (value !== undefined && value !== props.modelValue) {
      emit('update:modelValue', value);
    }
  }, 100);
}
</script>

<template>
  <div
    ref="containerRef"
    class="h-[120px] flex-1 select-none overflow-y-scroll scrollbar-none"
    :class="isDragging ? 'cursor-grabbing' : 'cursor-grab snap-y snap-mandatory'"
    @scroll="handleScroll"
    @mousedown="onDragStart"
  >
    <div class="h-10" />
    <div
      v-for="item in items"
      :key="item"
      class="flex h-10 snap-center items-center justify-center text-base transition-colors"
      :class="item === modelValue ? 'font-bold text-[#232631]' : 'text-dm-gray'"
    >
      {{ item }}{{ suffix }}
    </div>
    <div class="h-10" />
  </div>
</template>
