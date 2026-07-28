<script setup>
import AuthScreen from '@/components/auth/AuthScreen.vue';
</script>

<template>
  <AuthScreen>
    <!-- 가입 버튼의 화면 이동을 검토하기 위한 정적 도착 화면 -->
    <section class="flex flex-1 flex-col items-center justify-center px-6 pb-14 text-center">
      <span class="text-[46px]" aria-hidden="true">🎉</span>
      <p class="mb-2 mt-5 text-[11px] font-extrabold text-btn-pk-dark">회원가입 화면 미리보기</p>
      <h1 class="text-[25px] font-extrabold leading-[1.45] tracking-[-0.05em] text-[#232631]">
        두 사람의 결혼 준비를<br />시작해볼까요?
      </h1>
      <small class="mt-3 text-[11px] leading-6 text-[#969ca9]">
        현재는 퍼블리싱 단계로 화면 이동만 확인할 수 있어요.
      </small>
      <RouterLink
        class="mt-8 grid min-h-[50px] w-full place-items-center rounded-xl bg-btn-pk px-5 text-[15px] font-extrabold text-white no-underline transition hover:bg-btn-pk-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ff898047]"
        to="/login"
      >
        로그인 화면으로 돌아가기
      </RouterLink>
    </section>
  </AuthScreen>
</template>
