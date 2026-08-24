<script setup lang="ts">
import { Bot } from '@lucide/vue';
import AiChatPanel from '@/components/common/AiChatPanel.vue';
import { useAiChat } from '@/composables/useAiChat';
import type { AiChatMessage } from '@/types/aiChat';

const props = defineProps<{
  buttonLabel?: string;
  chatTitle?: string;
  chatDescription?: string;
}>();

const messages = defineModel<AiChatMessage[]>('messages', { default: () => [] });

const {
  applyWeddingBudgetRecommendation,
  canSend,
  confirmWeddingDate,
  confirmWeddingRegion,
  draft,
  isFlowInputLocked,
  isOpen,
  isSending,
  openChat,
  recommendation,
  spendingReport,
  spendingReportStep,
  sendMessage,
  updateOpen,
  updateWeddingDate,
  updateWeddingRegion,
  weddingBudgetStep,
  weddingDate,
  weddingRegion,
} = useAiChat(messages);
</script>

<template>
  <div class="relative flex h-full w-full items-center justify-center overflow-visible">
    <button
      type="button"
      :aria-label="buttonLabel ?? 'AI 채팅 열기'"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :title="buttonLabel ?? 'AI 채팅 열기'"
      class="pointer-events-auto relative translate-y-0.5 flex h-22 w-22 flex-col items-center justify-center rounded-full bg-brand text-white cursor-pointer"
      @click="openChat"
    >
      <Bot
        class="h-7 w-7"
        :stroke-width="2.2"
      />
      <span class="mt-1 mb-3 text-xs leading-none tracking-[-0.02em]">
        {{ buttonLabel ?? 'AI 채팅' }}
      </span>
    </button>
  </div>

  <AiChatPanel
    v-model:draft="draft"
    :open="isOpen"
    :title="chatTitle ?? '두리모아 AI'"
    :description="chatDescription ?? '결혼 준비와 예산을 함께 살펴봐요'"
    :messages="messages"
    :can-send="canSend"
    :is-sending="isSending"
    :is-flow-input-locked="isFlowInputLocked"
    :wedding-budget-step="weddingBudgetStep"
    :wedding-date="weddingDate"
    :wedding-region="weddingRegion"
    :recommendation="recommendation"
    :spending-report="spendingReport"
    :spending-report-step="spendingReportStep"
    @submit="sendMessage"
    @update:open="updateOpen"
    @update:wedding-date="updateWeddingDate"
    @update:wedding-region="updateWeddingRegion"
    @confirm-wedding-date="confirmWeddingDate"
    @confirm-wedding-region="confirmWeddingRegion"
    @apply-wedding-budget="applyWeddingBudgetRecommendation"
  />
</template>
