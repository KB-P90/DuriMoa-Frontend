<script setup lang="ts">
import { Check, Copy, TriangleAlert } from '@lucide/vue';
import CoupleRequestCard from '@/components/onboarding/CoupleRequestCard.vue';
import type { OnboardingCoupleRequest } from '@/types/onboarding';

defineProps<{
  acceptingUserIds: number[];
  canConfirm: boolean;
  errorMessage: string;
  feedbackMessage: string;
  hasMyInviteCodeCopyError: boolean;
  hasInviteCodeError: boolean;
  isConnected: boolean;
  isInviting: boolean;
  isLoadingMyInviteCode: boolean;
  isLoadingStatus: boolean;
  myInviteCode: string;
  myInviteCodeCopyMessage: string;
  myInviteCodeErrorMessage: string;
  requests: OnboardingCoupleRequest[];
  statusErrorMessage: string;
  useWhiteInput?: boolean;
}>();

defineEmits<{
  accept: [userId: number];
  confirm: [];
  copyMyInviteCode: [];
  retryMyInviteCode: [];
  retryStatus: [];
}>();

const inviteCode = defineModel<string>('inviteCode', { required: true });
</script>

<template>
  <section
    class="mt-5"
    aria-labelledby="my-invite-code-label"
  >
    <h2
      id="my-invite-code-label"
      class="mb-2 text-[12px] font-extrabold"
    >
      내 코드
    </h2>

    <div
      class="grid grid-cols-[minmax(0,1fr)_64px] gap-2 max-[359px]:grid-cols-[minmax(0,1fr)_56px]"
    >
      <output
        class="flex h-[52px] min-w-0 items-center rounded-[13px] border border-dm-gray/35 bg-dm-gray-light px-4 font-mono text-[14px] font-extrabold tracking-[0.12em]"
        aria-live="polite"
      >
        <span
          v-if="isLoadingMyInviteCode"
          class="font-sans text-[12px] font-medium tracking-normal text-dm-gray-dark"
        >
          불러오는 중...
        </span>
        <span v-else-if="myInviteCode">{{ myInviteCode }}</span>
        <span
          v-else
          class="font-sans text-[12px] font-medium tracking-normal text-dm-gray"
        >
          코드를 불러올 수 없어요
        </span>
      </output>

      <button
        type="button"
        class="flex h-[52px] items-center justify-center gap-1 rounded-[13px] border border-dm-gray/35 bg-dm-gray-light text-[12px] font-extrabold transition enabled:hover:border-pink-03 enabled:hover:bg-pink-01 disabled:cursor-not-allowed disabled:text-dm-gray focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand/30 cursor-pointer"
        :disabled="isLoadingMyInviteCode || !myInviteCode"
        aria-label="내 초대 코드 복사"
        @click="$emit('copyMyInviteCode')"
      >
        <Copy
          class="h-3.5 w-3.5"
          :stroke-width="1.8"
          aria-hidden="true"
        />
        복사
      </button>
    </div>

    <div
      v-if="myInviteCodeErrorMessage"
      class="mt-2 flex items-start justify-between gap-3"
      role="alert"
    >
      <p class="flex items-start gap-1.5 text-[11px] leading-4 text-brand-dark">
        <TriangleAlert
          class="mt-px h-3.5 w-3.5 shrink-0"
          :stroke-width="2"
          aria-hidden="true"
        />
        {{ myInviteCodeErrorMessage }}
      </p>
      <button
        type="button"
        class="shrink-0 text-[11px] font-extrabold text-brand-dark underline underline-offset-2 disabled:text-dm-gray"
        :disabled="isLoadingMyInviteCode"
        @click="$emit('retryMyInviteCode')"
      >
        다시
      </button>
    </div>
    <p
      v-else-if="myInviteCodeCopyMessage"
      class="mt-2 flex items-center gap-1 text-[11px] leading-4"
      :class="hasMyInviteCodeCopyError ? 'text-brand-dark' : 'text-btn-mt-dark'"
      :role="hasMyInviteCodeCopyError ? 'alert' : 'status'"
    >
      <Check
        v-if="!hasMyInviteCodeCopyError"
        class="h-3.5 w-3.5"
        :stroke-width="2"
        aria-hidden="true"
      />
      <TriangleAlert
        v-else
        class="h-3.5 w-3.5"
        :stroke-width="2"
        aria-hidden="true"
      />
      {{ myInviteCodeCopyMessage }}
    </p>
    <p
      v-else
      class="mt-2 text-[11px] leading-4 text-dm-gray-dark"
    >
      상대에게 내 코드를 공유해주세요.
    </p>
  </section>

  <form
    class="mt-5"
    aria-label="상대 초대 코드 확인"
    @submit.prevent="$emit('confirm')"
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
        class="h-[52px] min-w-0 rounded-[13px] border px-4 font-mono text-[14px] font-extrabold uppercase tracking-[0.12em] text-black outline-none transition placeholder:font-sans placeholder:text-[12px] placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-dm-gray"
        :class="[
          useWhiteInput ? 'bg-white' : 'bg-dm-gray-light',
          hasInviteCodeError || errorMessage
            ? 'border-pink-03-dark focus:ring-3 focus:ring-brand/15'
            : 'border-dm-gray/35 focus:border-pink-03 focus:ring-3 focus:ring-brand/10',
        ]"
        name="inviteCode"
        type="text"
        inputmode="text"
        autocomplete="off"
        autocapitalize="characters"
        spellcheck="false"
        pattern="[A-Z0-9]{6}"
        maxlength="6"
        placeholder="ABC123"
        :disabled="isInviting"
        :aria-invalid="hasInviteCodeError || errorMessage.length > 0"
        :aria-describedby="
          hasInviteCodeError || errorMessage
            ? 'couple-invite-code-error'
            : 'couple-invite-code-description'
        "
      />

      <button
        type="submit"
        class="grid h-[52px] place-items-center rounded-[13px] border border-dm-gray/35 bg-dm-gray-light text-[13px] font-extrabold text-black transition enabled:hover:border-pink-03 enabled:hover:bg-pink-01 disabled:cursor-not-allowed focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand/30 cursor-pointer"
        :disabled="!canConfirm"
      >
        {{ isInviting ? '확인 중' : '확인' }}
      </button>
    </div>

    <p
      v-if="hasInviteCodeError"
      id="couple-invite-code-error"
      class="mt-2 text-[11px] leading-4 text-brand-dark"
      role="alert"
    >
      영문 대문자와 숫자 6자리로 입력해주세요.
    </p>
    <p
      v-else-if="errorMessage"
      id="couple-invite-code-error"
      class="mt-2 flex items-start gap-1.5 text-[11px] leading-4 text-brand-dark"
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
      공백 없이 영문 대문자와 숫자 6자리로 입력해주세요.
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

  <div
    v-if="statusErrorMessage"
    class="mt-2.5 flex items-center justify-between gap-3 rounded-[13px] border border-pink-03/30 px-3.5 py-3"
    role="alert"
  >
    <p class="text-[11px] leading-4 text-brand-dark">
      {{ statusErrorMessage }}
    </p>
    <button
      type="button"
      class="shrink-0 rounded-[9px] px-2.5 py-1.5 text-[11px] font-extrabold text-brand-dark transition hover:bg-pink-01 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand/30 cursor-pointer"
      :disabled="isLoadingStatus"
      @click="$emit('retryStatus')"
    >
      다시
    </button>
  </div>

  <p
    v-else-if="isLoadingStatus && requests.length === 0"
    class="mt-2.5 text-center text-[11px] text-dm-gray-dark"
    role="status"
  >
    연결 상태를 불러오는 중이에요.
  </p>

  <ul
    v-if="requests.length > 0"
    class="mt-2.5 flex flex-col gap-2"
    aria-label="커플 연결 요청 목록"
  >
    <CoupleRequestCard
      v-for="request in requests"
      :key="request.userId"
      :accept-disabled="isConnected || acceptingUserIds.length > 0"
      :is-loading="acceptingUserIds.includes(request.userId)"
      :request="request"
      @accept="$emit('accept', $event)"
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
    상대 연결이 완료되었어요.
  </div>

  <p class="mt-3 text-center text-[11px] leading-4 text-dm-gray-dark">
    한 계정은 하나의 커플만 연결할 수 있어요.
  </p>
</template>
