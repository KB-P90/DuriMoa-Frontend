<script setup lang="ts">
import { Bot, Send, X } from '@lucide/vue';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui';
import type { AiChatMessage } from '@/types/aiChat';

defineProps<{
  open: boolean;
  title: string;
  description: string;
  messages: readonly AiChatMessage[];
  canSend: boolean;
}>();

const draft = defineModel<string>('draft', { required: true });

const emit = defineEmits<{
  'update:open': [value: boolean];
  submit: [];
}>();

function handleComposerKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  emit('submit');
}
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
          class="flex min-h-0 flex-1 flex-col overflow-y-auto bg-dm-gray-light/55 px-4 py-5 scrollbar-none"
          aria-live="polite"
          aria-label="대화 메시지"
        >
          <div
            v-if="messages.length === 0"
            class="m-auto flex max-w-64 flex-col items-center text-center"
          >
            <span
              class="grid h-14 w-14 place-items-center rounded-full bg-dm-mint-light text-dm-mint-darker"
              aria-hidden="true"
            >
              <Bot
                class="h-7 w-7"
                :stroke-width="1.8"
              />
            </span>
            <p class="mt-4 text-sm font-bold text-gray-800">무엇을 도와드릴까요?</p>
            <p class="mt-1.5 text-xs leading-5 text-dm-gray-dark">
              결혼 준비와 예산에 관해 궁금한 내용을 입력해 주세요.
            </p>
          </div>

          <ol
            v-else
            class="flex flex-col gap-3"
          >
            <li
              v-for="message in messages"
              :key="message.id"
              class="flex"
              :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <p
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
          </ol>
        </div>

        <form
          class="flex shrink-0 items-end gap-2 border-t border-dm-gray/25 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          @submit.prevent="emit('submit')"
        >
          <textarea
            v-model="draft"
            rows="1"
            maxlength="1000"
            aria-label="메시지 입력"
            placeholder="메시지를 입력해 주세요"
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
