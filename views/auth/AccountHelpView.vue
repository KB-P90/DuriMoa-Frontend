<script setup>
import AuthHeader from '@/components/auth/AuthHeader.vue';
import AuthScreen from '@/components/auth/AuthScreen.vue';
</script>

<template>
  <AuthScreen>
    <AuthHeader
      title="계정 찾기"
      back-to="/login"
    />
    <!-- 백엔드 정책 확정 전 사용하는 계정 찾기 안내 화면 -->
    <section class="flex flex-1 flex-col items-center justify-center px-6 pb-14 text-center">
      <span class="text-[42px]" aria-hidden="true">🔐</span>
      <h2 class="mb-2 mt-4 text-xl font-extrabold text-[#232631]">계정 찾기는 준비 중이에요</h2>
      <p class="break-keep text-xs leading-6 text-[#969ca9]">
        아이디·비밀번호 찾기 상세 화면은<br />
        백엔드 인증 정책이 확정된 뒤 연결할 예정이에요.
      </p>
      <RouterLink
        class="mt-7 grid min-h-[50px] w-full place-items-center rounded-xl bg-btn-pk px-5 text-[15px] font-extrabold text-white no-underline transition hover:bg-btn-pk-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ff898047]"
        to="/login"
      >
        로그인으로 돌아가기
      </RouterLink>
    </section>
  </AuthScreen>
</template>
