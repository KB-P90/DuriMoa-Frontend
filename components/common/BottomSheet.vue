<script setup lang="ts">
defineEmits<{
  close: [];
}>();
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      @click.self="$emit('close')"
    >
      <div
        class="relative flex max-h-[85vh] w-full max-w-[768px] cursor-default flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out"
      >
        <div class="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-gray-200" />
        <slot />
      </div>
    </div>
  </Teleport>
</template>
