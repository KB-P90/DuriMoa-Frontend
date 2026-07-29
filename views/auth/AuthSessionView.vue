<script setup>
import AuthScreen from '@/components/auth/AuthScreen.vue';
</script>

<template>
  <AuthScreen>
    <!-- 로그인 버튼의 화면 이동을 검토하기 위한 정적 도착 화면 -->
    <section class="flex flex-1 flex-col items-center justify-center px-6 pb-14 text-center">
      <span
        class="text-[46px]"
        aria-hidden="true"
        >💍</span
      >
      <p class="mb-2 mt-5 text-[11px] font-extrabold text-btn-pk-dark">로그인 화면 미리보기</p>
      <!-- TODO: #232631 진한 제목 색상 토큰 등록 검토 -->
      <h1 class="text-2xl font-extrabold leading-[1.45] tracking-[-0.045em] text-[#232631]">
        두리모아에 오신 걸<br />환영해요
      </h1>
      <p class="mt-3 break-keep text-xs leading-6 text-dm-gray-dark">
        현재는 퍼블리싱 단계로 accessToken과 사용자 정보를 저장하지 않습니다.
      </p>
      <RouterLink
        class="mt-8 grid min-h-[50px] w-full place-items-center rounded-xl border border-dm-gray/40 bg-dm-gray-light px-5 text-[15px] font-extrabold text-dm-gray-dark no-underline transition hover:bg-dm-gray/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-btn-pk/30"
        to="/login"
      >
        로그인 화면으로 돌아가기
      </RouterLink>
    </section>
  </AuthScreen>
</template>
