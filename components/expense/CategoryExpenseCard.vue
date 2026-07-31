<script setup lang="ts">
import { Info } from '@lucide/vue';
import DoughnutChart from './DoughnutChart.vue';
</script>

<template>
  <section class="rounded-3xl border border-dm-rose-light bg-white m-4 sm:m-6 p-4 sm:p-6 shadow-sm">
    <div class="flex items-center gap-2">
      <h2 class="text-m font-bold text-gray-800">카테고리별 지출</h2>
      <button
        type="button"
        class="text-dm-gray-dark cursor-pointer"
      >
        <Info :size="18" />
      </button>
    </div>

    <div class="mt-8 flex justify-center">
      <div class="flex w-full max-w-xl items-center justify-around">
        <!-- 차트 -->
        <div class="aspect-square w-[45%] max-w-56">
          <DoughnutChart />
        </div>

        <!-- 카드 -->
        <div class="flex w-[40%] max-w-48 flex-col gap-4">
          <div class="rounded-3xl border border-gray-100 bg-white p-4 sm:p-5 shadow-md">
            <p class="text-m font-semibold">식비</p>
            <p class="mt-1 text-lg sm:text-xl font-bold text-right">150,000원</p>
          </div>

          <div class="rounded-3xl border border-gray-100 bg-white p-4 sm:p-5 shadow-md">
            <p class="text-m font-semibold">평균 대비</p>
            <p class="mt-1 text-lg sm:text-xl font-bold text-btn-pk text-right">+18%</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <!-- 나중에 Legend -->
    </div>
  </section>
</template>
