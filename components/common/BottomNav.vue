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
  { key: 'status', label: '현황', icon: PieChart },
  { key: 'card', label: '카드추천', icon: CreditCard },
] as const;
</script>

<template>
  <nav
    class="absolute inset-x-0 bottom-0 z-50 mx-auto flex h-[62px] w-full max-w-[390px] items-stretch border-t border-[#F5F5F9] bg-white"
  >
    <button
      v-for="item in NAV_ITEMS"
      :key="item.key"
      type="button"
      class="flex h-[49px] flex-1 flex-col items-center justify-center gap-[3px] pt-[5px] pb-[9px] text-[9.5px]"
      :class="active === item.key ? 'text-btn-pk-dark' : 'text-dm-gray'"
      @click="emit('select', item.key)"
    >
      <component
        :is="item.icon"
        class="h-[21px] w-[21px]"
        :stroke-width="active === item.key ? 2.2 : 1.5"
      />
      <span>{{ item.label }}</span>
    </button>
  </nav>
</template>
