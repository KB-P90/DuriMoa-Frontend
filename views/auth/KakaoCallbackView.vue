<script setup lang="ts">
import { onMounted } from 'vue';
import AuthScreen from '@/components/auth/AuthScreen.vue';
import BrandMark from '@/components/auth/BrandMark.vue';
import { useKakaoCallback } from '@/composables/useKakaoLogin';

const { callbackError, handleKakaoCallback, isProcessing, returnToLogin } = useKakaoCallback();

onMounted(handleKakaoCallback);
</script>

<template>
  <AuthScreen>
    <section class="flex flex-1 flex-col items-center justify-center px-6 pb-14 text-center">
      <BrandMark class="mb-8" />

      <div
        v-if="!callbackError"
        class="flex flex-col items-center"
        role="status"
        aria-live="polite"
      >
        <span
          class="h-10 w-10 animate-spin rounded-full border-4 border-pink-01 border-t-brand"
          aria-hidden="true"
        ></span>
        <h1 class="mt-5 text-lg font-extrabold text-brand-dark">카카오 로그인 처리 중</h1>
        <p class="mt-2 text-xs leading-6 text-dm-gray-dark">
          {{ isProcessing ? '로그인 정보를 확인하고 있어요.' : '잠시만 기다려주세요.' }}
        </p>
      </div>

      <div
        v-else
        class="flex w-full flex-col items-center"
      >
        <span
          class="grid h-12 w-12 place-items-center rounded-full bg-red-01 text-xl font-black text-red"
          aria-hidden="true"
        >
          !
        </span>
        <h1 class="mt-5 text-lg font-extrabold text-brand-dark">로그인을 완료하지 못했어요</h1>
        <p
          class="mt-2 break-keep text-xs leading-6 text-dm-gray-dark"
          role="alert"
        >
          {{ callbackError }}
        </p>
        <button
          class="mt-7 grid min-h-[50px] w-full place-items-center rounded-xl bg-brand text-sm font-extrabold text-white transition hover:bg-brand-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand/30"
          type="button"
          @click="returnToLogin"
        >
          로그인 화면으로 돌아가기
        </button>
      </div>
    </section>
  </AuthScreen>
</template>
