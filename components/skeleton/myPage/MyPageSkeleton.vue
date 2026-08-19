<script setup>
import { Skeleton } from '@/components/ui/skeleton';
</script>

<template>
  <div class="flex flex-1 flex-col justify-between gap-5 bg-white px-4 py-5 md:px-10 md:py-6">
    <div class="rounded-2xl p-5 md:p-6">
      <div class="flex items-center gap-3">
        <Skeleton class="h-16 w-16 shrink-0 rounded-2xl" />
        <div class="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton class="h-4 w-24" />
          <Skeleton class="h-3 w-32" />
        </div>
        <Skeleton class="h-8 w-20 shrink-0 rounded-lg" />
      </div>
    </div>

    <Skeleton class="h-[68px] w-full rounded-2xl" />

    <div class="flex flex-col gap-3 pt-1">
      <Skeleton class="h-5 w-32" />
      <div class="flex gap-2">
        <Skeleton class="h-20 flex-1 rounded-xl" />
        <Skeleton class="h-20 flex-1 rounded-xl" />
      </div>
    </div>

    <div class="flex flex-col gap-3 pt-1">
      <Skeleton class="h-5 w-28" />
      <Skeleton class="h-[132px] w-full rounded-2xl" />
    </div>

    <div class="flex flex-col gap-3 pt-1">
      <Skeleton class="h-5 w-24" />
      <Skeleton class="h-[76px] w-full rounded-2xl" />
    </div>

    <Skeleton class="h-14 w-full rounded-xl" />
  </div>
</template>
