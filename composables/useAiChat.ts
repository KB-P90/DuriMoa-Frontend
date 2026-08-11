import { computed, ref } from 'vue';
import type { AiChatMessage, UseAiChatOptions } from '@/types/aiChat';

let nextMessageId = 1;

export function useAiChat({ messages, onSend }: UseAiChatOptions) {
  const isOpen = ref(false);
  const draft = ref('');

  const canSend = computed(() => draft.value.trim().length > 0);

  function openChat() {
    isOpen.value = true;
  }

  function closeChat() {
    isOpen.value = false;
  }

  function updateOpen(value: boolean) {
    isOpen.value = value;
  }

  function sendMessage() {
    const content = draft.value.trim();
    if (!content) return;

    const message: AiChatMessage = {
      id: nextMessageId,
      role: 'user',
      content,
    };

    nextMessageId += 1;
    messages.value = [...messages.value, message];
    draft.value = '';
    onSend?.(message);
  }

  return {
    canSend,
    closeChat,
    draft,
    isOpen,
    openChat,
    sendMessage,
    updateOpen,
  };
}
