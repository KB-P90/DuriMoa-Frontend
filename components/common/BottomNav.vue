<script setup lang="ts">
import { Calendar, Home, PieChart, User } from '@lucide/vue';
import AiChatFloatingWidget from '@/components/common/AiChatFloatingWidget.vue';

defineProps<{
  active: string;
}>();

const emit = defineEmits<{
  select: [key: string];
}>();

const NAV_ITEMS = [
  { key: 'home', label: '홈', icon: Home },
  { key: 'calendar', label: '캘린더', icon: Calendar },
  { key: 'ai', label: 'MoAI', icon: null },
  { key: 'progress', label: '현황', icon: PieChart },
  { key: 'myinfo', label: '마이', icon: User },
] as const;
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-16 w-full max-w-[768px] items-stretch overflow-visible border-t border-brand-border bg-white pb-[env(safe-area-inset-bottom)]"
  >
    <template
      v-for="item in NAV_ITEMS"
      :key="item.key"
    >
      <button
        v-if="item.key !== 'ai'"
        type="button"
        class="flex flex-1 flex-col items-center justify-center gap-1 text-xs cursor-pointer"
        :class="active === item.key ? 'text-brand-dark' : 'text-dm-gray-dark'"
        @click="emit('select', item.key)"
      >
        <component
          :is="item.icon"
          class="h-6 w-6"
          :stroke-width="active === item.key ? 2.5 : 2"
        />
        <span>{{ item.label }}</span>
      </button>

      <div
        v-else
        class="flex flex-1 items-center justify-center overflow-visible"
      >
        <AiChatFloatingWidget
          placement="nav"
          :button-label="item.label"
        />
      </div>
    </template>
  </nav>
</template>
