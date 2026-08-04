<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';

defineEmits<{
  'click-input-amount': [];
}>();
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF0EF] via-[#FFF5F4] to-[#FFF0F2] p-6 shadow-sm sm:p-7 md:p-8">
    <div class="relative z-10 max-w-full sm:max-w-md md:max-w-lg">
      <span class="text-xs font-bold tracking-wider text-btn-pk uppercase">
        SMART RECOMMEND
      </span>
      <h2 class="mt-1.5 text-xl font-extrabold leading-tight text-gray-900 sm:text-2xl md:text-3xl">
        다음 결제,<br />
        어떤 카드가 좋을까요?
      </h2>
      <p class="mt-2 text-xs text-dm-gray-dark whitespace-nowrap sm:text-sm">
        결제 금액에 맞는 최고의 카드를 추천해 드려요.
      </p>

      <button
        type="button"
        class="mt-4 flex cursor-pointer items-center gap-1.5 rounded-2xl bg-btn-pk px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-btn-pk-dark sm:text-sm"
        @click="$emit('click-input-amount')"
      >
        <span>결제 금액 입력</span>
        <ArrowRight class="h-3.5 w-3.5" :stroke-width="2.5" />
      </button>
    </div>

    <!-- Right Decorative Overlapping Cards Graphic -->
    <div aria-hidden="true" class="absolute -right-3 bottom-2 z-0 h-32 w-36 sm:h-36 sm:w-44 md:h-40 md:w-52">
      <!-- Pink Back Card -->
      <div class="absolute right-0 top-1 h-20 w-32 rotate-[14deg] rounded-2xl bg-[#FFAEC0] shadow-sm sm:h-24 sm:w-36 md:h-28 md:w-44" />
      <!-- Blue Front Card -->
      <div class="absolute right-5 top-7 flex h-20 w-32 -rotate-[6deg] flex-col justify-between rounded-2xl bg-[#91BAF8] p-3 shadow-md sm:h-24 sm:w-36 md:h-28 md:w-44">
        <div class="h-3 w-4 rounded-sm bg-white/70 sm:h-4 sm:w-5" />
        <span class="self-end text-[10px] font-bold tracking-wider text-white/90 sm:text-xs">P90</span>
      </div>
    </div>
  </div>
</template>
