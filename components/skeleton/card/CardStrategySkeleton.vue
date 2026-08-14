<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
</script>

<template>
  <div
    class="space-y-7"
    role="status"
    aria-label="카드 추천 정보를 불러오는 중"
  >
    <span class="sr-only">카드 추천 정보를 불러오는 중입니다.</span>

    <section
      class="overflow-hidden rounded-3xl bg-pink-01 p-4"
      aria-hidden="true"
    >
      <Skeleton class="h-3 w-28 bg-pink-02" />
      <Skeleton class="mt-3 h-6 w-40 bg-pink-02" />
      <Skeleton class="mt-2 h-6 w-32 bg-pink-02" />
      <Skeleton class="mt-3 h-3 w-52 max-w-full bg-pink-02" />
      <Skeleton class="mt-4 h-9 w-28 rounded-2xl bg-pink-03" />
    </section>

    <section
      class="space-y-4"
      aria-hidden="true"
    >
      <div>
        <Skeleton class="h-5 w-32" />
        <Skeleton class="mt-2 h-3 w-56 max-w-full" />
      </div>

      <div
        v-for="groupIndex in 2"
        :key="groupIndex"
        class="rounded-3xl border border-gray-100 bg-white p-4"
      >
        <div class="flex items-center justify-between gap-4">
          <Skeleton class="h-5 w-28" />
          <Skeleton class="h-4 w-20" />
        </div>

        <div class="mt-4 space-y-3">
          <div
            v-for="cardIndex in 2"
            :key="cardIndex"
            class="flex items-center gap-3 p-2 min-[390px]:gap-4"
          >
            <Skeleton class="h-14 w-20 shrink-0 rounded-xl min-[390px]:h-16 min-[390px]:w-24" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-3">
                <Skeleton class="h-4 w-28 max-w-[60%]" />
                <Skeleton class="h-5 w-12 rounded-full bg-dm-mint-light" />
              </div>
              <Skeleton class="mt-2 h-3 w-full" />
              <Skeleton class="mt-1.5 h-3 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <Skeleton
      class="h-24 w-full rounded-2xl"
      aria-hidden="true"
    />
  </div>
</template>
