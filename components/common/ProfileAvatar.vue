<script setup lang="ts">
import { ref, watch } from 'vue';
import { UserRound } from '@lucide/vue';

const props = defineProps<{
  src: string | null;
  name: string;
}>();

const hasLoadError = ref(false);

watch(
  () => props.src,
  () => {
    hasLoadError.value = false;
  }
);
</script>

<template>
  <div class="grid shrink-0 place-items-center overflow-hidden rounded-full bg-dm-gray-light">
    <img
      v-if="src && !hasLoadError"
      :src="src"
      :alt="`${name} 프로필`"
      class="h-full w-full object-cover"
      @error="hasLoadError = true"
    />
    <UserRound
      v-else
      class="h-1/2 w-1/2 text-dm-gray-dark"
      :stroke-width="1.8"
      aria-hidden="true"
    />
  </div>
</template>
