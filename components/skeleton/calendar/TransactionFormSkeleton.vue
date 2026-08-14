<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
</script>

<template>
  <div
    class="space-y-5 px-4 pb-20 pt-5 sm:px-5"
    aria-busy="true"
    aria-label="내역 처리 중"
  >
    <section>
      <Skeleton class="mb-2 h-3.5 w-8" />
      <div class="grid grid-cols-3 gap-2">
        <Skeleton class="h-12 rounded-2xl" />
        <Skeleton class="h-12 rounded-2xl" />
        <Skeleton class="h-12 rounded-2xl" />
      </div>
    </section>

    <section>
      <Skeleton class="mb-2 h-3 w-20" />
      <div class="flex flex-wrap gap-2">
        <Skeleton class="h-10 w-20 rounded-xl" />
        <Skeleton class="h-10 w-20 rounded-xl" />
        <Skeleton class="h-10 w-24 rounded-xl" />
        <Skeleton class="h-10 w-20 rounded-xl" />
      </div>
      <Skeleton class="mb-2 mt-4 h-3 w-20" />
      <div class="flex flex-wrap gap-2">
        <Skeleton class="h-10 w-20 rounded-xl" />
        <Skeleton class="h-10 w-24 rounded-xl" />
        <Skeleton class="h-10 w-20 rounded-xl" />
      </div>
    </section>

    <section>
      <Skeleton class="mb-2 h-3.5 w-8" />
      <Skeleton class="h-12 w-full rounded-2xl" />
    </section>

    <section>
      <Skeleton class="mb-2 h-3.5 w-8" />
      <Skeleton class="h-[46px] w-full rounded-xl" />
    </section>

    <section>
      <Skeleton class="mb-2 h-3.5 w-8" />
      <Skeleton class="h-20 w-full rounded-2xl" />
    </section>

    <div
      class="fixed inset-x-0 bottom-[env(safe-area-inset-bottom)] z-40 mx-auto w-full max-w-xl bg-white px-4 pb-5 pt-2 sm:px-5"
    >
      <Skeleton class="h-[52px] w-full rounded-2xl" />
    </div>
  </div>
</template>
