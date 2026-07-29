<template>
  <!-- 최대 너비를 제한하지 않는 인증 전용 전체 화면 컨테이너 -->
  <!-- TODO: #232631 진한 본문 색상 토큰 등록 검토 -->
  <main
    class="min-h-dvh w-full bg-dm-gray-light font-sans text-[#232631] antialiased [font-synthesis:none]"
  >
    <section class="flex min-h-dvh w-full flex-col bg-dm-gray-light">
      <!-- Figma 모바일 시안의 상태 표시 영역 -->
      <!-- TODO: #222631, #252936 상태 표시 색상 토큰 등록 검토 -->
      <div
        class="flex h-[30px] shrink-0 items-center justify-between bg-dm-gray-light px-5 text-[11px] font-extrabold text-[#222631]"
        aria-hidden="true"
      >
        <span>9:41</span>
        <span class="flex items-end gap-[3px]">
          <i class="block h-1 w-[3px] rounded-sm bg-[#252936]"></i>
          <i class="block h-1.5 w-[3px] rounded-sm bg-[#252936]"></i>
          <i class="block h-2 w-[3px] rounded-sm bg-[#252936]"></i>
          <b class="ml-[5px] h-2 w-[17px] rounded-sm border-[1.5px] border-[#252936]"></b>
        </span>
      </div>
      <!-- 긴 회원가입·약관 화면도 같은 컨테이너 안에서 스크롤된다. -->
      <div
        class="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <slot />
      </div>
    </section>
  </main>
</template>
