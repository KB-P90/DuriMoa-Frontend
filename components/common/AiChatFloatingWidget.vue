<script setup lang="ts">
import { MessageCircleMore } from '@lucide/vue';
import AiChatPanel from '@/components/common/AiChatPanel.vue';
import { useAiChat } from '@/composables/useAiChat';
import type { AiChatMessage } from '@/types/aiChat';

const props = withDefaults(
  defineProps<{
    buttonLabel?: string;
    buttonImageSrc?: string;
    chatTitle?: string;
    chatDescription?: string;
  }>(),
  {
    buttonLabel: 'AI 채팅 열기',
    chatTitle: '두리모아 AI',
    chatDescription: '결혼 준비와 예산을 함께 살펴봐요',
  }
);

const messages = defineModel<AiChatMessage[]>('messages', { default: () => [] });

const { canSend, draft, isOpen, isSending, openChat, sendMessage, updateOpen } =
  useAiChat(messages);
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 bottom-[calc(7rem+env(safe-area-inset-bottom))] z-[70] mx-auto h-20 w-full max-w-[768px]"
  >
    <button
      type="button"
      :aria-label="buttonLabel"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      title="AI 채팅 열기"
      class="group pointer-events-auto absolute bottom-0 right-[max(1.25rem,env(safe-area-inset-right))] grid h-20 w-20 cursor-pointer select-none place-items-center rounded-full bg-transparent text-white transition-[filter,transform] hover:drop-shadow-[0_8px_12px_rgb(234_48_111_/_0.3)] active:scale-95 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand/35"
      @click="openChat"
    >
      <img
        v-if="buttonImageSrc"
        :src="buttonImageSrc"
        alt=""
        aria-hidden="true"
        draggable="false"
        class="h-full w-full object-contain transition duration-200 group-hover:scale-105"
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
    :is-sending="isSending"
    @submit="sendMessage"
    @update:open="updateOpen"
  />
</template>
