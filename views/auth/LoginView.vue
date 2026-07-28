<script setup>
import AuthScreen from '@/components/auth/AuthScreen.vue';
import BrandMark from '@/components/auth/BrandMark.vue';
</script>

<template>
  <AuthScreen>
    <div class="flex min-h-full flex-1 flex-col px-5 pb-8 pt-10 sm:px-10 sm:pt-14 lg:px-16">
      <!-- 서비스 로고와 소개 문구 -->
      <BrandMark class="mb-8" />

      <!-- 퍼블리싱용 로그인 입력 영역: 실제 검증과 전송은 API 연결 단계에서 구현한다. -->
      <form
        class="flex w-full flex-col gap-4"
        aria-label="로그인"
        @submit.prevent
      >
        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-[#555b69]"
            for="login-email"
          >
            이메일
          </label>
          <input
            id="login-email"
            class="h-[46px] w-full rounded-xl border border-[#e8eaf0] bg-white px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-[#bdc1cb] hover:border-[#d9dce4] focus:border-btn-pk focus:ring-3 focus:ring-[#ff89801f]"
            type="email"
            inputmode="email"
            autocomplete="username"
            placeholder="minjun.kim@email.com"
          />
        </div>

        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-[#555b69]"
            for="login-password"
          >
            비밀번호
          </label>
          <input
            id="login-password"
            class="h-[46px] w-full rounded-xl border border-[#e8eaf0] bg-white px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-[#bdc1cb] hover:border-[#d9dce4] focus:border-btn-pk focus:ring-3 focus:ring-[#ff89801f]"
            type="password"
            autocomplete="current-password"
            placeholder="비밀번호를 입력해주세요"
          />
        </div>

        <RouterLink
          class="mt-0.5 grid min-h-[50px] w-full place-items-center rounded-xl bg-btn-pk text-[15px] font-extrabold text-white no-underline transition hover:bg-btn-pk-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ff898047]"
          to="/auth/session"
        >
          로그인
        </RouterLink>
      </form>

      <!-- 일반 로그인과 소셜 로그인을 구분하는 영역 -->
      <div class="my-5 flex items-center gap-3" aria-hidden="true">
        <span class="h-px flex-1 bg-[#f0f1f4]"></span>
        <span class="text-[11px] text-[#a3a7b0]">또는</span>
        <span class="h-px flex-1 bg-[#f0f1f4]"></span>
      </div>

      <RouterLink
        class="mx-auto grid h-[51px] w-[51px] place-items-center rounded-full bg-[#fee500] text-[#2d271d] transition hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ff898047]"
        to="/auth/session"
        aria-label="카카오 계정으로 계속하기"
      >
        <svg
          class="w-6 fill-current"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 4C6.8 4 3 7.1 3 10.9c0 2.5 1.7 4.7 4.3 5.9l-.9 3.1c-.1.3.2.5.5.3l3.8-2.5c.4.1.9.1 1.3.1 5.2 0 9-3.1 9-6.9S17.2 4 12 4Z"
          />
        </svg>
      </RouterLink>
      <p class="mt-2 text-center text-[10px] text-[#9b9faa]">카카오 계정으로 계속하기</p>

      <!-- 회원가입 및 계정 찾기 화면 이동 -->
      <nav
        class="mt-5 flex items-center justify-center gap-3 text-[11px] font-semibold text-[#7f8490]"
        aria-label="회원 계정 메뉴"
      >
        <RouterLink
          class="rounded px-1 py-1 no-underline hover:text-btn-pk-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-btn-pk"
          to="/signup"
        >
          회원가입
        </RouterLink>
        <span class="text-[#d1d3d9]" aria-hidden="true">·</span>
        <RouterLink
          class="rounded px-1 py-1 no-underline hover:text-btn-pk-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-btn-pk"
          to="/account-help"
        >
          계정을 잊으셨나요?
        </RouterLink>
      </nav>
    </div>
  </AuthScreen>
</template>
