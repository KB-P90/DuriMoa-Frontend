<script setup lang="ts">
import { SquarePen } from '@lucide/vue';
import { useExpenseFeedback } from '@/composables/useExpenseFeedback';

const { feedbacks, shouldShowPrompt } = useExpenseFeedback();
</script>

<template>
  <section class="rounded-[20px] border border-brand-border bg-white p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-extrabold">상대방에게 피드백 남기기</h2>
      <button type="button" aria-label="피드백 작성" class="text-deep-green">
        <SquarePen class="h-5 w-5" :stroke-width="2.3" />
      </button>
    </div>

    <div v-if="feedbacks.length" class="mt-4 space-y-4">
      <div
        v-for="(feedback, index) in feedbacks"
        :key="`${feedback.feedbackId}-${feedback.writerUserId}-${index}`"
        class="flex items-center gap-3"
        :class="feedback.isMine ? 'justify-end' : 'justify-start'"
      >
        <div
          v-if="!feedback.isMine"
          class="h-10 w-10 shrink-0 rounded-full bg-disable"
          aria-hidden="true"
        />
        <p
          class="max-w-[calc(100%-52px)] rounded-[15px] px-5 py-3 text-[13px] font-semibold text-white"
          :class="
            feedback.isMine
              ? 'rounded-br-none bg-pink-06'
              : 'rounded-bl-none bg-dm-mint-darker'
          "
        >
          {{ feedback.content }}
        </p>
        <div
          v-if="feedback.isMine"
          class="h-10 w-10 shrink-0 rounded-full bg-disable"
          aria-hidden="true"
        />
      </div>
    </div>
    <p
      v-if="shouldShowPrompt"
      class="mt-4 rounded-xl bg-dm-mint-light px-4 py-4 text-center text-sm font-semibold text-deep-green"
    >
      상대에게 이번 달 지출을 피드백해보세요!
    </p>
  </section>
</template>
