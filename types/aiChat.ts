import type { Ref } from 'vue';

export type FloatingCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface FloatingCoordinates {
  x: number;
  y: number;
}

export interface AiChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export interface UseLongPressDragOptions {
  target: Ref<HTMLElement | null>;
  boundary: Ref<HTMLElement | null>;
  initialPosition: FloatingCorner;
  longPressDelay?: number;
  movementTolerance?: number;
  onActivate: () => void;
}

export interface UseAiChatOptions {
  messages: Ref<AiChatMessage[]>;
  onSend?: (message: AiChatMessage) => void;
}
