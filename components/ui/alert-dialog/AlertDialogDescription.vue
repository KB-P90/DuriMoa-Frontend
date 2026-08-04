<script setup>
import { AlertDialogDescription } from 'reka-ui';
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
  <AlertDialogDescription :class="cn('text-sm leading-5 text-dm-gray-dark', props.class)">
    <slot />
  </AlertDialogDescription>
</template>
