export interface AiChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}
