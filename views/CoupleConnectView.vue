<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft } from '@lucide/vue';
import CoupleConnectionForm from '@/components/common/CoupleConnectionForm.vue';
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
  errorMessage,
  feedbackMessage,
  hasInviteCodeError,
  inviteCode,
  isConnected,
  isInviting,
  isLoadingStatus,
  loadCoupleStatus,
  requests,
  statusErrorMessage,
} = useMyInfoCouple(isActive);
</script>

<template>
  <div class="couple-stage relative aspect-[390/560] w-full md:aspect-auto md:min-h-[560px]">
    <section
      class="absolute inset-0 origin-top-left h-[560px] w-[390px] overflow-hidden rounded-[30px] bg-white font-[Pretendard,Inter,sans-serif] text-[#292934] shadow-[0_20px_50px_-18px_rgba(34,34,43,0.28),0_0_0_1px_rgba(34,34,43,0.06)] scale-[var(--couple-scale)] md:relative md:h-auto md:min-h-[560px] md:w-full md:scale-100 md:overflow-visible md:rounded-none md:shadow-none"
    >
      <header class="flex h-[50px] items-center gap-3 border-b border-[#F5F5F9] px-5">
        <button
          type="button"
          aria-label="뒤로가기"
          class="grid h-6 w-6 place-items-center"
          @click="router.back()"
        >
          <ArrowLeft
            class="h-[17px] w-[17px]"
            :stroke-width="2"
          />
        </button>
        <h1 class="text-[15px] font-extrabold leading-[18px]">상대 연결</h1>
      </header>

      <main class="px-5 pb-5 pt-4">
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
          :has-invite-code-error="hasInviteCodeError"
          :is-connected="isConnected"
          :is-inviting="isInviting"
          :is-loading-status="isLoadingStatus"
          :requests="requests"
          :status-error-message="statusErrorMessage"
          @accept="acceptRequest"
          @confirm="confirmInviteCode"
          @retry-status="loadCoupleStatus"
        />

        <button
          type="button"
          class="mt-5 h-[52px] w-full rounded-[12px] bg-btn-pk text-[14px] font-extrabold text-white shadow-[0_6px_14px_rgba(255,143,132,0.24)] disabled:bg-dm-gray"
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
