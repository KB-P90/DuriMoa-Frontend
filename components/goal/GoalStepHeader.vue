<script setup lang="ts">
defineProps<{
  title: string;
  step?: string;
}>();
</script>

<template>
  <div class="mb-6">
    <p
      v-if="step"
      class="mb-1 text-xs font-bold text-dm-mint-darker"
    >
      {{ step }}
    </p>
    <h1 class="text-lg font-bold text-[#232631]">결혼 목표 설정</h1>
    <p class="mt-1 text-sm text-dm-gray-dark">{{ title }}</p>
  </div>
</template>
