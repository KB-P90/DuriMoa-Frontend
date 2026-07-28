<script setup lang="ts">
import BottomNav from '@/components/common/BottomNav.vue';

defineProps<{
  active: string;
}>();

const emit = defineEmits<{
  select: [key: string];
}>();
</script>

<template>
  <div class="mx-auto flex min-h-dvh w-full max-w-[768px] flex-col bg-white">
    <main class="flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <slot />
    </main>
    <BottomNav :active="active" @select="emit('select', $event)" />
  </div>
</template>
