<script setup lang="ts">
import { LockKeyhole, UserRound } from '@lucide/vue';
import { useProgressStore } from '@/stores/progressStore';
import { computed } from 'vue';
import { formatManWon } from '@/utils/format';

const progressStore = useProgressStore();

const members = computed(() => progressStore.personalProgress.members);

// 진행 바는 100%를 넘지 않도록 처리 (텍스트 라벨과 동일한 기준으로 클램프)
const clampProgressRate = (rate: number) => Math.min(100, Math.max(0, rate));
</script>

<template>
  <div class="flex flex-col gap-8">
    <section class="flex flex-col gap-3">
      <h2 class="px-2 text-base font-bold">자산 현황 공유</h2>
      <div class="overflow-hidden rounded-3xl bg-white border border-brand-border px-6 py-4">
        <div
          v-for="(member, index) in members"
          :key="member.userId"
          class="flex items-center justify-between pr-2 mb-4 last:mb-0"
        >
          <div class="flex items-center gap-3">
            <div
              class="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl"
              :class="index === 0 ? 'bg-pink-02' : 'bg-dm-mint'"
            >
              <img
                v-if="member.profileImage"
                :src="member.profileImage"
                alt=""
                class="h-full w-full object-cover"
              />
              <UserRound
                v-else
                class="h-6 w-6"
                :class="index === 0 ? 'text-brand' : 'text-btn-mt-dark'"
              />
            </div>

            <span class="text-sm font-semibold">
              {{ member.name }}
            </span>

            <span
              class="rounded-full px-2 py-1 text-xs"
              :class="
                member.assetShared
                  ? 'bg-dm-mint-dark text-dm-gray-light'
                  : 'bg-dm-gray text-dm-gray-light'
              "
            >
              {{ member.assetShared ? '전체 공개' : '결혼 자금만 공개' }}
            </span>
          </div>

          <span
            v-if="member.assetShared || index === 0"
            class="text-sm font-bold"
          >
            {{ formatManWon(member.assetAmount ?? 0) }}
          </span>
          <span
            v-else
            class="flex items-center gap-2 text-sm text-disable font-semibold"
          >
            <LockKeyhole :size="25" />
          </span>
        </div>
      </div>
      <p class="px-2 text-xs text-dm-gray-dark">선택한 공개 범위에 따라 자산 실 금액이 공유돼요.</p>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="px-2 text-base font-bold">개인별 달성률</h2>
      <div class="overflow-hidden rounded-3xl border border-brand-border bg-white px-6 py-4">
        <div
          v-for="(member, index) in members"
          :key="member.userId"
          class="mb-6 last:mb-0"
        >
          <div class="flex justify-between mr-2">
            <div class="flex items-center gap-1">
              <div
                class="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl"
                :class="index === 0 ? 'bg-pink-02' : 'bg-dm-mint'"
              >
                <img
                  v-if="member.profileImage"
                  :src="member.profileImage"
                  alt=""
                  class="h-full w-full object-cover"
                />
                <UserRound
                  v-else
                  class="h-6 w-6 text-[#292934]"
                  :class="index === 0 ? 'text-brand' : 'text-btn-mt-dark'"
                />
              </div>

              <span class="ml-2 text-sm font-semibold">
                {{ member.name }}
              </span>
            </div>

            <div class="my-2 flex justify-between">
              <span class="text-base font-bold text-dm-mint-darker">
                {{ clampProgressRate(member.progressRate) }}%
              </span>
            </div>
          </div>

          <div class="mt-3">
            <div class="h-4 rounded-full bg-gray-100">
              <div
                class="h-full rounded-full transition-all duration-1000"
                :class="index === 0 ? 'bg-brand' : 'bg-dm-mint-darker'"
                :style="{ width: `${clampProgressRate(member.progressRate)}%` }"
              />
            </div>

            <p class="mt-2 text-xs text-dm-gray-dark">
              목표 {{ formatManWon(member.targetAmount) }} 중
              {{ formatManWon(member.currentAmount ?? 0) }} 달성
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
