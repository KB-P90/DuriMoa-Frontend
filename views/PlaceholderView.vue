<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="p-4">
    <h1 class="text-lg font-bold">{{ title }} 화면</h1>
  </div>
</template>
