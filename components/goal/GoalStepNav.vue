<script setup lang="ts">
import { Button } from '@/components/ui/button';

withDefaults(
  defineProps<{
    showPrev?: boolean;
    nextLabel?: string;
    nextDisabled?: boolean;
  }>(),
  {
    showPrev: true,
    nextLabel: '다음',
    nextDisabled: false,
  }
);

defineEmits<{
  prev: [];
  next: [];
}>();
</script>

<template>
  <div
    class="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[768px] gap-2 border-t border-dm-gray/15 bg-white px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]"
  >
    ㅇ
    <Button
      v-if="showPrev"
      type="button"
      variant="outline"
      class="h-[50px] flex-1 rounded-xl border-dm-gray/40 bg-transparent text-sm font-bold text-dm-gray-dark shadow-none hover:border-dm-gray/60 hover:bg-transparent"
      @click="$emit('prev')"
    >
      이전
    </Button>
    <Button
      type="submit"
      :disabled="nextDisabled"
      class="h-[50px] flex-[2] rounded-xl bg-brand text-[15px] font-extrabold text-dm-gray-light shadow-none hover:bg-brand-dark"
      @click="$emit('next')"
    >
      {{ nextLabel }}
    </Button>
  </div>
</template>
