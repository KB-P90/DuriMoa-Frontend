<script setup lang="ts">
import { RouterLink } from 'vue-router';

const QUICK_MENU_ITEMS = [
  { label: '목표 설정', icon: '/icons/goal.png', to: { name: 'goal-schedule' } },
  { label: '시안 목록', icon: '/icons/goalList.png', to: { name: 'goal-list' } },
  {
    label: '월별 지출',
    icon: '/icons/monthly.png',
    to: { name: 'expense', query: { from: 'home' } },
  },
  { label: '카드 추천', icon: '/icons/card.png', to: { name: 'card' } },
] as const;
</script>

<template>
  <nav
    aria-label="바로가기 메뉴"
    class="grid grid-cols-4 gap-2 py-5"
  >
    <RouterLink
      v-for="item in QUICK_MENU_ITEMS"
      :key="item.label"
      :to="item.to"
      class="flex flex-col items-center gap-1.5"
    >
      <img
        :src="item.icon"
        :alt="item.label"
        class="h-10 w-10 object-contain"
      />
      <span class="text-[11px] font-semibold leading-4 text-[#292934]">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>
