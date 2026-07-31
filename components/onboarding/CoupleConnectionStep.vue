<script setup lang="ts">
import { Check, TriangleAlert } from '@lucide/vue';
import CoupleRequestCard from '@/components/onboarding/CoupleRequestCard.vue';
import OnboardingActionFooter from '@/components/onboarding/OnboardingActionFooter.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';
import { useOnboardingCouplePublishing } from '@/composables/useOnboardingCouplePublishing';

// 이전·다음 단계 이동과 온보딩 건너뛰기 이벤트다.
defineEmits<{ back: []; next: []; skip: [] }>();

// 입력값과 연결 상태에 따라 한 화면을 변경하는 상태와 동작이다.
const {
  acceptRequest,
  canConfirm,
  confirmInviteCode,
  errorMessage,
  feedbackMessage,
  hasInviteCodeError,
  inviteCode,
  isConnected,
  requests,
} = useOnboardingCouplePublishing();
</script>

<template>
  <section class="relative flex min-h-0 flex-1 flex-col overflow-hidden">
    <OnboardingProgress
      :current-step="3"
      @back="$emit('back')"
    />

    <div
      class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[359px]:px-3 sm:px-5"
    >
      <h1
        class="text-[21px] font-extrabold leading-tight tracking-[-0.055em] min-[360px]:text-[23px]"
      >
        파트너를 연결해주세요
      </h1>
      <p class="mt-1.5 text-[12px] leading-5 text-dm-gray-dark">
        초대 코드로 두 사람의 공동 공간을 만들어요
      </p>

      <form
        class="mt-5"
        aria-label="파트너 초대 코드 확인"
        @submit.prevent="confirmInviteCode"
      >
        <label
          class="mb-2 block text-[12px] font-extrabold"
          for="couple-invite-code"
        >
          상대 코드
        </label>

        <div
          class="grid grid-cols-[minmax(0,1fr)_64px] gap-2 max-[359px]:grid-cols-[minmax(0,1fr)_56px]"
        >
          <input
            id="couple-invite-code"
            v-model="inviteCode"
            class="h-[52px] min-w-0 rounded-[13px] border bg-dm-gray-light px-4 font-mono text-[14px] font-extrabold uppercase tracking-[0.12em] outline-none transition placeholder:font-sans placeholder:text-[12px] placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-dm-gray"
            :class="
              hasInviteCodeError || errorMessage
                ? 'border-btn-pk-dark focus:ring-3 focus:ring-btn-pk/15'
                : 'border-dm-gray/35 focus:border-btn-pk focus:ring-3 focus:ring-btn-pk/10'
            "
            name="inviteCode"
            type="text"
            inputmode="text"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            pattern="[A-Z0-9]+"
            placeholder="SEOYEON4444"
            :aria-invalid="hasInviteCodeError || errorMessage.length > 0"
            :aria-describedby="
              hasInviteCodeError || errorMessage
                ? 'couple-invite-code-error'
                : 'couple-invite-code-description'
            "
          />

          <button
            type="submit"
            class="grid h-[52px] place-items-center rounded-[13px] border border-dm-gray/35 bg-dm-gray-light text-[13px] font-extrabold transition enabled:hover:border-btn-pk enabled:hover:bg-dm-cb-light disabled:cursor-not-allowed disabled:text-dm-gray focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-btn-pk/30"
            :disabled="!canConfirm"
          >
            확인
          </button>
        </div>

        <p
          v-if="hasInviteCodeError"
          id="couple-invite-code-error"
          class="mt-2 text-[11px] leading-4 text-btn-pk-dark"
          role="alert"
        >
          영문 대문자와 숫자만 입력해주세요.
        </p>
        <p
          v-else-if="errorMessage"
          id="couple-invite-code-error"
          class="mt-2 flex items-start gap-1.5 text-[11px] leading-4 text-btn-pk-dark"
          role="alert"
        >
          <TriangleAlert
            class="mt-px h-3.5 w-3.5 shrink-0"
            :stroke-width="2"
            aria-hidden="true"
          />
          {{ errorMessage }}
        </p>
        <p
          v-else
          id="couple-invite-code-description"
          class="mt-2 text-[11px] leading-4 text-dm-gray-dark"
        >
          공백 없이 영문 대문자와 숫자로 입력해주세요.
        </p>
      </form>

      <div
        class="mt-2 min-h-5"
        aria-live="polite"
        aria-atomic="true"
      >
        <p
          v-if="feedbackMessage"
          class="flex items-center gap-1 text-[11px] font-medium text-btn-mt-dark"
        >
          <Check
            class="h-3.5 w-3.5"
            :stroke-width="2"
            aria-hidden="true"
          />
          {{ feedbackMessage }}
        </p>
      </div>

      <ul
        v-if="requests.length > 0"
        class="mt-2.5 flex flex-col gap-2"
        aria-label="커플 연결 요청 목록"
      >
        <CoupleRequestCard
          v-for="request in requests"
          :key="request.userId"
          :accept-disabled="isConnected"
          :request="request"
          @accept="acceptRequest"
        />
      </ul>

      <div
        v-if="isConnected"
        class="mt-3 flex items-center gap-2 rounded-[13px] bg-dm-mint-light px-3.5 py-3 text-[12px] font-bold text-btn-mt-dark"
        role="status"
      >
        <Check
          class="h-4 w-4"
          aria-hidden="true"
        />
        파트너 연결이 완료되었어요.
      </div>

      <button
        type="button"
        class="mt-4 h-[52px] w-full rounded-[13px] border border-dm-gray/35 bg-dm-gray-light text-[13px] font-bold text-dm-gray-dark shadow-sm transition hover:bg-dm-gray/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-btn-pk/30"
        @click="$emit('skip')"
      >
        나중에 연결할게요
      </button>

      <p class="mt-3 text-center text-[11px] leading-4 text-dm-gray-dark">
        한 계정은 하나의 커플만 연결할 수 있어요
      </p>
    </div>

    <OnboardingActionFooter
      label="다음"
      @primary="$emit('next')"
    />
  </section>
</template>
