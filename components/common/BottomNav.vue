<script setup lang="ts">
import { Calendar, CreditCard, Heart, Home } from '@lucide/vue';

defineProps<{
  active: string;
}>();

const emit = defineEmits<{
  select: [key: string];
}>();

const NAV_ITEMS = [
  { key: 'home', label: '홈', icon: Home },
  { key: 'calendar', label: '캘린더', icon: Calendar },
  { key: 'status', label: '현황', icon: Heart },
  { key: 'card', label: '카드추천', icon: CreditCard },
] as const;
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-16 w-full max-w-[768px] items-stretch border-t border-[#F5F5F9] bg-white pb-[env(safe-area-inset-bottom)]"
  >
    <button
      v-for="item in NAV_ITEMS"
      :key="item.key"
      type="button"
      class="flex flex-1 flex-col items-center justify-center gap-1 text-[9.5px] font-semibold"
      :class="active === item.key ? 'text-dm-gray' : 'text-dm-gray'"
      @click="emit('select', item.key)"
    >
      <component
        :is="item.icon"
        class="h-[21px] w-[21px]"
        :class="active === item.key ? 'fill-dm-gray text-dm-gray' : 'text-dm-gray'"
        :stroke-width="active === item.key ? 2.4 : 2"
      />
      <span>{{ item.label }}</span>
    </button>
  </nav>
</template>
