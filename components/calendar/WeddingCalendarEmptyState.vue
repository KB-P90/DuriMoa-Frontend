<script setup lang="ts">
import { ReceiptText } from '@lucide/vue';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import WeddingCalendarTutorialDialog from '@/components/calendar/WeddingCalendarTutorialDialog.vue';

const isTutorialOpen = ref(false);
</script>

<template>
  <section
    class="rounded-3xl border border-dm-gray/30 bg-background px-5 py-6 text-center"
    aria-labelledby="wedding-calendar-empty-title"
  >
    <span
      class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-btn-mt text-btn-mt-dark"
      aria-hidden="true"
    >
      <ReceiptText
        class="h-9 w-9"
        :stroke-width="1.4"
      />
    </span>

    <h2
      id="wedding-calendar-empty-title"
      class="mt-4 text-base font-semibold text-gray-800"
    >
      아직 이번 달 결혼비용 내역이 없어요
    </h2>
    <p class="mt-1.5 text-sm leading-6 text-dm-gray-dark">
      결혼 관련 카테고리를 선택하면<br />여기에 함께 모여요.
    </p>

    <Button
      type="button"
      class="mt-5 h-12 w-full rounded-2xl border border-dm-mint-dark bg-btn-mt text-sm font-semibold text-btn-mt-dark hover:bg-dm-mint cursor-pointer"
      @click="isTutorialOpen = true"
    >
      결혼비용 추가 방법 보기
    </Button>

    <WeddingCalendarTutorialDialog v-model:open="isTutorialOpen" />
  </section>
</template>
