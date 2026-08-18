<script setup lang="ts">
defineProps<{
  year: number;
  month: number;
}>();
</script>

<template>
  <div class="rounded-full bg-dm-gray-light px-3 py-1 text-[11px] font-bold text-dm-gray-dark">
    {{ year }}. {{ month }}
  </div>
</template>
