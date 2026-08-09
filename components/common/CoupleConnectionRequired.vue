<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function goCoupleConnect() {
  router.push({ name: 'myinfo-couple-connect' });
}
</script>

<template>
  <div
    class="flex h-full min-h-[500px] w-full flex-col items-center justify-center bg-white px-6 text-center"
  >
    <span class="text-[11px] font-extrabold tracking-[0.14em] text-brand-dark">
      NOT CONNECTED
    </span>
    <h2 class="mt-2 text-[19px] font-extrabold leading-[24px] text-[#292934]">
      둘이 함께할 준비가 필요해요
    </h2>
    <p class="mt-2 text-[12.5px] leading-[18px] text-dm-gray-dark">
      커플을 연결하면 모든 서비스를 사용할 수 있어요.
    </p>

    <button
      type="button"
      class="mt-6 flex h-[52px] w-full max-w-[340px] items-center justify-center gap-1.5 rounded-2xl bg-brand text-[14px] font-extrabold text-white shadow-[0_10px_20px_-8px_rgba(255,110,112,0.45)]"
      @click="goCoupleConnect"
    >
      연결하러 가기
      <ArrowRight
        class="h-4 w-4"
        :stroke-width="2.2"
      />
    </button>
  </div>
</template>
