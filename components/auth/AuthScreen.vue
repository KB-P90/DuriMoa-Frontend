<template>
  <!-- 최대 너비를 제한하지 않는 인증 전용 전체 화면 컨테이너 -->
  <!-- TODO: #232631 진한 본문 색상 토큰 등록 검토 -->
  <main
    class="h-dvh min-h-dvh w-full overflow-hidden bg-dm-gray-light font-sans text-[#232631] antialiased [font-synthesis:none]"
  >
    <section class="flex h-full min-h-0 w-full flex-col bg-dm-gray-light">
      <!-- 긴 회원가입·약관 화면도 같은 컨테이너 안에서 스크롤된다. -->
      <div
        class="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <slot />
      </div>
    </section>
  </main>
</template>
