<script setup lang="ts">
import { Check } from '@lucide/vue';
</script>

<template>
  <div class="flex items-center gap-3 rounded-2xl bg-[#FAFAFB] p-4">
    <div class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-dm-mint-light text-btn-mt-dark">
      <Check class="h-4 w-4" :stroke-width="2.5" />
    </div>
    <p class="text-xs font-medium leading-relaxed text-[#767785]">
      안심하세요.<br />
      입력한 금액은 카드 추천에만 사용돼요.
    </p>
  </div>
</template>
