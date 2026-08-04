<script setup lang="ts">
import { ref } from 'vue';
import OverallStatus from './status/OverallStatus.vue';
import PersonalStatus from './status/PersonalStatus.vue';
import MonthlyProgress from './status/MonthlyProgress.vue';

const STATUS_TABS = [
  { key: 'overall', label: '전체 현황' },
  { key: 'personal', label: '개인별 현황' },
  { key: 'monthly', label: '진행 현황' },
];

const activeTab = ref('overall');
</script>

<template>
  <div class="px-3 sm:px-20 pt-2">
    <header class="flex items-center justify-between px-3 py-5">
      <h1 class="flex-1 ml-2 text-xl font-bold">우리들의 진행 상황</h1>

      <button
        class="rounded-full bg-btn-pk text-white px-4 py-1 text-m font-semibold cursor-pointer"
      >
        시안 목록 >
      </button>
    </header>

    <nav
      class="flex justify-center gap-10 mt-3 border-b border-dm-gray"
      role="tablist"
    >
      <button
        v-for="tab in STATUS_TABS"
        :key="tab.key"
        role="tab"
        :aria-selected="activeTab === tab.key"
        @click="activeTab = tab.key"
        class="relative text-lg font-semibold pb-5 px-11 cursor-pointer text-nowrap"
        :class="[
          activeTab === tab.key
            ? `text-btn-pk after:content-[''] after:absolute after:w-50 after:left-1/2 after:-translate-x-1/2 after:-bottom-px after:h-[4px] after:bg-btn-pk`
            : 'text-dm-gray-dark',
        ]"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div>
      <OverallStatus v-if="activeTab === 'overall'" />
      <PersonalStatus v-if="activeTab === 'personal'" />
      <MonthlyProgress v-if="activeTab === 'monthly'" />
    </div>
  </div>
</template>
