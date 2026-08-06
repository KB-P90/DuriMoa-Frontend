<script setup lang="ts">
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
    <svg
      viewBox="0 0 132 82"
      class="mx-auto h-20 w-32"
      fill="none"
      aria-hidden="true"
    >
      <g
        class="text-dm-gray-dark"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M35 13c3 2.8 6 2.8 9 0 3 2.8 6 2.8 9 0 3 2.8 6 2.8 9 0 3 2.8 6 2.8 9 0l-2.5 49c-3-2.8-6-2.8-9 0-3-2.8-6-2.8-9 0-3-2.8-6-2.8-9 0-3 2.8-6 2.8-9 0L35 13Z"
        />
        <path
          d="M46 28c0-5 6.6-6.1 9-1.9 2.4-4.2 9-3.1 9 1.9 0 4.4-4.3 7.2-9 10.5-4.7-3.3-9-6.1-9-10.5Z"
        />
        <path d="M45 45h18M45 53h13" />
      </g>
      <g
        class="text-btn-pk-dark"
        stroke="currentColor"
        stroke-width="3"
      >
        <circle
          cx="72"
          cy="53"
          r="16"
        />
        <circle
          cx="91"
          cy="53"
          r="16"
        />
      </g>
      <g
        class="text-btn-mt-dark"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
      >
        <path d="m16 30 1.5 3.5L21 35l-3.5 1.5L16 40l-1.5-3.5L11 35l3.5-1.5L16 30Z" />
        <path d="m109 23 1.8 4.2 4.2 1.8-4.2 1.8L109 36l-1.8-4.2L103 30l4.2-1.8L109 23Z" />
      </g>
      <path
        class="text-dm-gray-dark"
        d="M113 47c0-4 5.3-4.9 7.2-1.5 1.9-3.4 7.2-2.5 7.2 1.5 0 3.5-3.4 5.8-7.2 8.4-3.8-2.6-7.2-4.9-7.2-8.4Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>

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
      class="mt-5 h-12 w-full rounded-2xl border border-dm-mint-dark bg-btn-mt text-sm font-semibold text-btn-mt-dark hover:bg-dm-mint"
      @click="isTutorialOpen = true"
    >
      결혼비용 추가 방법 보기
    </Button>

    <WeddingCalendarTutorialDialog v-model:open="isTutorialOpen" />
  </section>
</template>
