<script setup lang="ts">
import { Home, Calendar, PieChart, CreditCard } from '@lucide/vue';

defineProps<{
  active: string;
}>();

const emit = defineEmits<{
  select: [key: string];
}>();

const NAV_ITEMS = [
  { key: 'home', label: '홈', icon: Home },
  { key: 'calendar', label: '캘린더', icon: Calendar },
  { key: 'progress', label: '현황', icon: PieChart },
  { key: 'card', label: '카드추천', icon: CreditCard },
] as const;
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-16 w-full max-w-[768px] items-stretch border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]"
  >
    <button
      v-for="item in NAV_ITEMS"
      :key="item.key"
      type="button"
      class="flex flex-1 flex-col items-center justify-center gap-1 text-xs"
      :class="active === item.key ? 'text-brand-dark' : 'text-dm-gray'"
      @click="emit('select', item.key)"
    >
      <component
        :is="item.icon"
        class="h-6 w-6"
        :stroke-width="active === item.key ? 2.5 : 2"
      />
      <span>{{ item.label }}</span>
    </button>
  </nav>
</template>
