<script setup lang="ts">
import { Landmark } from '@lucide/vue';
import OnboardingActionFooter from '@/components/onboarding/OnboardingActionFooter.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';
import type { PublishingAccount } from '@/types/onboarding';

// 조회된 계좌 목록과 현재 선택 상태를 표시한다.
defineProps<{
  accounts: readonly PublishingAccount[];
  bank: string;
  canContinue: boolean;
  selectedAccountIds: number[];
}>();

// 이전·다음 단계 이동과 계좌 선택 변경을 상위 화면에 요청한다.
defineEmits<{
  back: [];
  next: [];
  toggle: [accountId: number];
}>();
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <OnboardingProgress
      :current-step="2"
      @back="$emit('back')"
    />

    <div
      class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[359px]:px-3 sm:px-5"
    >
      <h1 class="text-[21px] font-extrabold tracking-[-0.055em] min-[360px]:text-[23px]">
        사용할 계좌를 선택해주세요
      </h1>
      <p class="mt-1.5 text-[12px] leading-5 text-dm-gray-dark">
        두리모아에서 함께 관리할 계좌만 선택할 수 있어요
      </p>

      <div
        class="mt-5 flex h-[52px] items-center gap-3 rounded-[13px] border border-dm-gray/35 px-4"
      >
        <Landmark
          class="h-5 w-5 text-btn-pk"
          :stroke-width="1.8"
          aria-hidden="true"
        />
        <strong class="text-[14px]">{{ bank }}</strong>
      </div>

      <fieldset class="mt-3 overflow-hidden rounded-[14px] border border-dm-rose-dark/55">
        <legend class="sr-only">연결할 계좌 선택</legend>
        <label
          v-for="(account, index) in accounts"
          :key="account.accountId"
          class="flex min-h-[58px] cursor-pointer items-center gap-3 px-4 transition hover:bg-dm-cb-light"
          :class="{ 'border-t border-dm-gray/20': index > 0 }"
        >
          <input
            class="peer sr-only"
            type="checkbox"
            :checked="selectedAccountIds.includes(account.accountId)"
            @change="$emit('toggle', account.accountId)"
          />
          <span class="min-w-0 flex-1">
            <strong class="block truncate text-[13px] font-extrabold">
              {{ account.accountNumber }}
            </strong>
            <span class="mt-0.5 block truncate text-[10px] text-dm-gray-dark">
              {{ account.accountName }}
            </span>
          </span>
          <span
            class="grid h-[20px] w-[20px] shrink-0 place-items-center rounded-[6px] border border-dm-gray/35 bg-dm-gray-light text-[12px] font-bold text-transparent transition peer-checked:border-btn-pk peer-checked:bg-btn-pk peer-checked:text-dm-gray-light"
            aria-hidden="true"
          >
            ✓
          </span>
        </label>
      </fieldset>
    </div>

    <OnboardingActionFooter
      label="계좌 선택하기"
      :disabled="!canContinue"
      @primary="$emit('next')"
    />
  </section>
</template>
