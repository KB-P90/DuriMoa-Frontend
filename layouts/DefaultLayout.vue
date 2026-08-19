<script setup lang="ts">
import BottomNav from '@/components/common/BottomNav.vue';

withDefaults(
  defineProps<{
    active: string;
    hideBottomNav?: boolean;
  }>(),
  {
    hideBottomNav: false,
  }
);

const emit = defineEmits<{
  select: [key: string];
}>();
</script>

<template>
  <div class="fixed inset-0 z-0 mx-auto flex h-dvh w-full max-w-[768px] flex-col bg-white">
    <main
      class="min-h-0 flex-1 overflow-y-auto scrollbar-none"
      :class="hideBottomNav ? '' : 'pb-[calc(4rem+env(safe-area-inset-bottom))]'"
    >
      <slot />
    </main>
    <BottomNav
      v-if="!hideBottomNav"
      :active="active"
      @select="emit('select', $event)"
    />
  </div>
</template>
