<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue';

// 현재 단계와 전체 단계 수를 받아 진행도를 표시한다.
const props = withDefaults(
  defineProps<{
    currentStep: number;
    totalSteps?: number;
  }>(),
  {
    totalSteps: 5,
  }
);

// 상위 온보딩 화면에 이전 단계 이동을 요청한다.
const emit = defineEmits<{ back: [] }>();

// 현재 진행도를 백분율 문자열로 변환한다.
function getProgressWidth() {
  return `${(props.currentStep / props.totalSteps) * 100}%`;
}

// 뒤로가기 버튼 클릭을 상위 화면에 전달한다.
function handleBack() {
  emit('back');
}
</script>

<template>
  <div class="shrink-0 px-4 pt-[max(12px,env(safe-area-inset-top))] max-[359px]:px-3 sm:px-5">
    <div class="mb-2 flex min-h-10 items-center justify-between">
      <button
        type="button"
        class="-ml-2 grid h-10 w-10 shrink-0 place-items-center rounded-[10px] text-dm-gray-dark transition hover:bg-dm-gray/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand/30"
        aria-label="이전 온보딩 단계로 이동"
        @click="handleBack"
      >
        <ArrowLeft
          class="h-[22px] w-[22px]"
          :stroke-width="2.2"
          aria-hidden="true"
        />
      </button>
      <span class="text-[11px] font-medium text-dm-gray-dark">
        {{ currentStep }} / {{ totalSteps }}
      </span>
    </div>
    <div
      class="h-[3px] overflow-hidden rounded-full bg-dm-gray/15"
      role="progressbar"
      :aria-label="`온보딩 ${currentStep}단계`"
      :aria-valuenow="currentStep"
      aria-valuemin="1"
      :aria-valuemax="totalSteps"
    >
      <span
        class="block h-full rounded-full bg-brand transition-[width] duration-300 motion-reduce:transition-none"
        :style="{ width: getProgressWidth() }"
      ></span>
    </div>
  </div>
</template>
