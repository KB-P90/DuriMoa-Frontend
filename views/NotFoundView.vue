<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';

const router = useRouter();
</script>

<template>
  <div
    class="mx-auto flex h-dvh w-full max-w-[768px] flex-col items-center justify-center gap-6 px-6 text-center"
  >
    <img
      src="/404.png"
      alt="페이지를 찾을 수 없어요"
      class="h-auto w-full max-w-[280px] object-contain"
    />
    <div class="flex flex-col gap-1.5">
      <h1 class="text-lg font-extrabold text-[#232631]">페이지를 찾을 수 없어요</h1>
      <p class="text-sm text-dm-gray-dark">주소가 잘못되었거나 삭제된 페이지예요.</p>
    </div>
    <Button
      type="button"
      class="h-[52px] w-full max-w-[280px] rounded-xl bg-brand text-[15px] font-extrabold text-dm-gray-light shadow-none hover:bg-brand-dark"
      @click="router.push({ name: 'home' })"
    >
      홈으로 가기
    </Button>
  </div>
</template>
