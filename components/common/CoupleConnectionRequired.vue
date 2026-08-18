<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = withDefaults(
  defineProps<{
    message?: string;
    eyebrow?: string;
    title?: string;
    description?: string;
    routeName?: string;
    routeQuery?: Record<string, string>;
    buttonMessage?: string;
  }>(),
  {
    message: '커플을 연결하면',
    eyebrow: 'NOT CONNECTED',
    title: '둘이 함께할 준비가 필요해요',
    description: '',
    routeName: 'myinfo-couple-connect',
    routeQuery: () => ({}),
    buttonMessage: '연결하러 가기',
  }
);

function goCoupleConnect() {
  router.push({ name: props.routeName, query: props.routeQuery });
}
</script>

<template>
  <div
    class="flex h-full min-h-[500px] w-full flex-col items-center justify-center bg-white px-6 text-center"
  >
    <span class="text-[11px] font-extrabold tracking-[0.14em] text-brand-dark">
      {{ eyebrow }}
    </span>
    <h2 class="mt-2 text-[19px] font-extrabold leading-[24px] text-[#292934]">
      {{ title }}
    </h2>
    <p class="mt-2 break-keep text-[12.5px] leading-[18px] text-dm-gray-dark">
      {{ description || `${props.message} 모든 서비스를 사용할 수 있어요.` }}
    </p>

    <button
      type="button"
      class="mt-6 flex h-[52px] w-full max-w-[340px] items-center justify-center gap-1.5 rounded-2xl bg-brand text-[14px] font-extrabold text-white shadow-[0_10px_20px_-8px_rgba(255,110,112,0.45)] cursor-pointer"
      @click="goCoupleConnect"
    >
      {{ buttonMessage }}
      <ArrowRight
        class="h-4 w-4"
        :stroke-width="2.2"
      />
    </button>
  </div>
</template>
