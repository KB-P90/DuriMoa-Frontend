<script setup>
import { reactiveOmit } from '@vueuse/core';
import { AlertDialogContent, AlertDialogPortal, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';
import AlertDialogOverlay from './AlertDialogOverlay.vue';

const props = defineProps({
  forceMount: { type: Boolean, required: false },
  trapFocus: { type: Boolean, required: false },
  disableOutsidePointerEvents: { type: Boolean, required: false },
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});
const emits = defineEmits([
  'escapeKeyDown',
  'pointerDownOutside',
  'focusOutside',
  'interactOutside',
  'openAutoFocus',
  'closeAutoFocus',
]);

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogContent
      v-bind="forwarded"
      class="fixed inset-0 z-50 mx-auto flex max-w-[768px] items-center justify-center p-4 outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
    >
      <div
        :class="
          cn(
            'grid w-full max-w-sm gap-4 rounded-2xl border bg-background p-6 shadow-lg',
            props.class
          )
        "
      >
        <slot />
      </div>
    </AlertDialogContent>
  </AlertDialogPortal>
</template>
