<template>
  <!--
    퍼블리싱 단계에서는 체크박스의 기본 선택 동작만 제공한다.
    전체 동의와 개별 동의의 상태 연동은 회원가입 로직을 연결할 때 추가한다.
  -->
  <fieldset
    class="m-0 min-w-0 rounded-2xl border border-dm-gray/40 bg-dm-gray-light p-3.5 shadow-lg shadow-dm-gray/20"
  >
    <legend class="sr-only">약관 동의</legend>

    <label class="flex cursor-pointer items-center gap-2.5">
      <input
        class="peer sr-only"
        type="checkbox"
      />
      <span
        class="grid h-[22px] w-[22px] place-items-center rounded-[7px] border border-dm-gray/50 bg-dm-gray-light text-[13px] font-black text-transparent peer-checked:border-btn-pk peer-checked:bg-btn-pk peer-checked:text-dm-gray-light"
        aria-hidden="true"
      >
        ✓
      </span>
      <!-- TODO: #232631 진한 제목 색상 토큰 등록 검토 -->
      <strong class="text-sm font-extrabold text-[#232631]">약관 전체 동의</strong>
    </label>

    <div class="my-3 h-px bg-dm-gray/20"></div>

    <!-- 필수: 서비스 이용약관 -->
    <div class="flex min-h-9 items-center justify-between gap-2">
      <label class="flex min-w-0 cursor-pointer items-center gap-2 text-xs text-dm-gray-dark">
        <input
          class="peer sr-only"
          type="checkbox"
        />
        <span
          class="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md border border-dm-gray/50 bg-dm-gray-light text-[11px] font-black text-transparent peer-checked:border-btn-pk peer-checked:bg-btn-pk peer-checked:text-dm-gray-light"
          aria-hidden="true"
        >
          ✓
        </span>
        <span>이용약관</span>
        <em
          class="rounded-full bg-dm-rose-light px-1.5 py-0.5 text-[9px] font-extrabold not-italic text-dm-co-darker"
        >
          필수
        </em>
      </label>
      <RouterLink
        class="shrink-0 px-1 py-1.5 text-[11px] text-dm-gray-dark no-underline hover:text-btn-pk-dark"
        to="/signup/terms/service"
        aria-label="이용약관 전문 보기"
      >
        보기
        <span
          class="pl-0.5 text-sm"
          aria-hidden="true"
          >›</span
        >
      </RouterLink>
    </div>

    <!-- 필수: 개인정보 처리방침 -->
    <div class="flex min-h-9 items-center justify-between gap-2">
      <label class="flex min-w-0 cursor-pointer items-center gap-2 text-xs text-dm-gray-dark">
        <input
          class="peer sr-only"
          type="checkbox"
        />
        <span
          class="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md border border-dm-gray/50 bg-dm-gray-light text-[11px] font-black text-transparent peer-checked:border-btn-pk peer-checked:bg-btn-pk peer-checked:text-dm-gray-light"
          aria-hidden="true"
        >
          ✓
        </span>
        <span>개인정보 처리방침</span>
        <em
          class="rounded-full bg-dm-rose-light px-1.5 py-0.5 text-[9px] font-extrabold not-italic text-dm-co-darker"
        >
          필수
        </em>
      </label>
      <RouterLink
        class="shrink-0 px-1 py-1.5 text-[11px] text-dm-gray-dark no-underline hover:text-btn-pk-dark"
        to="/signup/terms/privacy"
        aria-label="개인정보 처리방침 전문 보기"
      >
        보기
        <span
          class="pl-0.5 text-sm"
          aria-hidden="true"
          >›</span
        >
      </RouterLink>
    </div>

    <!-- 선택: 금융정보 연동 약관 -->
    <div class="flex min-h-9 items-center justify-between gap-2">
      <label class="flex min-w-0 cursor-pointer items-center gap-2 text-xs text-dm-gray-dark">
        <input
          class="peer sr-only"
          type="checkbox"
        />
        <span
          class="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md border border-dm-gray/50 bg-dm-gray-light text-[11px] font-black text-transparent peer-checked:border-btn-pk peer-checked:bg-btn-pk peer-checked:text-dm-gray-light"
          aria-hidden="true"
        >
          ✓
        </span>
        <span>금융정보 연동 약관</span>
        <em
          class="rounded-full bg-dm-gray/20 px-1.5 py-0.5 text-[9px] font-extrabold not-italic text-dm-gray-dark"
        >
          선택
        </em>
      </label>
      <RouterLink
        class="shrink-0 px-1 py-1.5 text-[11px] text-dm-gray-dark no-underline hover:text-btn-pk-dark"
        to="/signup/terms/finance"
        aria-label="금융정보 연동 약관 전문 보기"
      >
        보기
        <span
          class="pl-0.5 text-sm"
          aria-hidden="true"
          >›</span
        >
      </RouterLink>
    </div>
  </fieldset>
</template>
