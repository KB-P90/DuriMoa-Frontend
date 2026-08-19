<script setup>
import { Skeleton } from '@/components/ui/skeleton';

defineProps({
  count: { type: Number, default: 5 },
});
</script>

<template>
  <div class="flex flex-col">
    <div
      v-for="i in count"
      :key="i"
      class="mb-3 flex items-start gap-3 rounded-2xl p-4 last:mb-0"
    >
      <Skeleton class="h-10 w-10 shrink-0 rounded-full" />
      <div class="flex-1">
        <Skeleton class="h-4 w-2/3" />
        <Skeleton class="mt-2 h-3.5 w-full" />
        <Skeleton class="mt-2 h-3 w-12" />
      </div>
    </div>
  </div>
</template>
