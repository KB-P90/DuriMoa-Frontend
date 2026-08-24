<script setup lang="ts">
import AuthScreen from '@/components/auth/AuthScreen.vue';
import BrandMark from '@/components/auth/BrandMark.vue';
import { useKakaoAuthorization } from '@/composables/useKakaoLogin';
import { useLogin } from '@/composables/useLogin';

const { phone, password, loginError, isSubmitting, submitLogin } = useLogin();
const { authorizationError, startKakaoLogin } = useKakaoAuthorization();
</script>

<template>
  <AuthScreen>
    <div
      class="flex min-h-full bg-white flex-1 flex-col px-5 pb-8 pt-10 sm:px-10 sm:pt-14 lg:px-16"
    >
      <!-- 서비스 로고와 소개 문구 -->
      <BrandMark class="mb-8" />

      <!-- TODO: #232631 진한 입력 글자 색상 토큰 등록 검토 -->
      <form
        class="flex w-full flex-col gap-4"
        aria-label="로그인"
        data-endpoint="/api/auth/login"
        @submit.prevent="submitLogin"
      >
        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-dm-gray-dark"
            for="login-phone"
          >
            휴대폰 번호
          </label>
          <!-- 하이픈 정규화와 인증 판단은 백엔드에서 처리한다. -->
          <input
            id="login-phone"
            v-model="phone"
            class="h-[46px] w-full rounded-xl border border-dm-gray/40 bg-white px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-dm-gray hover:border-dm-gray/60 focus:border-pink-03 focus:ring-3 focus:ring-brand/10"
            type="tel"
            name="phone"
            inputmode="numeric"
            autocomplete="username"
            placeholder="010-1234-5678"
            pattern="01[016789]-?[0-9]{3,4}-?[0-9]{4}"
            :aria-invalid="Boolean(loginError)"
            :aria-describedby="loginError ? 'login-error' : undefined"
            required
          />
          <p class="mt-1.5 text-[11px] leading-4 text-dm-gray-dark">
            하이픈 포함 여부와 관계없이 입력할 수 있어요.
          </p>
        </div>

        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-dm-gray-dark"
            for="login-password"
          >
            비밀번호
          </label>
          <input
            id="login-password"
            v-model="password"
            class="h-[46px] w-full rounded-xl border border-dm-gray/40 bg-white px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-dm-gray hover:border-dm-gray/60 focus:border-pink-03 focus:ring-3 focus:ring-brand/10"
            type="password"
            name="password"
            autocomplete="current-password"
            placeholder="비밀번호를 입력해주세요"
            minlength="8"
            maxlength="72"
            :aria-invalid="Boolean(loginError)"
            :aria-describedby="loginError ? 'login-error' : undefined"
            required
          />
          <p class="mt-1.5 text-[11px] leading-4 text-dm-gray-dark">
            비밀번호는 8자 이상 72자 이하로 입력해주세요.
          </p>
        </div>

        <p
          v-if="loginError"
          id="login-error"
          class="-mt-1 text-xs font-semibold text-brand-dark"
          role="alert"
          aria-live="polite"
        >
          {{ loginError }}
        </p>

        <button
          class="mt-0.5 grid min-h-[50px] w-full place-items-center rounded-xl bg-brand text-[15px] font-extrabold text-dm-gray-light transition hover:bg-brand-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand/30 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          type="submit"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <!-- TODO: 카카오 브랜드 색상 #FEE500 공통 토큰 등록 검토 -->
      <button
        class="mt-3 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl border-0 bg-[#FEE500] p-0 transition hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand/30 cursor-pointer"
        type="button"
        aria-label="카카오 계정으로 계속하기"
        @click="startKakaoLogin"
      >
        <svg
          class="h-5 w-5 shrink-0 fill-black"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 3C6.48 3 2 6.48 2 10.77c0 2.73 1.82 5.14 4.56 6.52L5.4 21.53c-.1.38.33.68.65.45l5.07-3.35c.29.03.58.04.88.04 5.52 0 10-3.48 10-7.9C22 6.48 17.52 3 12 3Z"
          />
        </svg>
        <span class="text-[15px] font-extrabold leading-none text-black/[0.85]">
          카카오 로그인
        </span>
      </button>
      <p
        v-if="authorizationError"
        class="mt-2 text-center text-xs font-semibold text-brand-dark"
        role="alert"
      >
        {{ authorizationError }}
      </p>

      <!-- 회원가입 및 계정 찾기 화면 이동 -->
      <nav
        class="mt-5 flex items-center justify-center gap-3 text-[11px] font-semibold text-dm-gray-dark"
        aria-label="회원 계정 메뉴"
      >
        <RouterLink
          class="rounded px-1 py-1 no-underline hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          to="/signup"
        >
          회원가입
        </RouterLink>
        <span
          class="text-dm-gray/70"
          aria-hidden="true"
          >·</span
        >
        <RouterLink
          class="rounded px-1 py-1 no-underline hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          to="/account-help"
        >
          계정을 잊으셨나요?
        </RouterLink>
      </nav>
    </div>
  </AuthScreen>
</template>
