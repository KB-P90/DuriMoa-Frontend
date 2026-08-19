<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';

const TABS = 2;
const METRICS = 2;
</script>

<template>
  <div
    class="space-y-5 p-4"
    aria-busy="true"
  >
    <nav
      class="flex border-b border-dm-gray"
      aria-hidden="true"
    >
      <button
        v-for="index in TABS"
        :key="index"
        type="button"
        class="relative flex-1 pb-3"
      >
        <Skeleton class="mx-auto h-5 w-20" />
      </button>
    </nav>

    <section class="rounded-3xl bg-pink-01 px-6 py-4" aria-hidden="true">
      <div class="mb-3 flex items-center justify-between">
        <Skeleton class="h-5 w-32 bg-pink-02" />
        <Skeleton class="h-5 w-12 bg-pink-02" />
      </div>
      <Skeleton class="h-5 w-full rounded-full bg-pink-02" />
      <div class="mt-3 flex items-center justify-between gap-4">
        <Skeleton class="h-4 w-28 bg-pink-02" />
        <Skeleton class="h-4 w-32 bg-pink-02" />
      </div>
    </section>

    <section
      class="space-y-8"
      aria-hidden="true"
    >
      <div
        v-for="groupIndex in METRICS"
        :key="groupIndex"
        class="flex flex-col gap-3"
      >
        <Skeleton class="h-5 w-28" />
        <div class="overflow-hidden rounded-3xl border border-brand-border bg-white px-6 py-4">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <Skeleton class="h-9 w-9 rounded-xl" />
              <div class="space-y-2">
                <Skeleton class="h-4 w-20" />
                <Skeleton class="h-4 w-24" />
              </div>
            </div>
            <Skeleton class="h-4 w-16" />
          </div>

          <div class="mt-6 space-y-4">
            <Skeleton class="h-4 w-full rounded-full" />
            <Skeleton class="h-4 w-5/6 rounded-full" />
            <Skeleton class="h-4 w-2/3 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
