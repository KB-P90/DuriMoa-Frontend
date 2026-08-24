<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ChevronLeft } from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    title: string;
    onBack?: () => void;
    showBack?: boolean;
  }>(),
  {
    showBack: true,
  }
);

const router = useRouter();

function handleBack() {
  if (props.onBack) {
    props.onBack();
    return;
  }
  router.back();
}
</script>

<template>
  <header class="flex h-[50px] items-center gap-3 border-b border-[#F5F5F9] px-4">
    <button
      v-if="showBack"
      type="button"
      aria-label="뒤로가기"
      class="grid h-6 w-6 shrink-0 place-items-center cursor-pointer"
      @click="handleBack"
    >
      <ChevronLeft
        class="h-[17px] w-[17px]"
        :stroke-width="3"
      />
    </button>
    <h1 class="flex-1 truncate text-lg font-extrabold leading-[18px]">{{ title }}</h1>
    <slot />
  </header>
</template>
