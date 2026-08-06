<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import OverallProgress from './progress/OverallProgress.vue';
import PersonalProgress from './progress/PersonalProgress.vue';
import MonthlyProgress from './progress/MonthlyProgress.vue';
import { useProgressStore } from '@/stores/progressStore';

const progressStore = useProgressStore();
const router = useRouter();

// 페이지 진입 시 현황 데이터 로드
onMounted(() => {
  progressStore.fetchProgress();
});

const PROGRESS_TABS = [
  { key: 'overall', label: '전체 현황' },
  { key: 'personal', label: '개인별 현황' },
  { key: 'monthly', label: '진행 현황' },
];

const activeTab = ref('overall');

function handleGoalListClick() {
  // TODO: 시안 목록 페이지가 없어 우선 home으로 이동 - 추후 name 확인 후 수정
  router.push({ name: 'home' });
}
</script>

<template>
  <div class="px-3 sm:px-20 pt-2">
    <header class="flex items-center justify-between px-3 py-5">
      <h1 class="flex-1 ml-2 text-xl font-bold">우리들의 진행 상황</h1>

      <button
        class="rounded-full bg-btn-pk text-white px-4 py-1 text-m font-semibold cursor-pointer"
        @click="handleGoalListClick"
      >
        시안 목록 >
      </button>
    </header>

    <nav
      class="flex mt-3 mx-2 border-b border-dm-gray"
      role="tablist"
    >
      <button
        v-for="tab in PROGRESS_TABS"
        :key="tab.key"
        role="tab"
        :aria-selected="activeTab === tab.key"
        @click="activeTab = tab.key"
        class="relative flex-1 text-lg font-semibold pb-5 cursor-pointer text-nowrap"
        :class="[
          activeTab === tab.key
            ? `text-btn-pk after:content-[''] after:absolute after:w-full after:left-0 after:-bottom-px after:h-[4px] after:bg-btn-pk`
            : 'text-dm-gray-dark',
        ]"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div>
      <OverallProgress v-if="activeTab === 'overall'" />
      <PersonalProgress v-if="activeTab === 'personal'" />
      <MonthlyProgress v-if="activeTab === 'monthly'" />
    </div>
  </div>
</template>
