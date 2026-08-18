<script setup lang="ts">
import { SquarePen } from '@lucide/vue';
import { useExpenseFeedback } from '@/composables/useExpenseFeedback';

const props = defineProps<{ year: number; month: number }>();

const {
  feedbacks,
  shouldShowPrompt,
  feedbackSaving,
  isEditing,
  draftContent,
  saveErrorMessage,
  openEditor,
  closeEditor,
  submitFeedback,
} = useExpenseFeedback(() => props.year, () => props.month);
</script>

<template>
  <section class="rounded-[20px] border border-brand-border bg-white p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-extrabold">상대방에게 피드백 남기기</h2>
      <button type="button" aria-label="피드백 작성 또는 수정" class="text-deep-green" @click="openEditor">
        <SquarePen class="h-5 w-5" :stroke-width="2.3" />
      </button>
    </div>

    <form v-if="isEditing" class="mt-4" @submit.prevent="submitFeedback">
      <textarea
        v-model="draftContent"
        rows="3"
        maxlength="200"
        placeholder="상대에게 이번 달 지출 피드백을 남겨보세요."
        class="w-full resize-none rounded-xl border border-dm-mint px-3 py-3 text-sm outline-none focus:border-dm-mint-darker"
        :disabled="feedbackSaving"
      />
      <p v-if="saveErrorMessage" class="mt-1 text-xs font-medium text-red">
        {{ saveErrorMessage }}
      </p>
      <div class="mt-2 flex justify-end">
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-full bg-dm-gray-light px-4 py-2 text-xs font-semibold text-dm-gray-dark"
            :disabled="feedbackSaving"
            @click="closeEditor"
          >
            취소
          </button>
          <button
            type="submit"
            class="rounded-full bg-dm-mint-darker px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            :disabled="feedbackSaving"
          >
            {{ feedbackSaving ? '저장 중' : '저장' }}
          </button>
        </div>
      </div>
    </form>

    <div v-else-if="feedbacks.length" class="mt-4 space-y-4">
      <div
        v-for="(feedback, index) in feedbacks"
        :key="`${feedback.feedbackId}-${feedback.writerUserId}-${index}`"
        class="flex items-center gap-3"
        :class="feedback.isMine ? 'justify-end' : 'justify-start'"
      >
        <div v-if="!feedback.isMine" class="h-10 w-10 shrink-0 rounded-full bg-disable" aria-hidden="true" />
        <p
          class="max-w-[calc(100%-52px)] rounded-[15px] px-5 py-3 text-[13px] font-semibold text-white"
          :class="feedback.isMine ? 'rounded-br-none bg-pink-06' : 'rounded-bl-none bg-dm-mint-darker'"
        >
          {{ feedback.content }}
        </p>
        <div v-if="feedback.isMine" class="h-10 w-10 shrink-0 rounded-full bg-disable" aria-hidden="true" />
      </div>
    </div>

    <button
      v-if="!isEditing && shouldShowPrompt"
      type="button"
      class="mt-4 w-full rounded-xl bg-dm-mint-light px-4 py-4 text-center text-sm font-semibold text-deep-green"
      @click="openEditor"
    >
      상대에게 이번 달 지출을 피드백해보세요!
    </button>
  </section>
</template>
