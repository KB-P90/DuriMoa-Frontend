<script setup lang="ts">
import { Check, ChevronDown } from '@lucide/vue';
import { ref } from 'vue';
import type { CalendarMode } from '@/types/calendar';

interface CategoryGroup {
  mode: CalendarMode;
  label: string;
  options: readonly string[];
}

defineProps<{
  modelValue: string;
  groups: readonly CategoryGroup[];
  disabled: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);

function selectCategory(category: string) {
  emit('update:modelValue', category);
  isOpen.value = false;
}
</script>

<template>
  <div class="relative min-w-0 flex-1">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold outline-none disabled:opacity-60"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="isOpen = !isOpen"
    >
      <span class="truncate">{{ modelValue }}</span>
      <ChevronDown
        class="h-4 w-4 shrink-0 text-dm-gray-dark transition-transform"
        :class="isOpen && 'rotate-180'"
      />
    </button>

    <template v-if="isOpen">
      <button
        type="button"
        class="fixed inset-0 z-30 cursor-default"
        aria-label="카테고리 목록 닫기"
        @click="isOpen = false"
      />
      <div
        class="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-40 max-h-72 overflow-y-auto scrollbar-none rounded-2xl border border-dm-gray/30 bg-dm-gray-light p-2 shadow-xl"
        role="listbox"
        aria-label="카테고리 선택"
      >
        <section
          v-for="(group, groupIndex) in groups"
          :key="group.mode"
          class="py-1"
          :class="groupIndex > 0 && 'mt-3 border-t border-dm-gray/40 pt-4'"
        >
          <p
            class="mb-2 flex items-center justify-between rounded-2xl px-3 py-1.5 text-[11px] font-bold tracking-wide"
            :class="
              group.mode === 'personal'
                ? 'bg-dm-mint-light text-btn-mt-dark'
                : 'bg-pink-01 text-brand'
            "
          >
            <span>{{ group.label }}</span>
            <span class="text-[10px] font-medium opacity-70">카테고리 그룹</span>
          </p>
          <button
            v-for="option in group.options"
            :key="`${group.mode}-${option}`"
            type="button"
            class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-dm-mint-light"
            :class="
              modelValue === option &&
              (group.mode === 'personal'
                ? 'bg-dm-mint-light font-semibold text-btn-mt-dark'
                : 'bg-pink-01 font-semibold text-brand')
            "
            role="option"
            :aria-selected="modelValue === option"
            @click="selectCategory(option)"
          >
            <span>{{ option }}</span>
            <Check
              v-if="modelValue === option"
              class="h-4 w-4"
              :class="group.mode === 'personal' ? 'text-btn-mt-dark' : 'text-brand'"
              :stroke-width="2.5"
            />
          </button>
        </section>
      </div>
    </template>
  </div>
</template>
