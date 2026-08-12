<script setup lang="ts">
import { computed } from 'vue';
import { formatClockTime } from '@/utils/format';
import { visualForNotificationType } from '@/utils/notification';

const props = defineProps<{
  type: string;
  partnerName: string;
  message: string;
  occurredAt: string;
}>();

const visual = computed(() => visualForNotificationType(props.type));
</script>

<template>
  <div
    class="flex w-full items-start gap-3 rounded-2xl border border-dm-gray/10 bg-white p-3 shadow-[0_8px_24px_-8px_rgba(34,34,43,0.25)]"
  >
    <span
      class="grid h-9 w-9 shrink-0 place-items-center rounded-full text-base"
      :class="visual.circleClass"
    >
      {{ visual.icon }}
    </span>
    <div class="min-w-0 flex-1">
      <div class="flex items-center justify-between gap-2">
        <strong class="truncate text-sm font-bold text-[#232631]">{{ partnerName }}</strong>
        <span class="shrink-0 text-xs text-dm-gray-dark">{{ formatClockTime(occurredAt) }}</span>
      </div>
      <p class="mt-0.5 truncate text-sm text-dm-gray-dark">{{ partnerName }}: {{ message }}</p>
    </div>
  </div>
</template>
