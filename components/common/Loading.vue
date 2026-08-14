<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: '처리 중이에요',
  }
);
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-center bg-white/90 px-6 backdrop-blur-[2px]"
    role="status"
    aria-live="polite"
    aria-atomic="true"
    aria-busy="true"
  >
    <div class="flex flex-col items-center text-center">
      <DotLottieVue
        class="h-[300px] w-[300px] max-w-full"
        autoplay
        loop
        src="https://lottie.host/4d6ce807-1329-4176-9e94-ed594d02f863/jLfeJo5rvF.lottie"
        aria-hidden="true"
      />
      <p class="-mt-6 text-sm font-extrabold text-foreground">{{ label }}</p>
    </div>
  </div>
</template>
