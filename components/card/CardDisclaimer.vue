<script setup lang="ts">
import { ChevronRight } from '@lucide/vue';
</script>

<template>
  <div class="rounded-2xl bg-[#F6F7F9] p-4 text-[11px] font-medium leading-relaxed text-[#767785]">
    <ul class="space-y-1">
      <li class="flex items-start gap-1">
        <span class="shrink-0">·</span>
        <span
          >예상 혜택은 계획 지출 기준 <strong class="font-bold text-gray-700">추정치</strong>이며
          확정 혜택이 아니에요</span
        >
      </li>
      <li class="flex items-start gap-1">
        <span class="shrink-0">·</span>
        <span>
          종료 · 변경된 상품은 추천에서 제외돼요 ·
          <a
            href="https://www.card-gorilla.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center font-bold text-brand hover:underline"
          >
            <span>공식 페이지에서 확인</span>
            <ChevronRight class="h-3 w-3" />
          </a>
        </span>
      </li>
    </ul>
  </div>
</template>
