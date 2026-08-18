<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
</script>

<template>
  <div class="space-y-4" aria-label="월별 지출 내역을 불러오는 중" aria-busy="true">
    <section class="rounded-[20px] border border-pink-02 bg-white p-4 shadow-sm">
      <Skeleton class="h-4 w-24" />
      <Skeleton class="mt-2 h-3 w-64 max-w-full" />

      <div class="mt-6 space-y-5">
        <div v-for="index in 5" :key="index" class="grid grid-cols-[76px_1fr] items-center gap-2">
          <div class="flex items-center gap-2">
            <Skeleton class="h-5 w-5 rounded-full" />
            <Skeleton class="h-4 w-10" />
          </div>
          <div class="space-y-2">
            <Skeleton class="h-3.5 rounded-md" :class="index % 2 ? 'w-3/4' : 'w-1/2'" />
            <Skeleton class="h-3.5 rounded-md" :class="index % 2 ? 'w-1/2' : 'w-4/5'" />
          </div>
        </div>
      </div>

      <div class="mt-6 rounded-[14px] border border-pink-02 px-4 py-4">
        <Skeleton class="mx-auto h-3 w-52 max-w-full" />
        <Skeleton class="mx-auto mt-2 h-3 w-64 max-w-full" />
      </div>
    </section>

    <section class="rounded-[20px] border border-brand-border bg-white p-4">
      <div class="flex items-center justify-between">
        <Skeleton class="h-4 w-40" />
        <Skeleton class="h-5 w-5" />
      </div>
      <div class="mt-4 flex items-center gap-3">
        <Skeleton class="h-10 w-10 shrink-0 rounded-full" />
        <Skeleton class="h-10 w-52 max-w-[70%] rounded-[15px]" />
      </div>
    </section>
  </div>
</template>
