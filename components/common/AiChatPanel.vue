<script setup lang="ts">
import { Bot, PieChart, Send, WalletCards, X } from '@lucide/vue';
import { nextTick, ref, watch } from 'vue';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui';
import AiWeddingBudgetFlow from '@/components/ai/AiWeddingBudgetFlow.vue';
import AiSpendingReportFlow from '@/components/ai/AiSpendingReportFlow.vue';
import type {
  AiChatMessage,
  AiWeddingBudgetStep,
  WeddingBudgetRecommendation,
} from '@/types/aiChat';
import type { RegionName } from '@/types/goal';
import type { AiSpendingReportStep, SpendingReport } from '@/types/aiSpendingReport';

const props = defineProps<{
  open: boolean;
  title: string;
  description: string;
  messages: readonly AiChatMessage[];
  canSend: boolean;
  isSending: boolean;
  isFlowInputLocked: boolean;
  weddingBudgetStep: AiWeddingBudgetStep;
  weddingDate: string;
  weddingRegion: RegionName | null;
  recommendation: WeddingBudgetRecommendation | null;
  spendingReportStep: AiSpendingReportStep;
  spendingReport: SpendingReport | null;
}>();

const draft = defineModel<string>('draft', { required: true });
const messageViewport = ref<HTMLElement | null>(null);

const emit = defineEmits<{
  'update:open': [value: boolean];
  'update:weddingDate': [value: string];
  'update:weddingRegion': [value: RegionName];
  submit: [];
  confirmWeddingDate: [];
  confirmWeddingRegion: [];
  applyWeddingBudget: [];
}>();

function handleComposerKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  emit('submit');
}

watch(
  () => [props.messages.length, props.isSending],
  async () => {
    await nextTick();
    messageViewport.value?.scrollTo({
      top: messageViewport.value.scrollHeight,
      behavior: 'smooth',
    });
  }
);
</script>

<template>
  <DialogRoot
    :open="open"
    @update:open="emit('update:open', $event)"
  >
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-[80] bg-gray-900/20 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in"
      />

      <DialogContent
        class="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] top-[max(0.75rem,env(safe-area-inset-top))] z-[90] mx-auto flex max-w-[46.5rem] flex-col overflow-hidden rounded-3xl border border-dm-gray/30 bg-white shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-4"
      >
        <header class="flex shrink-0 items-center gap-3 border-b border-dm-gray/25 px-4 py-3.5">
          <span
            class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-dm-mint-light text-dm-mint-darker"
            aria-hidden="true"
          >
            <Bot
              class="h-5 w-5"
              :stroke-width="2"
            />
          </span>

          <div class="min-w-0 flex-1">
            <DialogTitle class="truncate text-base font-extrabold text-gray-900">
              {{ title }}
            </DialogTitle>
            <DialogDescription class="text-xs text-dm-gray-dark">
              {{ description }}
            </DialogDescription>
          </div>

          <DialogClose as-child>
            <button
              type="button"
              aria-label="AI 채팅 닫기"
              class="grid h-9 w-9 shrink-0 place-items-center rounded-full text-dm-gray-dark transition hover:bg-dm-gray-light hover:text-gray-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand/30"
            >
              <X
                class="h-5 w-5"
                :stroke-width="2"
              />
            </button>
          </DialogClose>
        </header>

        <div
          ref="messageViewport"
          class="flex min-h-0 flex-1 flex-col overflow-y-auto bg-dm-gray-light/55 px-4 py-5 scrollbar-none"
          aria-live="polite"
          :aria-busy="isSending"
          aria-label="대화 메시지"
        >
          <ol class="flex flex-col gap-3">
            <li
              v-for="message in messages"
              :key="message.id"
              class="flex"
              :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <div
                v-if="message.variant === 'welcome'"
                class="max-w-[88%] rounded-2xl rounded-bl-md border border-dm-gray/25 bg-white p-3.5 text-sm shadow-sm"
              >
                <p class="whitespace-pre-wrap font-semibold leading-5 text-gray-800">
                  {{ message.content }}
                </p>

                <ul class="mt-3 space-y-2.5">
                  <li class="flex items-start gap-2.5">
                    <span
                      class="mt-0.5 shrink-0 text-dm-mint-darker"
                      aria-hidden="true"
                    >
                      <WalletCards class="h-4 w-4" />
                    </span>
                    <div>
                      <p class="text-xs font-extrabold text-gray-800">맞춤 결혼 예산 추천</p>
                      <p class="mt-0.5 text-[11px] leading-4 text-dm-gray-dark">
                        소비 내역을 바탕으로 항목별 예산을 구성해요
                      </p>
                    </div>
                  </li>

                  <li class="flex items-start gap-2.5">
                    <span
                      class="mt-0.5 shrink-0 text-dm-mint-darker"
                      aria-hidden="true"
                    >
                      <PieChart class="h-4 w-4" />
                    </span>
                    <div>
                      <p class="text-xs font-extrabold text-gray-800">가입 후 소비 리포트</p>
                      <p class="mt-0.5 text-[11px] leading-4 text-dm-gray-dark">
                        전체 지출 흐름과 항목·요일별 소비를 분석해요
                      </p>
                    </div>
                  </li>

                </ul>

                <p class="mt-3 border-t border-dm-gray/20 pt-2.5 text-xs text-dm-gray-dark">
                  궁금한 내용이나 필요한 도움을 자유롭게 말씀해 주세요.
                  <span class="mt-1 block">
                    더 다양한 결혼 준비 AI 기능도 계속 추가될 예정이에요.
                  </span>
                </p>
              </div>

              <p
                v-else
                class="max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-5 shadow-sm"
                :class="
                  message.role === 'user'
                    ? 'rounded-br-md bg-brand text-white'
                    : 'rounded-bl-md border border-dm-gray/25 bg-white text-gray-800'
                "
              >
                {{ message.content }}
              </p>
            </li>
            <li
              v-if="
                isSending && weddingBudgetStep !== 'analyzing' && spendingReportStep !== 'analyzing'
              "
              class="flex justify-start"
            >
              <p
                class="rounded-2xl rounded-bl-md border border-dm-gray/25 bg-white px-3.5 py-2.5 text-sm text-dm-gray-dark shadow-sm"
              >
                답변을 작성하고 있어요...
              </p>
            </li>
          </ol>

          <AiWeddingBudgetFlow
            :step="weddingBudgetStep"
            :wedding-date="weddingDate"
            :wedding-region="weddingRegion"
            :recommendation="recommendation"
            @update:wedding-date="emit('update:weddingDate', $event)"
            @update:wedding-region="emit('update:weddingRegion', $event)"
            @confirm-date="emit('confirmWeddingDate')"
            @confirm-region="emit('confirmWeddingRegion')"
            @apply="emit('applyWeddingBudget')"
          />

          <AiSpendingReportFlow
            :step="spendingReportStep"
            :report="spendingReport"
          />
        </div>

        <form
          class="flex shrink-0 items-end gap-2 border-t border-dm-gray/25 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          @submit.prevent="emit('submit')"
        >
          <textarea
            v-model="draft"
            rows="1"
            maxlength="1000"
            :disabled="isFlowInputLocked"
            aria-label="메시지 입력"
            :placeholder="
              isFlowInputLocked ? '위 선택을 먼저 완료해 주세요' : '메시지를 입력해 주세요'
            "
            class="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-dm-gray/40 bg-dm-gray-light px-3.5 py-2.5 text-sm leading-5 text-gray-900 outline-none transition placeholder:text-dm-gray-dark focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10"
            @keydown="handleComposerKeydown"
          />
          <button
            type="submit"
            aria-label="메시지 전송"
            class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-white shadow-sm transition enabled:hover:bg-brand-dark enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-dm-gray focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand/30"
            :disabled="!canSend"
          >
            <Send
              class="h-5 w-5"
              :stroke-width="2"
            />
          </button>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
