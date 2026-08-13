<script setup>
import { Skeleton } from '@/components/ui/skeleton';
</script>

<template>
  <div class="mt-5 flex flex-col gap-2">
    <Skeleton class="h-3.5 w-full rounded-full" />
    <div class="mt-6 flex justify-between">
      <Skeleton
        v-for="i in 5"
        :key="i"
        class="h-2.5 w-8"
      />
    </div>
  </div>
</template>
