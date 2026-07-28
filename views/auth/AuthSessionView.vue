<script setup lang="ts">
import AuthScreen from '@/components/auth/AuthScreen.vue';
import LoadingButton from '@/components/auth/LoadingButton.vue';
import { useAuthSession } from '@/composables/useAuthSession';

const { session, isSubmitting, logout } = useAuthSession();
</script>

<template>
  <AuthScreen>
    <section class="session-view">
      <span
        class="session-view__mark"
        aria-hidden="true"
        >💍</span
      >
      <p class="session-view__eyebrow">로그인 완료</p>
      <h1>{{ session?.member.name }}님,<br />두리모아에 오신 걸 환영해요</h1>
      <p class="session-view__copy">
        홈 화면 API가 연결되기 전까지 인증 상태와 로그아웃 흐름을 확인하는 임시 진입 화면이에요.
      </p>
      <LoadingButton
        class="session-view__logout"
        :loading="isSubmitting"
        @click="logout"
      >
        로그아웃
      </LoadingButton>
    </section>
  </AuthScreen>
</template>

<style scoped>
.session-view {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 25px 52px;
  text-align: center;
}

.session-view__mark {
  font-size: 46px;
}

.session-view__eyebrow {
  margin: 20px 0 7px;
  color: var(--auth-primary-pressed);
  font-size: 11px;
  font-weight: 850;
}

.session-view h1 {
  margin: 0;
  color: var(--auth-ink);
  font-size: 24px;
  line-height: 1.45;
  letter-spacing: -0.045em;
}

.session-view__copy {
  max-width: 285px;
  margin: 13px 0 0;
  color: var(--auth-muted);
  font-size: 12px;
  line-height: 1.65;
  word-break: keep-all;
}

.session-view__logout {
  margin-top: 31px;
}
</style>
