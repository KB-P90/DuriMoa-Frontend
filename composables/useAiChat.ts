import { computed, ref, type Ref } from 'vue';
import { postAiChatMessage } from '@/server/aiApi';
import type { AiChatMessage } from '@/types/aiChat';

let nextMessageId = 1;

export function useAiChat(messages: Ref<AiChatMessage[]>) {
  const isOpen = ref(false);
  const draft = ref('');
  const isSending = ref(false);

  const canSend = computed(() => draft.value.trim().length > 0 && !isSending.value);

  function openChat() {
    isOpen.value = true;
  }

  function closeChat() {
    isOpen.value = false;
  }

  function updateOpen(value: boolean) {
    isOpen.value = value;
  }

  async function sendMessage() {
    const content = draft.value.trim();
    if (!content || isSending.value) return;

    const message: AiChatMessage = {
      id: nextMessageId,
      role: 'user',
      content,
    };

    nextMessageId += 1;
    messages.value = [...messages.value, message];
    draft.value = '';
    isSending.value = true;

    try {
      const result = await postAiChatMessage({ message: content });
      appendAssistantMessage(result.response);
    } catch {
      appendAssistantMessage('AI 응답을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      isSending.value = false;
    }
  }

  function appendAssistantMessage(content: string) {
    const message: AiChatMessage = {
      id: nextMessageId,
      role: 'assistant',
      content,
    };

    nextMessageId += 1;
    messages.value = [...messages.value, message];
  }

  return {
    canSend,
    closeChat,
    draft,
    isOpen,
    isSending,
    openChat,
    sendMessage,
    updateOpen,
  };
}
