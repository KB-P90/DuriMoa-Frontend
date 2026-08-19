<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
</script>

<template>
  <section
    class="overflow-hidden rounded-[20px] border border-brand-border bg-white"
    aria-label="절약 미션을 불러오는 중"
    aria-busy="true"
  >
    <div class="flex items-center justify-between px-4 py-4">
      <Skeleton class="h-4 w-28" />
      <Skeleton class="h-4 w-20" />
    </div>
    <div
      v-for="index in 4"
      :key="index"
      class="flex min-h-[72px] items-center justify-between border-t border-divider px-4 py-3"
    >
      <div class="flex items-center gap-3">
        <Skeleton class="h-10 w-10 shrink-0 rounded-xl bg-pink-01" />
        <div>
          <Skeleton class="h-3.5 w-20" />
          <Skeleton class="mt-2 h-3 w-32" />
        </div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <Skeleton class="h-3 w-16" />
        <Skeleton class="h-6 w-14 rounded-full bg-dm-mint-light" />
      </div>
    </div>
  </section>
</template>
