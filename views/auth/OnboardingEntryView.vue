<script setup lang="ts">
import AuthScreen from '@/components/auth/AuthScreen.vue';
import { AUTH_ROUTE_NAMES } from '@/constants/auth';
</script>

<template>
  <AuthScreen>
    <section class="onboarding-entry">
      <span aria-hidden="true">🎉</span>
      <p>회원가입 완료</p>
      <h1>두 사람의 결혼 준비를<br />시작해볼까요?</h1>
      <small>온보딩 화면은 별도 구현 범위로 연결 지점만 준비했어요.</small>
      <RouterLink
        class="auth-primary-button"
        :to="{ name: AUTH_ROUTE_NAMES.SESSION }"
      >
        인증 상태 확인하기
      </RouterLink>
    </section>
  </AuthScreen>
</template>

<style scoped>
.onboarding-entry {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 24px 54px;
  text-align: center;
}

.onboarding-entry > span {
  font-size: 46px;
}

.onboarding-entry > p {
  margin: 19px 0 7px;
  color: var(--auth-primary-pressed);
  font-size: 11px;
  font-weight: 850;
}

.onboarding-entry h1 {
  margin: 0;
  color: var(--auth-ink);
  font-size: 25px;
  line-height: 1.45;
  letter-spacing: -0.05em;
}

.onboarding-entry small {
  margin-top: 12px;
  color: var(--auth-muted);
  font-size: 11px;
  line-height: 1.6;
}

.onboarding-entry a {
  margin-top: 30px;
  text-decoration: none;
}
</style>
