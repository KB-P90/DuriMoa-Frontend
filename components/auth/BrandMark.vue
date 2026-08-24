<script setup lang="ts"></script>

<template>
  <div class="text-center cursor-pointer">
    <RouterLink to="/">
      <span
        class="block rotate-[-9deg] text-[34px] leading-none"
        aria-hidden="true"
        >💍</span
      >
      <!-- TODO: #232631 진한 제목 색상 토큰 등록 검토 -->
      <strong class="mt-[13px] block text-[25px] font-black tracking-[-0.055em] text-[#232631]"
        >두리모아</strong
      >
      <p class="mt-2 text-xs leading-[1.55] text-dm-gray-dark">
        결혼 준비에 필요한 만큼만<br />함께 보고 함께 모아요
      </p>
    </RouterLink>
  </div>
</template>
