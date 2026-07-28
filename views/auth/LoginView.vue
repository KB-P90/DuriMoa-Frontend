<script setup lang="ts">
import AuthScreen from '@/components/auth/AuthScreen.vue';
import BrandMark from '@/components/auth/BrandMark.vue';
import LoadingButton from '@/components/auth/LoadingButton.vue';
import { AUTH_DEMO, AUTH_ROUTE_NAMES } from '@/constants/auth';
import { useLoginForm } from '@/composables/useLoginForm';

const {
  email,
  password,
  emailTouched,
  passwordTouched,
  isSubmitting,
  errorMessage,
  canSubmit,
  emailError,
  passwordError,
  submit,
  startKakaoLogin,
} = useLoginForm();

// 서버 구현 전 화면 흐름을 확인하는 개발 모드인지 나타낸다.
const isDemoMode = import.meta.env.VITE_AUTH_MODE === 'demo';
</script>

<template>
  <AuthScreen scrollable>
    <form
      class="login-view"
      novalidate
      @submit.prevent="submit"
    >
      <BrandMark class="login-view__brand" />

      <div class="login-view__fields">
        <div>
          <label
            class="auth-label"
            for="login-email"
            >이메일</label
          >
          <input
            id="login-email"
            v-model="email"
            class="auth-input"
            type="email"
            inputmode="email"
            autocomplete="username"
            placeholder="minjun.kim@email.com"
            :aria-invalid="Boolean(emailError)"
            :aria-describedby="emailError ? 'login-email-error' : undefined"
            @blur="emailTouched = true"
          />
          <p
            v-if="emailError"
            id="login-email-error"
            class="auth-field-message auth-field-message--error"
            role="alert"
          >
            {{ emailError }}
          </p>
        </div>

        <div>
          <label
            class="auth-label"
            for="login-password"
            >비밀번호</label
          >
          <input
            id="login-password"
            v-model="password"
            class="auth-input"
            type="password"
            autocomplete="current-password"
            placeholder="비밀번호를 입력해주세요"
            :aria-invalid="Boolean(passwordError)"
            :aria-describedby="passwordError ? 'login-password-error' : undefined"
            @blur="passwordTouched = true"
          />
          <p
            v-if="passwordError"
            id="login-password-error"
            class="auth-field-message auth-field-message--error"
            role="alert"
          >
            {{ passwordError }}
          </p>
        </div>
      </div>

      <p
        v-if="errorMessage"
        class="auth-form-error"
        role="alert"
      >
        {{ errorMessage }}
      </p>

      <LoadingButton
        class="login-view__submit"
        type="submit"
        :loading="isSubmitting"
        :disabled="!canSubmit"
      >
        로그인
      </LoadingButton>

      <div class="login-view__divider">
        <span></span>
        <em>또는</em>
        <span></span>
      </div>

      <button
        class="login-view__kakao"
        type="button"
        aria-label="카카오로 로그인"
        @click="startKakaoLogin"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 4C6.8 4 3 7.1 3 10.9c0 2.5 1.7 4.7 4.3 5.9l-.9 3.1c-.1.3.2.5.5.3l3.8-2.5c.4.1.9.1 1.3.1 5.2 0 9-3.1 9-6.9S17.2 4 12 4Z"
          />
        </svg>
      </button>
      <p class="login-view__social-caption">카카오 계정으로 계속하기</p>

      <nav
        class="login-view__links"
        aria-label="회원 계정 메뉴"
      >
        <RouterLink :to="{ name: AUTH_ROUTE_NAMES.SIGN_UP }">회원가입</RouterLink>
        <span aria-hidden="true">·</span>
        <RouterLink :to="{ name: AUTH_ROUTE_NAMES.ACCOUNT_HELP }">계정을 잊으셨나요?</RouterLink>
      </nav>

      <details
        v-if="isDemoMode"
        class="login-view__demo"
      >
        <summary>데모 계정 보기</summary>
        <p>{{ AUTH_DEMO.EMAIL }} / {{ AUTH_DEMO.PASSWORD }}</p>
      </details>
    </form>
  </AuthScreen>
</template>

<style scoped>
.login-view {
  display: flex;
  min-height: 100%;
  flex: 1;
  flex-direction: column;
  padding: clamp(28px, 5dvh, 43px) clamp(20px, 5vw, 40px) 26px;
}

.login-view__brand {
  margin-bottom: clamp(24px, 4dvh, 32px);
}

.login-view__fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.login-view__submit {
  margin-top: 18px;
}

.login-view__divider {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 21px 0 17px;
}

.login-view__divider span {
  height: 1px;
  flex: 1;
  background: #f0f1f4;
}

.login-view__divider em {
  color: #a3a7b0;
  font-size: 11px;
  font-style: normal;
}

.login-view__kakao {
  display: grid;
  width: 51px;
  height: 51px;
  margin: 0 auto;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: var(--auth-kakao);
  color: #2d271d;
  cursor: pointer;
}

.login-view__kakao:hover {
  filter: brightness(0.98);
}

.login-view__kakao svg {
  width: 25px;
  fill: currentColor;
}

.login-view__social-caption {
  margin: 9px 0 0;
  color: #9b9faa;
  font-size: 10px;
  text-align: center;
}

.login-view__links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  margin-top: 25px;
}

.login-view__links a {
  padding: 5px 1px;
  color: #7f8490;
  font-size: 11px;
  font-weight: 650;
  text-decoration: none;
}

.login-view__links a:hover {
  color: var(--auth-primary-pressed);
}

.login-view__links span {
  color: #d1d3d9;
  font-size: 11px;
}

.login-view__demo {
  margin-top: auto;
  padding-top: 16px;
  color: #a2a6af;
  font-size: 10px;
  text-align: center;
}

.login-view__demo summary {
  cursor: pointer;
}

.login-view__demo p {
  margin: 5px 0 0;
  font-variant-numeric: tabular-nums;
}
</style>
