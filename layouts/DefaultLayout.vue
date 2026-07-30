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
  <div class="relative mx-auto flex h-[861px] w-full max-w-[390px] flex-col overflow-hidden rounded-[30px] bg-white shadow-[0_20px_50px_-18px_rgba(34,34,43,0.28),0_0_0_1px_rgba(34,34,43,0.06)]">
    <main class="h-[799px] overflow-y-auto">
      <slot />
    </main>
    <BottomNav :active="active" @select="emit('select', $event)" />
  </div>
</template>
