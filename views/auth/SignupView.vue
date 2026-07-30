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
      data-endpoint="/api/auth/signup"
      @submit.prevent
    >
      <!--
        회원 정보 입력 영역
        연동 시 POST /api/auth/signup에 name, phone, role, password, passwordConfirm을 전달한다.
      -->
      <!-- TODO: #232631 진한 입력 글자 색상 토큰 등록 검토 -->
      <div class="flex flex-col gap-3">
        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-dm-gray-dark"
            for="signup-name"
          >
            이름
          </label>
          <input
            id="signup-name"
            class="h-[46px] w-full rounded-xl border border-dm-gray/40 bg-dm-gray-light px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-dm-gray focus:border-btn-pk focus:ring-3 focus:ring-btn-pk/10"
            type="text"
            name="name"
            autocomplete="name"
            placeholder="이름을 입력해주세요"
            maxlength="50"
            required
          />
        </div>

        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-dm-gray-dark"
            for="signup-phone"
          >
            휴대폰 번호
            <span
              class="ml-1 rounded-full bg-dm-gray/20 px-1.5 py-0.5 text-[9px] font-medium text-dm-gray-dark"
            >
              로그인 아이디
            </span>
          </label>
          <!-- 연동 시 하이픈을 제거한 뒤 phone 값으로 전송한다. -->
          <input
            id="signup-phone"
            class="h-[46px] w-full rounded-xl border border-dm-gray/40 bg-dm-gray-light px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-dm-gray focus:border-btn-pk focus:ring-3 focus:ring-btn-pk/10"
            type="tel"
            name="phone"
            inputmode="numeric"
            autocomplete="tel"
            placeholder="010-1234-5678"
            pattern="01[016789]-?[0-9]{3,4}-?[0-9]{4}"
            required
          />
          <p class="mt-1.5 text-[11px] leading-4 text-dm-gray-dark">
            하이픈 포함 여부와 관계없이 입력할 수 있어요.
          </p>
        </div>

        <!-- role은 화면 라벨과 관계없이 백엔드에 B 또는 G 값으로 전달한다. -->
        <fieldset>
          <legend class="mb-1.5 text-xs font-bold text-dm-gray-dark">역할</legend>
          <div class="grid grid-cols-2 gap-2">
            <label class="cursor-pointer">
              <input
                class="peer sr-only"
                type="radio"
                name="role"
                value="B"
                required
              />
              <span
                class="grid h-[46px] place-items-center rounded-xl border border-dm-gray/40 bg-dm-gray-light text-sm font-bold text-dm-gray-dark transition peer-checked:border-btn-pk peer-checked:bg-dm-cb-light peer-checked:text-btn-pk-dark"
              >
                신부
              </span>
            </label>
            <label class="cursor-pointer">
              <input
                class="peer sr-only"
                type="radio"
                name="role"
                value="G"
              />
              <span
                class="grid h-[46px] place-items-center rounded-xl border border-dm-gray/40 bg-dm-gray-light text-sm font-bold text-dm-gray-dark transition peer-checked:border-btn-pk peer-checked:bg-dm-cb-light peer-checked:text-btn-pk-dark"
              >
                신랑
              </span>
            </label>
          </div>
          <p class="mt-1.5 text-[11px] leading-4 text-dm-gray-dark">
            역할의 사용자 표시 명칭은 백엔드 정책 확인 후 적용합니다.
          </p>
        </fieldset>

        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-dm-gray-dark"
            for="signup-password"
          >
            비밀번호
          </label>
          <input
            id="signup-password"
            class="h-[46px] w-full rounded-xl border border-dm-gray/40 bg-dm-gray-light px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-dm-gray focus:border-btn-pk focus:ring-3 focus:ring-btn-pk/10"
            type="password"
            name="password"
            autocomplete="new-password"
            placeholder="비밀번호를 입력해주세요"
            minlength="8"
            maxlength="72"
            required
          />
          <p class="mt-1.5 text-[11px] leading-4 text-dm-gray-dark">
            비밀번호는 8자 이상 72자 이하로 입력해주세요.
          </p>
        </div>

        <div>
          <label
            class="mb-1.5 block text-xs font-bold text-dm-gray-dark"
            for="signup-password-confirmation"
          >
            비밀번호 확인
          </label>
          <input
            id="signup-password-confirmation"
            class="h-[46px] w-full rounded-xl border border-dm-gray/40 bg-dm-gray-light px-3.5 text-sm font-semibold text-[#232631] outline-none transition placeholder:font-medium placeholder:text-dm-gray focus:border-btn-pk focus:ring-3 focus:ring-btn-pk/10"
            type="password"
            name="passwordConfirm"
            autocomplete="new-password"
            placeholder="비밀번호를 한 번 더 입력해주세요"
            minlength="8"
            maxlength="72"
            required
          />
          <p class="mt-1.5 text-[11px] leading-4 text-dm-gray-dark">
            비밀번호와 동일하게 입력해주세요.
          </p>
        </div>
      </div>

      <!-- 약관 카드와 전문 화면 이동 -->
      <TermsAgreementCard />

      <!-- 모바일에서 항상 접근하기 쉬운 하단 가입 버튼 -->
      <div
        class="sticky bottom-0 -mx-5 mt-auto bg-gradient-to-b from-dm-gray-light/30 via-dm-gray-light to-dm-gray-light px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-3 sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16"
      >
        <!-- 실패 응답의 ApiResponse.message를 유지한 입력값 아래에 표시한다. -->
        <!-- 연동 시 201 성공 응답을 받은 뒤 온보딩 화면으로 이동한다. -->
        <RouterLink
          class="grid min-h-[50px] w-full place-items-center rounded-xl bg-btn-pk text-[15px] font-extrabold text-dm-gray-light no-underline transition hover:bg-btn-pk-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-btn-pk/30"
          to="/onboarding"
        >
          가입하고 시작하기
        </RouterLink>
      </div>
    </form>
  </AuthScreen>
</template>
