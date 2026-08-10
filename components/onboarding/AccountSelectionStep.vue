<script setup lang="ts">
import { Check, CreditCard, Landmark } from '@lucide/vue';
import OnboardingActionFooter from '@/components/onboarding/OnboardingActionFooter.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';
import type { OnboardingAccount } from '@/types/onboarding';

// 조회된 계좌·카드 목록과 API 저장 상태를 표시한다.
defineProps<{
  accounts: readonly OnboardingAccount[];
  bank: string;
  canContinue: boolean;
  cardCompany: string;
  cards: readonly OnboardingAccount[];
  errorMessage: string;
  isLoading: boolean;
  selectedAccountNumbers: string[];
  selectedCardNumbers: string[];
}>();

// 이전·다음 이동, 계좌·카드 선택 변경과 온보딩 건너뛰기를 상위 화면에 요청한다.
defineEmits<{
  back: [];
  next: [];
  skip: [];
  toggle: [accountNumber: string];
  toggleCard: [cardNumber: string];
}>();
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <OnboardingProgress
      :current-step="2"
      :total-steps="2"
      @back="$emit('back')"
    />

    <div
      class="min-h-0 flex-1 overflow-y-auto scrollbar-none overscroll-y-contain px-4 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[359px]:px-3 sm:px-5"
    >
      <h1 class="text-[21px] font-extrabold tracking-[-0.055em] min-[360px]:text-[23px]">
        사용할 계좌와 카드를 선택해주세요
      </h1>
      <p class="mt-1.5 text-[12px] leading-5 text-dm-gray-dark">
        계좌나 카드 중 하나 이상 선택하면 연결할 수 있어요
      </p>

      <h2 class="mt-5 text-[12px] font-extrabold text-dm-gray-dark">
        본 서비스에서 사용할 계좌를 선택해주세요.
      </h2>

      <div
        class="mt-3 flex h-[52px] items-center gap-3 rounded-[13px] border border-dm-gray/35 px-4"
      >
        <Landmark
          class="h-5 w-5 text-brand"
          :stroke-width="1.8"
          aria-hidden="true"
        />
        <strong class="text-[14px]">{{ bank }}</strong>
      </div>

      <fieldset
        v-if="accounts.length > 0"
        class="mt-3 overflow-hidden rounded-[14px] border border-brand-dark/55"
      >
        <legend class="sr-only">연결할 계좌 선택</legend>
        <label
          v-for="(account, index) in accounts"
          :key="account.accountNumber"
          class="flex min-h-[58px] items-center gap-3 px-4 transition"
          :class="[
            { 'border-t border-dm-gray/20': index > 0 },
            account.isRegistered
              ? 'cursor-not-allowed bg-disable text-dm-gray-dark'
              : isLoading
                ? 'cursor-not-allowed bg-dm-gray-light'
                : 'cursor-pointer bg-background hover:bg-dm-gray-light',
          ]"
        >
          <input
            class="peer sr-only"
            type="checkbox"
            :checked="selectedAccountNumbers.includes(account.accountNumber)"
            :disabled="isLoading || account.isRegistered"
            @change="$emit('toggle', account.accountNumber)"
          />
          <span class="min-w-0 flex-1">
            <strong class="block truncate text-[13px] font-extrabold">
              {{ account.accountDisplay }}
            </strong>
            <span class="mt-0.5 block truncate text-[10px] text-dm-gray-dark">
              {{ account.accountName }}
            </span>
          </span>
          <span
            v-if="account.isRegistered"
            class="shrink-0 text-[11px] font-bold text-dm-gray-dark"
          >
            연결됨
          </span>
          <span
            v-else
            class="grid h-[20px] w-[20px] shrink-0 place-items-center rounded-[6px] border transition"
            :class="
              selectedAccountNumbers.includes(account.accountNumber)
                ? 'border-brand bg-brand text-dm-gray-light'
                : 'border-dm-gray/35 bg-background'
            "
            aria-hidden="true"
          >
            <Check
              v-if="selectedAccountNumbers.includes(account.accountNumber)"
              class="h-3.5 w-3.5"
              :stroke-width="3"
            />
          </span>
        </label>
      </fieldset>

      <p
        v-else
        class="mt-3 rounded-[13px] border border-dm-gray/25 px-4 py-4 text-center text-[12px] text-dm-gray-dark"
      >
        조회된 계좌가 없어요. 계좌를 추가하려면 이전 화면에서 연결해주세요.
      </p>

      <h2 class="mt-7 text-[12px] font-extrabold text-dm-gray-dark">
        본 서비스에서 사용할 카드를 선택해주세요.
      </h2>

      <div
        class="mt-3 flex h-[52px] items-center gap-3 rounded-[13px] border border-dm-gray/35 px-4"
      >
        <CreditCard
          class="h-5 w-5 text-brand"
          :stroke-width="1.8"
          aria-hidden="true"
        />
        <strong class="text-[14px]">{{ cardCompany }}</strong>
      </div>

      <fieldset
        v-if="cards.length > 0"
        class="mt-3 overflow-hidden rounded-[14px] border border-brand-dark/55"
      >
        <legend class="sr-only">연결할 카드 선택</legend>
        <label
          v-for="(card, index) in cards"
          :key="card.accountNumber"
          class="flex min-h-[58px] items-center gap-3 px-4 transition"
          :class="[
            { 'border-t border-dm-gray/20': index > 0 },
            card.isRegistered
              ? 'cursor-not-allowed bg-disable text-dm-gray-dark'
              : isLoading
                ? 'cursor-not-allowed bg-dm-gray-light'
                : 'cursor-pointer bg-background hover:bg-dm-gray-light',
          ]"
        >
          <input
            class="peer sr-only"
            type="checkbox"
            :checked="selectedCardNumbers.includes(card.accountNumber)"
            :disabled="isLoading || card.isRegistered"
            @change="$emit('toggleCard', card.accountNumber)"
          />
          <span class="min-w-0 flex-1">
            <strong class="block truncate text-[13px] font-extrabold">
              {{ card.accountDisplay }}
            </strong>
            <span class="mt-0.5 block truncate text-[10px] text-dm-gray-dark">
              {{ card.accountName }}
            </span>
          </span>
          <span
            v-if="card.isRegistered"
            class="shrink-0 text-[11px] font-bold text-dm-gray-dark"
          >
            연결됨
          </span>
          <span
            v-else
            class="grid h-[20px] w-[20px] shrink-0 place-items-center rounded-[6px] border transition"
            :class="
              selectedCardNumbers.includes(card.accountNumber)
                ? 'border-brand bg-brand text-dm-gray-light'
                : 'border-dm-gray/35 bg-background'
            "
            aria-hidden="true"
          >
            <Check
              v-if="selectedCardNumbers.includes(card.accountNumber)"
              class="h-3.5 w-3.5"
              :stroke-width="3"
            />
          </span>
        </label>
      </fieldset>

      <p
        v-else
        class="mt-3 rounded-[13px] border border-dm-gray/25 px-4 py-4 text-center text-[12px] text-dm-gray-dark"
      >
        조회된 카드가 없어요. 카드를 추가하려면 이전 화면에서 연결해주세요.
      </p>

      <p
        v-if="errorMessage"
        class="mt-3 text-[11px] leading-4 text-brand-dark"
        role="alert"
      >
        {{ errorMessage }}
      </p>
    </div>

    <OnboardingActionFooter
      :label="isLoading ? '자산 저장하는 중...' : '계좌·카드 선택하기'"
      secondary-label="다음에 하기"
      :disabled="!canContinue || isLoading"
      :secondary-disabled="isLoading"
      @primary="$emit('next')"
      @secondary="$emit('skip')"
    />
  </section>
</template>
