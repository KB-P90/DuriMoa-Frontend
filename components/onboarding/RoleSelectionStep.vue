<script setup lang="ts">
import { UserRound } from '@lucide/vue';
import OnboardingActionFooter from '@/components/onboarding/OnboardingActionFooter.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';
import type { CoupleRole } from '@/types/onboarding';

// 이전 단계 이동과 온보딩 완료를 상위 화면에 요청한다.
defineEmits<{ back: []; complete: [] }>();

// 사용자가 선택한 커플 역할이다.
const selection = defineModel<CoupleRole>({ required: true });

// 역할 선택 카드에 표시할 정적 옵션이다.
const ROLE_OPTIONS = [
  {
    value: 'G',
    label: '신랑',
    description: '신랑으로 표시할게요',
  },
  {
    value: 'B',
    label: '신부',
    description: '신부로 표시할게요',
  },
] as const;
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <OnboardingProgress
      :current-step="5"
      @back="$emit('back')"
    />

    <div
      class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[359px]:px-3 sm:px-5"
    >
      <h1 class="text-[21px] font-extrabold tracking-[-0.055em] min-[360px]:text-[23px]">
        어떻게 표시해드릴까요?
      </h1>
      <p class="mt-1.5 text-[12px] leading-5 text-dm-gray-dark">
        화면에 사용할 역할을 선택해주세요
      </p>

      <fieldset class="mt-6 flex flex-col gap-3">
        <legend class="sr-only">화면 표시 역할</legend>
        <label
          v-for="option in ROLE_OPTIONS"
          :key="option.value"
          class="flex min-h-[82px] cursor-pointer items-center gap-3 rounded-[16px] border px-4 py-3 shadow-sm transition"
          :class="
            selection === option.value
              ? 'border-btn-pk bg-dm-cb-light'
              : 'border-dm-gray/30 bg-dm-gray-light hover:border-dm-rose-dark'
          "
        >
          <input
            v-model="selection"
            class="sr-only"
            type="radio"
            name="onboardingRole"
            :value="option.value"
          />
          <span
            class="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-dm-gray-light text-btn-pk-dark"
            aria-hidden="true"
          >
            <UserRound
              class="h-5 w-5"
              :stroke-width="1.8"
            />
          </span>
          <span class="min-w-0 flex-1">
            <strong class="block text-[14px] font-extrabold">{{ option.label }}</strong>
            <span class="mt-1 block text-[11px] text-dm-gray-dark">
              {{ option.description }}
            </span>
          </span>
          <span
            class="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full border"
            :class="selection === option.value ? 'border-btn-pk' : 'border-dm-gray/35'"
            aria-hidden="true"
          >
            <span
              v-if="selection === option.value"
              class="h-[9px] w-[9px] rounded-full bg-btn-pk"
            ></span>
          </span>
        </label>
      </fieldset>
    </div>

    <OnboardingActionFooter
      label="완료"
      @primary="$emit('complete')"
    />
  </section>
</template>
