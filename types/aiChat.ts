import type { Ref } from 'vue';

export interface AiChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export interface UseAiChatOptions {
  messages: Ref<AiChatMessage[]>;
  onSend?: (message: AiChatMessage) => void;
}
