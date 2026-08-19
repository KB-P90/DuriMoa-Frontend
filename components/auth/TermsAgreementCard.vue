<script setup lang="ts">
import { computed } from 'vue';

defineProps({
  returnTo: {
    type: String,
    default: '/signup',
  },
});

// 백엔드 회원가입 요청에 전달할 약관 동의 상태다.
const serviceAgreed = defineModel<boolean>('serviceTermsAgreed', { default: false });
const privacyAgreed = defineModel<boolean>('privacyTermsAgreed', { default: false });
const marketingAgreed = defineModel<boolean>('marketingTermsAgreed', { default: false });
const notificationAgreed = defineModel<boolean>('notificationAgreed', { default: false });

// 금융정보 연동 동의는 프론트에서 필수로 검증하고 회원가입 DTO에 전달한다.
const financeAgreed = defineModel<boolean>('financeTermsAgreed', { default: false });

// 전체 동의 선택 시 모든 약관을 같은 값으로 변경하고, 개별 상태도 전체 동의에 반영한다.
const allAgreed = computed<boolean>({
  get: () =>
    serviceAgreed.value && privacyAgreed.value && marketingAgreed.value && financeAgreed.value,
  set: (checked) => {
    serviceAgreed.value = checked;
    privacyAgreed.value = checked;
    financeAgreed.value = checked;
    notificationAgreed.value = checked;
  },
});
</script>

<template>
  <fieldset
    class="m-0 min-w-0 rounded-2xl border border-dm-gray/40 bg-dm-gray-light p-3.5 shadow-lg shadow-dm-gray/20"
  >
    <legend class="sr-only">약관 동의</legend>

    <label class="flex cursor-pointer items-center gap-2.5">
      <input
        v-model="allAgreed"
        class="peer sr-only"
        type="checkbox"
        name="agreeAll"
      />
      <span
        class="grid h-[22px] w-[22px] place-items-center rounded-[7px] border border-dm-gray/50 bg-dm-gray-light text-[13px] font-black text-transparent peer-checked:border-pink-03 peer-checked:bg-brand peer-checked:text-dm-gray-light"
        aria-hidden="true"
      >
        ✓
      </span>
      <!-- TODO: #232631 진한 제목 색상 토큰 등록 검토 -->
      <strong class="text-sm font-extrabold text-[#232631]">약관 및 알림 전체 동의</strong>
    </label>

    <div class="my-3 h-px bg-dm-gray/20"></div>

    <!-- 필수: 서비스 이용약관 -->
    <div class="flex min-h-9 items-center justify-between gap-2">
      <label class="flex min-w-0 cursor-pointer items-center gap-2 text-xs text-dm-gray-dark">
        <input
          v-model="serviceAgreed"
          class="peer sr-only"
          type="checkbox"
          name="serviceTermsAgreed"
          required
        />
        <span
          class="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md border border-dm-gray/50 bg-dm-gray-light text-[11px] font-black text-transparent peer-checked:border-pink-03 peer-checked:bg-brand peer-checked:text-dm-gray-light"
          aria-hidden="true"
        >
          ✓
        </span>
        <span>이용약관</span>
        <em
          class="rounded-full bg-pink-01 px-1.5 py-0.5 text-[9px] font-extrabold not-italic text-brand"
        >
          필수
        </em>
      </label>
      <RouterLink
        class="shrink-0 px-1 py-1.5 text-[11px] text-dm-gray-dark no-underline hover:text-brand-dark"
        :to="{ path: '/signup/terms/service', query: { returnTo } }"
        aria-label="이용약관 전문 보기"
      >
        보기
        <span
          class="pl-0.5 text-sm"
          aria-hidden="true"
          >›</span
        >
      </RouterLink>
    </div>

    <!-- 필수: 개인정보 처리방침 -->
    <div class="flex min-h-9 items-center justify-between gap-2">
      <label class="flex min-w-0 cursor-pointer items-center gap-2 text-xs text-dm-gray-dark">
        <input
          v-model="privacyAgreed"
          class="peer sr-only"
          type="checkbox"
          name="privacyTermsAgreed"
          required
        />
        <span
          class="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md border border-dm-gray/50 bg-dm-gray-light text-[11px] font-black text-transparent peer-checked:border-pink-03 peer-checked:bg-brand peer-checked:text-dm-gray-light"
          aria-hidden="true"
        >
          ✓
        </span>
        <span>개인정보 처리방침</span>
        <em
          class="rounded-full bg-pink-01 px-1.5 py-0.5 text-[9px] font-extrabold not-italic text-brand"
        >
          필수
        </em>
      </label>
      <RouterLink
        class="shrink-0 px-1 py-1.5 text-[11px] text-dm-gray-dark no-underline hover:text-brand-dark"
        :to="{ path: '/signup/terms/privacy', query: { returnTo } }"
        aria-label="개인정보 처리방침 전문 보기"
      >
        보기
        <span
          class="pl-0.5 text-sm"
          aria-hidden="true"
          >›</span
        >
      </RouterLink>
    </div>

    <!-- 필수: 금융정보 연동 약관 -->
    <div class="flex min-h-9 items-center justify-between gap-2">
      <label class="flex min-w-0 cursor-pointer items-center gap-2 text-xs text-dm-gray-dark">
        <input
          v-model="financeAgreed"
          class="peer sr-only"
          type="checkbox"
          name="financeTermsAgreed"
          required
        />
        <span
          class="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md border border-dm-gray/50 bg-dm-gray-light text-[11px] font-black text-transparent peer-checked:border-pink-03 peer-checked:bg-brand peer-checked:text-dm-gray-light"
          aria-hidden="true"
        >
          ✓
        </span>
        <span>금융정보 연동 약관</span>
        <em
          class="rounded-full bg-pink-01 px-1.5 py-0.5 text-[9px] font-extrabold not-italic text-brand"
        >
          필수
        </em>
      </label>
      <RouterLink
        class="shrink-0 px-1 py-1.5 text-[11px] text-dm-gray-dark no-underline hover:text-brand-dark"
        :to="{ path: '/signup/terms/finance', query: { returnTo } }"
        aria-label="금융정보 연동 약관 전문 보기"
      >
        보기
        <span
          class="pl-0.5 text-sm"
          aria-hidden="true"
          >›</span
        >
      </RouterLink>
    </div>

    <!-- 선택: 알림 수신 동의 -->
    <div class="flex min-h-9 items-center justify-between gap-2">
      <label class="flex min-w-0 cursor-pointer items-center gap-2 text-xs text-dm-gray-dark">
        <input
          v-model="notificationAgreed"
          class="peer sr-only"
          type="checkbox"
          name="notificationAgreed"
        />
        <span
          class="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md border border-dm-gray/50 bg-dm-gray-light text-[11px] font-black text-transparent peer-checked:border-pink-03 peer-checked:bg-brand peer-checked:text-dm-gray-light"
          aria-hidden="true"
        >
          ✓
        </span>
        <span>알림 수신</span>
        <em
          class="rounded-full bg-pink-01 px-1.5 py-0.5 text-[9px] font-extrabold not-italic text-brand"
        >
          필수
        </em>
      </label>
      <RouterLink
        class="shrink-0 px-1 py-1.5 text-[11px] text-dm-gray-dark no-underline hover:text-brand-dark"
        :to="{ path: '/signup/terms/notification', query: { returnTo } }"
        aria-label="알림 수신 안내 보기"
      >
        보기
        <span
          class="pl-0.5 text-sm"
          aria-hidden="true"
          >›</span
        >
      </RouterLink>
    </div>

    <!-- 선택: 알림 수신 동의 -->
    <div class="flex min-h-9 items-center justify-between gap-2">
      <label class="flex min-w-0 cursor-pointer items-center gap-2 text-xs text-dm-gray-dark">
        <input
          v-model="notificationAgreed"
          class="peer sr-only"
          type="checkbox"
          name="notificationAgreed"
        />
        <span
          class="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md border border-dm-gray/50 bg-dm-gray-light text-[11px] font-black text-transparent peer-checked:border-pink-03 peer-checked:bg-brand peer-checked:text-dm-gray-light"
          aria-hidden="true"
        >
          ✓
        </span>
        <span>알림 수신</span>
        <em
          class="rounded-full bg-dm-gray/20 px-1.5 py-0.5 text-[9px] font-extrabold not-italic text-dm-gray-dark"
        >
          선택
        </em>
      </label>
      <RouterLink
        class="shrink-0 px-1 py-1.5 text-[11px] text-dm-gray-dark no-underline hover:text-brand-dark"
        :to="{ path: '/signup/terms/notification', query: { returnTo } }"
        aria-label="알림 수신 안내 보기"
      >
        보기
        <span
          class="pl-0.5 text-sm"
          aria-hidden="true"
          >›</span
        >
      </RouterLink>
    </div>
  </fieldset>
</template>
