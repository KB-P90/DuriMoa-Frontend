<script setup lang="ts">
import { onMounted, ref } from 'vue';
import OverallProgress from '../../components/progress/OverallProgress.vue';
import PersonalProgress from '../../components/progress/PersonalProgress.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { useProgressStore } from '@/stores/progressStore';
import { useAuthCheck } from '@/composables/useAuthCheck.js';

useAuthCheck();

const progressStore = useProgressStore();

// 페이지 진입 시 현황 데이터 로드
onMounted(() => {
  progressStore.fetchProgress();
});

const PROGRESS_TABS = [
  { key: 'overall', label: '전체 현황' },
  { key: 'personal', label: '개인별 현황' },
];

const activeTab = ref('overall');
</script>

<template>
  <div class="whitespace-nowrap">
    <PageHeader title="목표 달성 현황" />

    <div class="p-4">
      <nav
        class="flex border-b border-dm-gray"
        role="tablist"
      >
        <button
          v-for="tab in PROGRESS_TABS"
          :key="tab.key"
          role="tab"
          :aria-selected="activeTab === tab.key"
          @click="activeTab = tab.key"
          class="relative flex-1 cursor-pointer whitespace-nowrap pb-5 text-sm font-semibold"
          :class="[
            activeTab === tab.key
              ? `text-brand after:content-[''] after:absolute after:w-full after:left-0 after:-bottom-px after:h-[4px] after:bg-brand`
              : 'text-dm-gray-dark',
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="pt-5">
        <OverallProgress v-if="activeTab === 'overall'" />
        <PersonalProgress v-if="activeTab === 'personal'" />
      </div>
    </div>
  </div>
</template>
