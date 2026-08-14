<script setup lang="ts">
import { Check } from '@lucide/vue';
import { RouterLink } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
  steps: readonly string[];
  completedSteps: readonly boolean[];
  currentIndex: number;
  settingsTo: RouteLocationRaw;
}>();
</script>

<template>
  <section class="rounded-2xl border border-[#F0E7E5] bg-white p-[18px]">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-bold text-[#232631]">두리모아 체크리스트</h2>
      <RouterLink
        :to="settingsTo"
        class="flex h-[30px] bg-brand items-center rounded-full px-3 text-xs font-bold text-white shadow-sm"
      >
        설정하기 ›
      </RouterLink>
    </div>
    <p class="mt-2 text-xs text-dm-gray-dark">앞 순서를 완성해야 다음 단계로 진행할 수 있어요</p>

    <div
      class="relative mt-4 flex justify-between before:absolute before:left-5 before:right-5 before:top-[19px] before:h-px before:bg-[#E5E5EA]"
    >
      <div
        v-for="(label, index) in steps"
        :key="label"
        class="relative z-10 flex flex-1 flex-col items-center gap-2"
      >
        <span
          class="grid h-[38px] w-[38px] place-items-center rounded-full text-sm font-bold"
          :class="[
            completedSteps[index]
              ? 'bg-brand text-white'
              : index === currentIndex
                ? 'border-2 border-brand bg-white text-brand'
                : 'border border-dm-gray/55 bg-white text-dm-gray-dark',
          ]"
        >
          <Check
            v-if="completedSteps[index]"
            class="h-5 w-5"
            :stroke-width="3"
            aria-label="완료"
          />
          <template v-else>{{ index + 1 }}</template>
        </span>
        <span
          class="whitespace-nowrap text-[10.5px]"
          :class="
            completedSteps[index] || index === currentIndex
              ? 'font-bold text-brand'
              : 'text-dm-gray-dark'
          "
        >
          {{ label }}
        </span>
      </div>
    </div>

    <div class="mt-3 rounded-xl bg-pink-01 px-3.5 py-2.5 text-xs leading-5 text-[#414552]">
      목표를 설정하면 공동 달성률, 개인 달성률, 예산 분석을 확인할 수 있어요!
    </div>
  </section>
</template>
