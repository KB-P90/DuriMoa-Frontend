<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';

defineProps<{
  cellCount: number;
}>();

const SUMMARY_ITEMS = 3;
const WEEKDAYS = 7;
const TRANSACTION_ROWS = 3;
</script>

<template>
  <div
    aria-busy="true"
    aria-label="캘린더 불러오는 중"
  >
    <section class="grid grid-cols-3 gap-2.5">
      <div
        v-for="index in SUMMARY_ITEMS"
        :key="index"
        class="rounded-2xl border border-dm-gray/30 px-3 py-3 shadow-sm sm:px-4"
      >
        <Skeleton class="h-3 w-10" />
        <Skeleton class="mt-2 h-3 w-14" />
      </div>
    </section>

    <Skeleton class="mt-4 h-16 w-full rounded-2xl" />

    <section class="mt-5 rounded-3xl border border-dm-gray/30 px-2 pb-4 pt-4 sm:px-5">
      <div class="mb-3 flex items-center justify-between px-1">
        <Skeleton class="h-4 w-4 rounded-full" />
        <Skeleton class="h-4 w-24" />
        <Skeleton class="h-4 w-4 rounded-full" />
      </div>
      <div class="grid grid-cols-7 pb-2">
        <Skeleton
          v-for="index in WEEKDAYS"
          :key="index"
          class="mx-auto h-3 w-3"
        />
      </div>
      <div class="grid grid-cols-7 gap-y-2">
        <Skeleton
          v-for="index in cellCount"
          :key="index"
          class="mx-auto h-10 w-10 rounded-xl sm:h-11 sm:w-11"
        />
      </div>
    </section>

    <section class="mt-5">
      <div class="mb-3 flex items-center justify-between">
        <Skeleton class="h-4 w-20" />
        <div class="flex gap-2">
          <Skeleton class="h-6 w-10 rounded-full" />
          <Skeleton class="h-7 w-16 rounded-full" />
        </div>
      </div>
      <div class="overflow-hidden rounded-2xl border border-dm-gray/30">
        <div
          v-for="index in TRANSACTION_ROWS"
          :key="index"
          class="flex items-center gap-3 border-b border-dm-gray/30 px-4 py-3.5 last:border-b-0"
        >
          <Skeleton class="h-10 w-10 shrink-0 rounded-xl" />
          <div class="min-w-0 flex-1">
            <Skeleton class="h-3.5 w-20" />
            <Skeleton class="mt-2 h-3 w-28" />
          </div>
          <Skeleton class="h-3.5 w-16" />
        </div>
      </div>
    </section>
  </div>
</template>
