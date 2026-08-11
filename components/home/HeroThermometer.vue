<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  personalRate: number;
  jointRate: number;
}>();

// 0%여도 눈금 하나만큼은 채워져 있어야 튜브가 비어 보이지 않는다.
const MIN_FILL_PERCENT = 15;

function fillPercent(rate: number) {
  return Math.max(Math.min(Math.max(rate, 0), 100), MIN_FILL_PERCENT);
}

// 튜브를 6칸으로 나누는 눈금선 위치(%). 맨 위/아래 끝은 캡·목 라운딩에 가려지니 살짝 여유를 둔다.
const TUBE_TICKS = [15, 30, 45, 60, 75, 90];

// 홈 화면에 들어올 때마다 0에서부터 차오르는 모션을 보여주기 위해 실제 값과 분리된 애니메이션용 값을 둔다.
const animatedPersonalRate = ref(0);
const animatedJointRate = ref(0);

watch(
  () => [props.personalRate, props.jointRate] as const,
  ([personalRate, jointRate]) => {
    animatedPersonalRate.value = 0;
    animatedJointRate.value = 0;
    requestAnimationFrame(() => {
      animatedPersonalRate.value = fillPercent(personalRate);
      animatedJointRate.value = fillPercent(jointRate);
    });
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="self-end md:mb-5 flex h-[200px] w-[140px] shrink-0 items-end justify-center md:h-[210px] md:w-[196px] md:items-center mb-5 mr-2"
  >
    <div class="flex items-end gap-3 pb-3 md:gap-4 md:pb-4">
      <div class="flex -translate-y-15 flex-col items-center">
        <div
          class="relative h-[130px] w-[20px] md:h-[150px] overflow-hidden rounded-full bg-white shadow-inner md:h-[109px] md:w-5"
        >
          <div
            class="absolute inset-x-0 bottom-0 bg-dm-mint-darker transition-[height] duration-700 ease-out"
            :style="{ height: `${animatedPersonalRate}%` }"
          />
          <div
            v-for="tick in TUBE_TICKS"
            :key="tick"
            class="absolute right-0 h-px w-1/2 bg-pink-02"
            :style="{ bottom: `${tick}%` }"
          />
        </div>
        <div
          class="relative z-10 -mt-2 h-[30px] w-[35px] rounded-full bg-dm-mint-darker md:h-9 md:w-9"
        />
      </div>

      <div class="flex flex-col items-center">
        <div
          class="relative h-[180px] w-[25px] md:h-[170px] overflow-hidden rounded-full bg-white shadow-inner md:w-5"
        >
          <div
            class="absolute inset-x-0 bottom-0 bg-brand transition-[height] duration-700 ease-out"
            :style="{ height: `${animatedJointRate}%` }"
          />
          <div
            v-for="tick in TUBE_TICKS"
            :key="tick"
            class="absolute right-0 h-px w-1/2 bg-pink-02"
            :style="{ bottom: `${tick}%` }"
          />
        </div>
        <div class="relative z-10 -mt-2 h-[40px] w-[40px] rounded-full bg-brand md:h-9 md:w-9" />
      </div>
    </div>
  </div>
</template>
