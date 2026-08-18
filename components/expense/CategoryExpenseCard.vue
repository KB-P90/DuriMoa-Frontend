<script setup lang="ts">
import { useExpenseComparison } from '@/composables/useExpenseComparison';

defineProps<{ month: number }>();

const { rows, insight, isChartAnimated } = useExpenseComparison();
</script>

<template>
  <section class="rounded-[20px] border border-pink-02 bg-white p-4 shadow-sm">
    <h2 class="text-sm font-extrabold">카테고리별 지출</h2>
    <p class="mt-1 text-[13px] text-dm-gray-dark">
      <span class="font-bold text-pink-05">나</span>와
      <span class="font-bold text-dm-mint-darker">상대</span>의 소득 대비 소비 비율을 비교해보세요.
    </p>

    <div class="mt-6 space-y-5">
      <div
        v-for="row in rows"
        :key="row.code"
        class="grid grid-cols-[76px_1fr] items-center gap-2"
      >
        <div class="flex items-center gap-2 text-sm font-extrabold leading-tight">
          <span
            class="w-5 text-center text-xs"
            aria-hidden="true"
            >{{ row.icon }}</span
          >
          <span>{{ row.label }}</span>
        </div>
        <div class="space-y-2">
          <div class="h-3.5 overflow-hidden rounded-md bg-dm-gray-light">
            <div
              class="h-full origin-left rounded-md bg-pink-05 transition-transform duration-700 ease-out"
              :class="isChartAnimated ? 'scale-x-100' : 'scale-x-0'"
              :style="{ width: row.mineWidth }"
            />
          </div>
          <div class="h-3.5 overflow-hidden rounded-md bg-dm-gray-light">
            <div
              class="h-full origin-left rounded-md bg-dm-mint-darker transition-transform duration-700 ease-out"
              :class="isChartAnimated ? 'scale-x-100' : 'scale-x-0'"
              :style="{ width: row.partnerWidth }"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="mt-6 rounded-[14px] border border-pink-04 px-4 py-4 text-center text-[13px] leading-6"
    >
      <template v-if="insight">
        <p>
          이번 달은
          <span class="font-bold text-pink-05">{{ insight.higherSpenderName }}</span
          >의 소비가 더 많아요.
        </p>
        <p>
          <span class="inline-block whitespace-nowrap"
            >두 분의 지출액 차이가 가장 큰 카테고리는</span
          >
          <span class="ml-1 inline-block whitespace-nowrap">
            <span class="border-b-2 border-pink-04 font-bold">{{ insight.categoryLabel }}</span
            >이에요.
          </span>
        </p>
      </template>
      <p
        v-else
        class="text-dm-gray-dark"
      >
        {{ month }}월 지출 내역이 아직 없어요.
      </p>
    </div>
  </section>
</template>
