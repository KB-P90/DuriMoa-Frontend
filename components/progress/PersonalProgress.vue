<script setup lang="ts">
import { LockKeyhole } from '@lucide/vue';
import { useProgressStore } from '@/stores/progressStore';
import { computed } from 'vue';
import { formatWon } from '@/utils/format';

const progressStore = useProgressStore();

const members = computed(() => progressStore.personalProgress.members);
</script>

<template>
  <div class="flex flex-col gap-10 px-4 py-8">
    <section class="overflow-hidden rounded-3xl border border-dm-co p-7 bg-white shadow-md">
      <h2 class="mb-4 text-lg font-bold">자산 현황 공유</h2>

      <div
        v-for="member in members"
        :key="member.userId"
        class="flex items-center justify-between pr-2 mb-4 last:mb-0"
      >
        <div class="flex items-center gap-3">
          <!-- TODO: API에서 아직 신랑/신부 역할 안 보내줘서 추후 반영 예정 -->
          <img
            src="/characters/rabbit-bride.png"
            class="h-10"
          />

          <span class="text-xl font-semibold">
            {{ member.name }}
          </span>

          <span
            class="rounded-full px-2 py-1 text-sm"
            :class="
              member.assetShared
                ? 'bg-dm-rose-light text-dm-co-darker'
                : 'bg-dm-gray text-dm-gray-light'
            "
          >
            {{ member.assetShared ? '전체 공개' : '결혼 자금만 공개' }}
          </span>
        </div>

        <span
          v-if="member.assetShared && member.currentAmount != null"
          class="text-xl font-bold"
        >
          {{ Math.round(member.currentAmount / 10000).toLocaleString() }}만원
        </span>
        <span
          v-else
          class="flex gap-2 text-dm-gray font-semibold"
          ><LockKeyhole :size="25"
        /></span>
      </div>

      <p class="mt-3 text-sm text-dm-gray">선택한 공개 범위에 따라 자산 실 금액이 공유돼요.</p>
    </section>

    <section class="overflow-hidden rounded-3xl border border-dm-mint-dark p-7 bg-white shadow-md">
      <h2 class="mb-4 text-lg font-bold">개인별 달성률</h2>

      <div
        v-for="member in members"
        :key="member.userId"
        class="mb-6 last:mb-0"
      >
        <div class="flex justify-between mr-2">
          <div class="flex items-center gap-1">
            <!-- TODO: API에서 아직 신랑/신부 역할 안 보내줘서 추후 반영 예정 -->
            <!-- 역할에 따라 하단 달성률 & progress바 색상도 변경 필요 -->
            <img
              src="/characters/rabbit-bride.png"
              class="h-10"
            />

            <span class="text-xl font-semibold">
              {{ member.name }}
            </span>
          </div>

          <div class="my-2 flex justify-between">
            <span class="text-lg font-bold text-dm-mint-darker"> {{ member.progressRate }}% </span>
          </div>
        </div>

        <div class="mx-2 mt-2">
          <div class="h-4 rounded-full bg-gray-100">
            <div
              class="h-full rounded-full bg-dm-mint-dark transition-all duration-1000"
              :style="{ width: `${member.progressRate}%` }"
            />
          </div>

          <p class="mt-2 text-sm text-dm-gray-dark">
            목표 {{ formatWon(member.targetAmount) }} 중
            {{ formatWon(member.assetAmount ?? 0) }} 달성
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
