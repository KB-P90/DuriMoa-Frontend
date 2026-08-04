<script setup lang="ts">
import { Check, TriangleAlert } from '@lucide/vue';
import CoupleRequestCard from '@/components/onboarding/CoupleRequestCard.vue';
import type { OnboardingCoupleRequest } from '@/types/onboarding';

defineProps<{
  acceptingUserIds: number[];
  canConfirm: boolean;
  errorMessage: string;
  feedbackMessage: string;
  hasInviteCodeError: boolean;
  isConnected: boolean;
  isInviting: boolean;
  isLoadingStatus: boolean;
  requests: OnboardingCoupleRequest[];
  statusErrorMessage: string;
}>();

defineEmits<{
  accept: [userId: number];
  confirm: [];
  retryStatus: [];
}>();

const inviteCode = defineModel<string>('inviteCode', { required: true });
</script>

<template>
  <form class="mt-5" aria-label="파트너 초대 코드 확인" @submit.prevent="$emit('confirm')">
    <label class="mb-2 block text-[12px] font-extrabold" for="couple-invite-code">
      상대 코드
    </label>

    <div class="grid grid-cols-[minmax(0,1fr)_64px] gap-2 max-[359px]:grid-cols-[minmax(0,1fr)_56px]">
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
        class="grid h-[52px] place-items-center rounded-[13px] border border-dm-gray/35 bg-dm-gray-light text-[13px] font-extrabold transition enabled:hover:border-btn-pk enabled:hover:bg-dm-cb-light disabled:cursor-not-allowed disabled:text-dm-gray focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-btn-pk/30"
        :disabled="!canConfirm"
      >
        {{ isInviting ? '확인 중' : '확인' }}
      </button>
    </div>

    <p v-if="hasInviteCodeError" id="couple-invite-code-error" class="mt-2 text-[11px] leading-4 text-btn-pk-dark" role="alert">
      영문 대문자와 숫자 6자리로 입력해주세요.
    </p>
    <p v-else-if="errorMessage" id="couple-invite-code-error" class="mt-2 flex items-start gap-1.5 text-[11px] leading-4 text-btn-pk-dark" role="alert">
      <TriangleAlert class="mt-px h-3.5 w-3.5 shrink-0" :stroke-width="2" aria-hidden="true" />
      {{ errorMessage }}
    </p>
    <p v-else id="couple-invite-code-description" class="mt-2 text-[11px] leading-4 text-dm-gray-dark">
      공백 없이 영문 대문자와 숫자 6자리로 입력해주세요.
    </p>
  </form>

  <div class="mt-2 min-h-5" aria-live="polite" aria-atomic="true">
    <p v-if="feedbackMessage" class="flex items-center gap-1 text-[11px] font-medium text-btn-mt-dark">
      <Check class="h-3.5 w-3.5" :stroke-width="2" aria-hidden="true" />
      {{ feedbackMessage }}
    </p>
  </div>

  <div v-if="statusErrorMessage" class="mt-2.5 flex items-center justify-between gap-3 rounded-[13px] border border-btn-pk/30 px-3.5 py-3" role="alert">
    <p class="text-[11px] leading-4 text-btn-pk-dark">
      {{ statusErrorMessage }}
    </p>
    <button
      type="button"
      class="shrink-0 rounded-[9px] px-2.5 py-1.5 text-[11px] font-extrabold text-btn-pk-dark transition hover:bg-dm-cb-light focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-btn-pk/30"
      :disabled="isLoadingStatus"
      @click="$emit('retryStatus')"
    >
      다시
    </button>
  </div>

  <p v-else-if="isLoadingStatus && requests.length === 0" class="mt-2.5 text-center text-[11px] text-dm-gray-dark" role="status">
    연결 상태를 불러오는 중이에요.
  </p>

  <ul v-if="requests.length > 0" class="mt-2.5 flex flex-col gap-2" aria-label="커플 연결 요청 목록">
    <CoupleRequestCard
      v-for="request in requests"
      :key="request.userId"
      :accept-disabled="isConnected || acceptingUserIds.length > 0"
      :is-loading="acceptingUserIds.includes(request.userId)"
      :request="request"
      @accept="$emit('accept', $event)"
    />
  </ul>

  <div v-if="isConnected" class="mt-3 flex items-center gap-2 rounded-[13px] bg-dm-mint-light px-3.5 py-3 text-[12px] font-bold text-btn-mt-dark" role="status">
    <Check class="h-4 w-4" aria-hidden="true" />
    파트너 연결이 완료되었어요.
  </div>

  <p class="mt-3 text-center text-[11px] leading-4 text-dm-gray-dark">
    한 계정은 하나의 커플만 연결할 수 있어요.
  </p>
</template>
