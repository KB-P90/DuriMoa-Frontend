<script setup>
import AuthScreen from '@/components/auth/AuthScreen.vue';
import BrandMark from '@/components/auth/BrandMark.vue';
</script>

<template>
  <AuthScreen>
    <div class="flex min-h-full flex-1 flex-col px-5 pb-8 pt-10 sm:px-10 sm:pt-14 lg:px-16">
      <!-- 서비스 로고와 소개 문구 -->
      <BrandMark class="mb-8" />

      <!--
        퍼블리싱용 로그인 입력 영역
        연동 시 POST /api/auth/login에 phone, password를 전달한다.
      -->
      <!-- TODO: #232631 진한 입력 글자 색상 토큰 등록 검토 -->
      <form
        class="flex w-full flex-col gap-4"
        aria-label="로그인"
        data-endpoint="/api/auth/login"
        @submit.prevent
      >
        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-dm-gray-dark"
            for="login-phone"
          >
            휴대폰 번호
          </label>
          <!-- 연동 시 하이픈을 제거한 뒤 phone 값으로 전송한다. -->
          <input
            id="login-phone"
            class="h-[46px] w-full rounded-xl border border-dm-gray/40 bg-dm-gray-light px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-dm-gray hover:border-dm-gray/60 focus:border-btn-pk focus:ring-3 focus:ring-btn-pk/10"
            type="tel"
            name="phone"
            inputmode="numeric"
            autocomplete="username"
            placeholder="010-1234-5678"
            pattern="01[016789]-?[0-9]{3,4}-?[0-9]{4}"
            required
          />
          <p class="mt-1.5 text-[11px] leading-4 text-dm-gray-dark">
            하이픈 포함 여부와 관계없이 입력할 수 있어요.
          </p>
        </div>

        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-dm-gray-dark"
            for="login-password"
          >
            비밀번호
          </label>
          <input
            id="login-password"
            class="h-[46px] w-full rounded-xl border border-dm-gray/40 bg-dm-gray-light px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-dm-gray hover:border-dm-gray/60 focus:border-btn-pk focus:ring-3 focus:ring-btn-pk/10"
            type="password"
            name="password"
            autocomplete="current-password"
            placeholder="비밀번호를 입력해주세요"
            minlength="8"
            maxlength="72"
            required
          />
          <p class="mt-1.5 text-[11px] leading-4 text-dm-gray-dark">
            비밀번호는 8자 이상 72자 이하로 입력해주세요.
          </p>
        </div>

        <!-- 실패 응답의 ApiResponse.message는 입력 영역 아래 오류 문구로 표시한다. -->
        <!-- 연동 시 성공 응답의 data.accessToken과 data.user를 인증 상태에 저장한다. -->
        <RouterLink
          class="mt-0.5 grid min-h-[50px] w-full place-items-center rounded-xl bg-btn-pk text-[15px] font-extrabold text-dm-gray-light no-underline transition hover:bg-btn-pk-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-btn-pk/30"
          to="/auth/session"
        >
          로그인
        </RouterLink>
      </form>

      <!-- 일반 로그인과 소셜 로그인을 구분하는 영역 -->
      <div
        class="my-5 flex items-center gap-3"
        aria-hidden="true"
      >
        <span class="h-px flex-1 bg-dm-gray/20"></span>
        <span class="text-[11px] text-dm-gray-dark">또는</span>
        <span class="h-px flex-1 bg-dm-gray/20"></span>
      </div>

      <!-- XML 계약에 카카오 endpoint가 없어 현재는 기존 퍼블리싱 링크만 유지한다. -->
      <!-- TODO: #fee500, #2d271d 카카오 브랜드 색상 토큰 등록 검토 -->
      <RouterLink
        class="mx-auto grid h-[51px] w-[51px] place-items-center rounded-full bg-[#fee500] text-[#2d271d] transition hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-btn-pk/30"
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
      <p class="mt-2 text-center text-[10px] text-dm-gray-dark">카카오 계정으로 계속하기</p>

      <!-- 회원가입 및 계정 찾기 화면 이동 -->
      <nav
        class="mt-5 flex items-center justify-center gap-3 text-[11px] font-semibold text-dm-gray-dark"
        aria-label="회원 계정 메뉴"
      >
        <RouterLink
          class="rounded px-1 py-1 no-underline hover:text-btn-pk-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-btn-pk"
          to="/signup"
        >
          회원가입
        </RouterLink>
        <span
          class="text-dm-gray/70"
          aria-hidden="true"
          >·</span
        >
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
