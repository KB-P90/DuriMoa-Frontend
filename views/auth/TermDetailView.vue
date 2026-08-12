<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AuthHeader from '@/components/auth/AuthHeader.vue';
import AuthScreen from '@/components/auth/AuthScreen.vue';

const route = useRoute();
const ALLOWED_RETURN_PATHS = new Set(['/signup', '/auth/kakao/signup']);
const backTo = computed(() => {
  const returnTo = Array.isArray(route.query.returnTo)
    ? route.query.returnTo[0]
    : route.query.returnTo;
  return typeof returnTo === 'string' && ALLOWED_RETURN_PATHS.has(returnTo)
    ? returnTo
    : '/signup';
});

// 라우터가 전달한 정적 약관 데이터만 화면에 출력한다.
defineProps({
  title: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    required: true,
  },
  sections: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <AuthScreen>
    <AuthHeader
      :title="title"
      :back-to="backTo"
    />

    <article class="px-5 pb-8 pt-4 text-dm-gray-dark sm:px-10 lg:px-16">
      <!-- 약관명과 시행일 요약 카드 -->
      <section
        class="flex items-center gap-3.5 rounded-[18px] border border-dm-gray/40 bg-dm-gray-light p-5 shadow-lg shadow-dm-gray/20"
      >
        <span
          class="grid h-[50px] w-[50px] shrink-0 place-items-center rounded-full bg-pink-01 text-brand"
          aria-hidden="true"
        >
          <svg
            class="h-6 w-6 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"
            viewBox="0 0 24 24"
          >
            <path d="M7 3h7l4 4v14H7z" />
            <path d="M14 3v5h5M10 12h5M10 16h5" />
          </svg>
        </span>
        <div>
          <!-- TODO: #232631 진한 제목 색상 토큰 등록 검토 -->
          <h2 class="mb-1.5 text-base font-extrabold text-[#232631]">{{ title }}</h2>
          <p class="text-[11px] leading-5 text-dm-gray-dark">시행일자 2026.07.01</p>
          <p class="text-[11px] leading-5 text-dm-gray-dark">최종 업데이트 2026.07.01</p>
        </div>
      </section>

      <p
        class="mt-6 rounded-xl bg-dm-gray/10 px-3.5 py-3 text-[11px] leading-[1.65] text-dm-gray-dark"
      >
        {{ intro }}
      </p>

      <!-- 약관 조항은 전달받은 순서대로 반복 출력한다. -->
      <section
        v-for="section in sections"
        :key="section.heading"
        class="border-b border-dm-gray/30 py-5"
      >
        <!-- TODO: #232631 진한 제목 색상 토큰 등록 검토 -->
        <h2 class="mb-3.5 text-sm font-extrabold tracking-[-0.02em] text-[#232631]">
          {{ section.heading }}
        </h2>
        <p
          v-for="paragraph in section.paragraphs"
          :key="paragraph"
          class="mt-2 break-keep text-xs leading-7 text-dm-gray-dark"
        >
          {{ paragraph }}
        </p>
      </section>
    </article>
  </AuthScreen>
</template>
