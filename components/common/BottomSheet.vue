<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  close: [];
}>();

const DISMISS_THRESHOLD = 100;

const dragOffset = ref(0);
const dragging = ref(false);
let startY = 0;

function handlePointerDown(event: PointerEvent) {
  dragging.value = true;
  startY = event.clientY;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}

function handlePointerMove(event: PointerEvent) {
  if (!dragging.value) return;
  dragOffset.value = Math.max(event.clientY - startY, 0);
}

function handlePointerUp(event: PointerEvent) {
  if (!dragging.value) return;
  dragging.value = false;
  (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);

  if (dragOffset.value > DISMISS_THRESHOLD) {
    emit('close');
  }
  dragOffset.value = 0;
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      @click.self="$emit('close')"
    >
      <div
        class="relative flex max-h-[85vh] w-full max-w-[768px] cursor-default flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out"
        :style="{
          transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
          transition: dragging ? 'none' : 'transform 0.2s ease-out',
        }"
      >
        <div
          class="flex shrink-0 touch-none justify-center py-3"
          @pointerdown="handlePointerDown"
          @pointermove="handlePointerMove"
          @pointerup="handlePointerUp"
          @pointercancel="handlePointerUp"
        >
          <div class="h-1.5 w-12 rounded-full bg-gray-200" />
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
