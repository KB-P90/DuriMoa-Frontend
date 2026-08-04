<script setup>
import { AlertDialogTitle } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});
</script>

<template>
  <AlertDialogTitle :class="cn('text-lg font-bold text-[#232631]', props.class)">
    <slot />
  </AlertDialogTitle>
</template>
