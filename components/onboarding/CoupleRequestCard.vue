<script setup lang="ts">
import { UserRound } from '@lucide/vue';
import { computed } from 'vue';
import type { OnboardingCoupleRequest } from '@/types/onboarding';

// 연결 요청 정보와 다른 파트너 연결 후의 비활성화 상태다.
const props = withDefaults(
  defineProps<{
    acceptDisabled?: boolean;
    request: OnboardingCoupleRequest;
  }>(),
  {
    acceptDisabled: false,
  }
);

// 수락할 사용자 식별자를 상위 화면에 전달한다.
const emit = defineEmits<{ accept: [userId: number] }>();

// 역할이 없는 상태 응답은 보낸 요청과 받은 요청으로 구분해 표시한다.
const roleLabel = computed(() => {
  if (props.request.role === 'B') {
    return '신부';
  }

  if (props.request.role === 'G') {
    return '신랑';
  }

  return props.request.status === 'WAIT' ? '보낸 요청' : '받은 요청';
});

// 요청 상태에 따라 버튼 문구를 결정한다.
const statusLabel = computed(() => {
  if (props.request.status === 'WAIT') {
    return '연결 대기';
  }

  if (props.request.status === 'CONNECTED') {
    return '연결 완료';
  }

  return '수락';
});

// 아직 연결되지 않은 받은 요청만 수락한다.
function handleAccept() {
  if (props.acceptDisabled || props.request.status !== 'REQUESTED') {
    return;
  }

  emit('accept', props.request.userId);
}
</script>

<template>
  <li
    class="flex min-w-0 items-center gap-3 rounded-[16px] border border-btn-pk/45 bg-dm-cb-light px-3.5 py-3 shadow-sm"
  >
    <span
      class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-dm-gray-light text-btn-pk-dark"
      aria-hidden="true"
    >
      <UserRound
        class="h-5 w-5"
        :stroke-width="1.8"
      />
    </span>

    <span class="min-w-0 flex-1">
      <strong class="block truncate text-[14px] font-extrabold">
        {{ request.name }}
      </strong>
      <span class="mt-0.5 block text-[11px] text-dm-gray-dark">
        {{ roleLabel }}
      </span>
    </span>

    <button
      type="button"
      class="shrink-0 rounded-full bg-dm-rose px-3 py-1.5 text-[11px] font-extrabold text-btn-pk-dark transition enabled:hover:bg-dm-rose-dark disabled:cursor-default disabled:opacity-80 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-btn-pk/30"
      :disabled="acceptDisabled || request.status !== 'REQUESTED'"
      :aria-label="`${request.name}님의 연결 요청 ${statusLabel}`"
      @click="handleAccept"
    >
      {{ statusLabel }}
    </button>
  </li>
</template>
