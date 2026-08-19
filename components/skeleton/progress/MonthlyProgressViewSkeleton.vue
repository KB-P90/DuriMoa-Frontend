<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';

const MONTH_ROWS = 4;
</script>

<template>
  <div
    class="space-y-8 p-4"
    aria-busy="true"
  >
    <section
      class="flex flex-col gap-3"
      aria-hidden="true"
    >
      <Skeleton class="h-5 w-28" />
      <div class="rounded-3xl bg-pink-01 px-6 py-4">
        <div class="mb-3 flex items-center justify-between">
          <Skeleton class="h-5 w-36 bg-pink-02" />
          <Skeleton class="h-5 w-14 bg-pink-02" />
        </div>

        <Skeleton class="h-5 w-full rounded-full bg-pink-02" />

        <div class="mt-3 flex items-center justify-between gap-4">
          <Skeleton class="h-4 w-28 bg-pink-02" />
          <Skeleton class="h-4 w-32 bg-pink-02" />
        </div>
      </div>
    </section>

    <section
      class="flex flex-col gap-3"
      aria-hidden="true"
    >
      <Skeleton class="h-5 w-28" />
      <div class="rounded-3xl border border-brand-border bg-white px-6 py-6">
        <div
          v-for="index in MONTH_ROWS"
          :key="index"
          class="relative mx-4 flex gap-3 pb-8"
        >
          <div class="absolute bottom-[-10px] left-5 top-2.5 w-1 -translate-x-1/2 bg-dm-mint-light" />
          <div class="relative flex w-10 flex-shrink-0 justify-center">
            <Skeleton class="z-10 h-5 w-5 rounded-full bg-dm-mint-dark" />
          </div>

          <div class="ml-3 flex flex-1 items-start justify-between gap-4">
            <div class="space-y-2">
              <Skeleton class="h-4 w-20" />
              <Skeleton class="h-3 w-28" />
            </div>

            <div class="space-y-2 text-right">
              <Skeleton class="ml-auto h-5 w-20" />
              <Skeleton class="ml-auto h-3 w-24" />
            </div>
          </div>
        </div>

        <div class="relative mx-4 flex gap-3 pb-0" aria-hidden="true">
          <div class="relative flex w-10 flex-shrink-0 justify-center">
            <Skeleton class="z-10 h-5 w-5 rounded-full bg-dm-mint-dark" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
