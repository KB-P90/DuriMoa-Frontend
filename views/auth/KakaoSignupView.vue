<script setup lang="ts">
import { onMounted } from 'vue';
import AuthHeader from '@/components/auth/AuthHeader.vue';
import AuthScreen from '@/components/auth/AuthScreen.vue';
import TermsAgreementCard from '@/components/auth/TermsAgreementCard.vue';
import { useKakaoSignup } from '@/composables/useKakaoLogin';

const {
  canSubmit,
  isSubmitting,
  marketingTermsAgreed,
  name,
  privacyTermsAgreed,
  profileImage,
  role,
  serviceTermsAgreed,
  signupError,
  submitKakaoSignup,
  validateSignupSession,
} = useKakaoSignup();

onMounted(validateSignupSession);
</script>

<template>
  <AuthScreen>
    <AuthHeader
      title="추가정보 입력"
      back-to="/login"
    />

    <form
      class="flex flex-1 flex-col gap-5 bg-white px-5 pb-6 pt-5 sm:px-10 lg:px-16"
      aria-label="카카오 회원가입 추가정보"
      data-endpoint="/api/auth/kakao/signup"
      @submit.prevent="submitKakaoSignup"
    >
      <section class="flex items-center gap-3 rounded-2xl bg-dm-gray-light p-4">
        <img
          v-if="profileImage"
          class="h-14 w-14 rounded-full object-cover"
          :src="profileImage"
          :alt="`${name} 프로필 사진`"
        />
        <span
          v-else
          class="grid h-14 w-14 place-items-center rounded-full bg-pink-01 text-lg font-extrabold text-brand"
          aria-hidden="true"
        >
          {{ name.slice(0, 1) }}
        </span>
        <div class="min-w-0">
          <p class="text-[11px] font-bold text-dm-gray-dark">카카오 계정</p>
          <h1 class="mt-1 truncate text-base font-extrabold text-gray-900">{{ name }}</h1>
        </div>
      </section>

      <fieldset>
        <legend class="mb-2 text-sm font-extrabold text-dm-gray-dark">역할을 선택해주세요</legend>
        <div class="grid grid-cols-2 gap-2">
          <label class="cursor-pointer">
            <input
              v-model="role"
              class="peer sr-only"
              type="radio"
              name="role"
              value="G"
              required
            />
            <span
              class="grid h-[50px] place-items-center rounded-xl border border-dm-gray/40 bg-dm-gray-light text-sm font-bold text-dm-gray-dark transition peer-checked:border-dm-mint-dark peer-checked:bg-dm-mint-light peer-checked:text-btn-mt-dark"
            >
              신랑
            </span>
          </label>
          <label class="cursor-pointer">
            <input
              v-model="role"
              class="peer sr-only"
              type="radio"
              name="role"
              value="B"
            />
            <span
              class="grid h-[50px] place-items-center rounded-xl border border-dm-gray/40 bg-dm-gray-light text-sm font-bold text-dm-gray-dark transition peer-checked:border-pink-03 peer-checked:bg-pink-01 peer-checked:text-brand-dark"
            >
              신부
            </span>
          </label>
        </div>
      </fieldset>

      <TermsAgreementCard
        v-model:marketing-terms-agreed="marketingTermsAgreed"
        v-model:privacy-terms-agreed="privacyTermsAgreed"
        v-model:service-terms-agreed="serviceTermsAgreed"
        return-to="/auth/kakao/signup"
      />

      <div class="mt-auto pt-2">
        <p
          v-if="signupError"
          class="mb-2 text-xs font-semibold text-brand-dark"
          role="alert"
          aria-live="polite"
        >
          {{ signupError }}
        </p>
        <button
          class="grid min-h-[50px] w-full place-items-center rounded-xl bg-brand text-[15px] font-extrabold text-white transition hover:bg-brand-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand/30 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          :disabled="!canSubmit"
        >
          {{ isSubmitting ? '가입 처리 중...' : '동의하고 시작하기' }}
        </button>
      </div>
    </form>
  </AuthScreen>
</template>
