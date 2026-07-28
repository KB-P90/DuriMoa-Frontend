<script setup>
import AuthHeader from '@/components/auth/AuthHeader.vue';
import AuthScreen from '@/components/auth/AuthScreen.vue';
import TermsAgreementCard from '@/components/auth/TermsAgreementCard.vue';
</script>

<template>
  <AuthScreen>
    <AuthHeader
      title="회원가입"
      back-to="/login"
    />

    <form
      class="flex flex-1 flex-col gap-4 px-5 pt-3 sm:px-10 lg:px-16"
      aria-label="회원가입"
      @submit.prevent
    >
      <!-- 회원 정보 입력 영역: 버튼은 현재 시각 확인용이며 인증 요청은 보내지 않는다. -->
      <div class="flex flex-col gap-3">
        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-[#555b69]"
            for="signup-name"
          >
            이름
          </label>
          <input
            id="signup-name"
            class="h-[46px] w-full rounded-xl border border-[#e8eaf0] bg-white px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-[#bdc1cb] focus:border-btn-pk focus:ring-3 focus:ring-[#ff89801f]"
            type="text"
            autocomplete="name"
            placeholder="이름을 입력해주세요"
          />
        </div>

        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-[#555b69]"
            for="signup-email"
          >
            이메일
            <span
              class="ml-1 rounded-full bg-[#f1f2f5] px-1.5 py-0.5 text-[9px] font-medium text-[#969ba6]"
            >
              로그인 아이디
            </span>
          </label>
          <div class="flex gap-2">
            <input
              id="signup-email"
              class="h-[46px] min-w-0 flex-1 rounded-xl border border-[#e8eaf0] bg-white px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-[#bdc1cb] focus:border-btn-pk focus:ring-3 focus:ring-[#ff89801f]"
              type="email"
              inputmode="email"
              autocomplete="email"
              placeholder="이메일을 입력해주세요"
            />
            <button
              class="h-[46px] shrink-0 rounded-xl border border-[#e8eaf0] bg-white px-4 text-xs font-extrabold text-[#4b505c] hover:bg-gray-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ff898047]"
              type="button"
            >
              중복 확인
            </button>
          </div>
          <p class="mt-1.5 text-[11px] leading-4 text-[#5f9c9b]">✓ 사용 가능한 이메일이에요.</p>
        </div>

        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-[#555b69]"
            for="signup-phone"
          >
            휴대폰 번호
          </label>
          <div class="flex gap-2">
            <input
              id="signup-phone"
              class="h-[46px] min-w-0 flex-1 rounded-xl border border-[#e8eaf0] bg-white px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-[#bdc1cb] focus:border-btn-pk focus:ring-3 focus:ring-[#ff89801f]"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              placeholder="010-0000-0000"
            />
            <button
              class="h-[46px] shrink-0 rounded-xl border border-[#e8eaf0] bg-white px-4 text-xs font-extrabold text-[#4b505c] hover:bg-gray-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ff898047]"
              type="button"
            >
              인증
            </button>
          </div>
          <p class="mt-1.5 text-[11px] leading-4 text-[#969ca9]">휴대폰 번호를 입력한 뒤 인증해주세요.</p>
        </div>

        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-[#555b69]"
            for="signup-password"
          >
            비밀번호
          </label>
          <input
            id="signup-password"
            class="h-[46px] w-full rounded-xl border border-[#e8eaf0] bg-white px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-[#bdc1cb] focus:border-btn-pk focus:ring-3 focus:ring-[#ff89801f]"
            type="password"
            autocomplete="new-password"
            placeholder="비밀번호를 입력해주세요"
          />
          <p class="mt-1.5 text-[11px] leading-4 text-[#969ca9]">
            영문·숫자·특수문자 포함 8자 이상
          </p>
        </div>

        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-[#555b69]"
            for="signup-password-confirmation"
          >
            비밀번호 확인
          </label>
          <input
            id="signup-password-confirmation"
            class="h-[46px] w-full rounded-xl border border-[#e8eaf0] bg-white px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-[#bdc1cb] focus:border-btn-pk focus:ring-3 focus:ring-[#ff89801f]"
            type="password"
            autocomplete="new-password"
            placeholder="비밀번호를 한 번 더 입력해주세요"
          />
        </div>
      </div>

      <!-- 약관 카드와 전문 화면 이동 -->
      <TermsAgreementCard />

      <!-- 모바일에서 항상 접근하기 쉬운 하단 가입 버튼 -->
      <div
        class="sticky bottom-0 -mx-5 mt-auto bg-gradient-to-b from-white/30 via-white to-white px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-3 sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16"
      >
        <RouterLink
          class="grid min-h-[50px] w-full place-items-center rounded-xl bg-btn-pk text-[15px] font-extrabold text-white no-underline transition hover:bg-btn-pk-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ff898047]"
          to="/onboarding"
        >
          가입하고 시작하기
        </RouterLink>
      </div>
    </form>
  </AuthScreen>
</template>
