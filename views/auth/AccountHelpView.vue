<script setup lang="ts">
import AuthHeader from '@/components/auth/AuthHeader.vue';
import AuthScreen from '@/components/auth/AuthScreen.vue';
import { AUTH_ROUTE_NAMES } from '@/constants/auth';
</script>

<template>
  <AuthScreen>
    <AuthHeader
      title="계정 찾기"
      @back="$router.back()"
    />
    <section class="account-help">
      <span aria-hidden="true">🔐</span>
      <h2>계정 찾기는 준비 중이에요</h2>
      <p>아이디·비밀번호 찾기 상세 기능은 백엔드 인증 정책이 확정된 뒤 제공할 예정이에요.</p>
      <RouterLink
        class="auth-primary-button"
        :to="{ name: AUTH_ROUTE_NAMES.LOGIN }"
      >
        로그인으로 돌아가기
      </RouterLink>
    </section>
  </AuthScreen>
</template>

<style scoped>
.account-help {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px 52px;
  text-align: center;
}

.account-help > span {
  font-size: 42px;
}

.account-help h2 {
  margin: 18px 0 8px;
  color: var(--auth-ink);
  font-size: 19px;
}

.account-help p {
  max-width: 290px;
  margin: 0;
  color: var(--auth-muted);
  font-size: 12px;
  line-height: 1.65;
  word-break: keep-all;
}

.account-help a {
  margin-top: 28px;
  text-decoration: none;
}
</style>
