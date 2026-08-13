<script setup lang="ts">
defineProps<{
  title: string;
  step?: string;
}>();
</script>

<template>
  <div class="flex flex-row items-center gap-2 mb-4">
    <p
      v-if="step"
      class="text-base font-bold text-dm-mint-darker"
    >
      {{ step }}
    </p>
    <p class="text-base text-black font-bold">{{ title }}</p>
  </div>
</template>
