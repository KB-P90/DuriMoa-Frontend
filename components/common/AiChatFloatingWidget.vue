<script setup lang="ts">
import { ref } from 'vue';
import { MessageCircleMore } from '@lucide/vue';
import AiChatPanel from '@/components/common/AiChatPanel.vue';
import { useAiChat } from '@/composables/useAiChat';
import { useLongPressDrag } from '@/composables/useLongPressDrag';
import type { AiChatMessage, FloatingCorner } from '@/types/aiChat';

const props = withDefaults(
  defineProps<{
    buttonLabel?: string;
    buttonImageSrc?: string;
    chatTitle?: string;
    chatDescription?: string;
    initialPosition?: FloatingCorner;
    longPressDelay?: number;
  }>(),
  {
    buttonLabel: 'AI 채팅 열기',
    chatTitle: '두리모아 AI',
    chatDescription: '결혼 준비와 예산을 함께 살펴봐요',
    initialPosition: 'bottom-right',
    longPressDelay: 450,
  }
);

const emit = defineEmits<{
  send: [message: AiChatMessage];
}>();

const messages = defineModel<AiChatMessage[]>('messages', { default: () => [] });

const boundary = ref<HTMLElement | null>(null);
const floatingButton = ref<HTMLElement | null>(null);

const { canSend, draft, isOpen, openChat, sendMessage, updateOpen } = useAiChat({
  messages,
  onSend: (message) => emit('send', message),
});

const {
  handleClick,
  handleLostPointerCapture,
  handlePointerCancel,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  isDragging,
  isPositionReady,
  positionStyle,
} = useLongPressDrag({
  target: floatingButton,
  boundary,
  initialPosition: props.initialPosition,
  longPressDelay: props.longPressDelay,
  onActivate: openChat,
});
</script>

<template>
  <div
    ref="boundary"
    class="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-[70]"
  >
    <button
      ref="floatingButton"
      type="button"
      :aria-label="buttonLabel"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      title="짧게 눌러 채팅 열기, 길게 눌러 위치 이동"
      class="group pointer-events-auto absolute grid h-16 w-16 touch-none select-none place-items-center overflow-hidden rounded-full bg-brand text-white shadow-xl ring-2 ring-white transition-[background-color,box-shadow,transform,opacity] hover:bg-brand-dark hover:shadow-2xl active:scale-95 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand/35"
      :class="[
        isDragging ? 'scale-110 cursor-grabbing shadow-2xl' : 'cursor-grab',
        isPositionReady ? 'opacity-100' : 'opacity-0',
      ]"
      :style="positionStyle"
      @click="handleClick"
      @lostpointercapture="handleLostPointerCapture"
      @pointercancel="handlePointerCancel"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
    >
      <img
        v-if="buttonImageSrc"
        :src="buttonImageSrc"
        alt=""
        aria-hidden="true"
        draggable="false"
        class="h-full w-full object-cover object-top transition duration-200 group-hover:scale-105 group-hover:brightness-95"
      />
      <MessageCircleMore
        v-else
        class="h-7 w-7"
        :stroke-width="2.2"
      />
    </button>
  </div>

  <AiChatPanel
    v-model:draft="draft"
    :open="isOpen"
    :title="chatTitle"
    :description="chatDescription"
    :messages="messages"
    :can-send="canSend"
    @submit="sendMessage"
    @update:open="updateOpen"
  />
</template>
