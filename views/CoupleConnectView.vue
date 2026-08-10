<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CoupleConnectionForm from '@/components/common/CoupleConnectionForm.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useMyInfoCouple } from '@/composables/useMyInfoCouple';

useAuthCheck();

const router = useRouter();
const isActive = ref(true);

const {
  acceptRequest,
  acceptingUserIds,
  canConfirm,
  confirmInviteCode,
  copyMyInviteCode,
  errorMessage,
  feedbackMessage,
  hasMyInviteCodeCopyError,
  hasInviteCodeError,
  inviteCode,
  isConnected,
  isInviting,
  isLoadingMyInviteCode,
  isLoadingStatus,
  loadCoupleStatus,
  loadMyInviteCode,
  myInviteCode,
  myInviteCodeCopyMessage,
  myInviteCodeErrorMessage,
  requests,
  statusErrorMessage,
} = useMyInfoCouple(isActive);
</script>

<template>
  <div class="couple-stage relative aspect-[390/560] w-full md:aspect-auto md:min-h-[560px]">
    <section
      class="absolute inset-0 origin-top-left h-[560px] w-[390px] overflow-hidden rounded-[30px] bg-white text-[#292934] shadow-[0_20px_50px_-18px_rgba(34,34,43,0.28),0_0_0_1px_rgba(34,34,43,0.06)] scale-[var(--couple-scale)] md:relative md:h-auto md:min-h-[560px] md:w-full md:scale-100 md:overflow-visible md:rounded-none md:shadow-none"
    >
      <PageHeader title="상대 연결" />

      <main class="p-4">
        <h2 class="text-[21px] font-extrabold leading-tight">파트너를 연결해주세요</h2>
        <p class="mt-1.5 text-[12px] leading-5 text-dm-gray-dark">
          초대 코드로 두 사람의 공동 공간을 만들어요
        </p>

        <CoupleConnectionForm
          v-model:invite-code="inviteCode"
          :accepting-user-ids="acceptingUserIds"
          :can-confirm="canConfirm"
          :error-message="errorMessage"
          :feedback-message="feedbackMessage"
          :has-my-invite-code-copy-error="hasMyInviteCodeCopyError"
          :has-invite-code-error="hasInviteCodeError"
          :is-connected="isConnected"
          :is-inviting="isInviting"
          :is-loading-my-invite-code="isLoadingMyInviteCode"
          :is-loading-status="isLoadingStatus"
          :my-invite-code="myInviteCode"
          :my-invite-code-copy-message="myInviteCodeCopyMessage"
          :my-invite-code-error-message="myInviteCodeErrorMessage"
          :requests="requests"
          :status-error-message="statusErrorMessage"
          @accept="acceptRequest"
          @confirm="confirmInviteCode"
          @copy-my-invite-code="copyMyInviteCode"
          @retry-my-invite-code="loadMyInviteCode"
          @retry-status="loadCoupleStatus"
        />

        <button
          type="button"
          class="mt-5 h-[52px] w-full rounded-[12px] bg-brand text-[14px] font-extrabold text-white shadow-[0_6px_14px_rgba(255,143,132,0.24)] disabled:bg-dm-gray"
          :disabled="isInviting || isLoadingStatus || acceptingUserIds.length > 0"
          @click="router.back()"
        >
          완료
        </button>
      </main>
    </section>
  </div>
</template>

<style scoped>
.couple-stage {
  container-type: inline-size;
  --couple-scale: calc(100cqw / 390px);
}
</style>
