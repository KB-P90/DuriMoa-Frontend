<script setup lang="ts">
import { LoaderCircle } from '@lucide/vue';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AiWeddingBudgetRecommendationCard from '@/components/ai/AiWeddingBudgetRecommendationCard.vue';
import AiWeddingDatePicker from '@/components/ai/AiWeddingDatePicker.vue';
import { REGIONS } from '@/constants/goal';
import type { AiWeddingBudgetStep, WeddingBudgetRecommendation } from '@/types/aiChat';
import type { RegionName } from '@/types/goal';

const props = defineProps<{
  step: AiWeddingBudgetStep;
  weddingDate: string;
  weddingRegion: RegionName | null;
  recommendation: WeddingBudgetRecommendation | null;
}>();

const emit = defineEmits<{
  'update:weddingDate': [value: string];
  'update:weddingRegion': [value: RegionName];
  confirmDate: [];
  confirmRegion: [];
  apply: [];
}>();

const canConfirmDate = computed(() => {
  if (!props.weddingDate) return false;
  const selectedDate = new Date(`${props.weddingDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate > today;
});

function updateRegion(value: unknown) {
  if (typeof value !== 'string') return;
  if (!REGIONS.includes(value as RegionName)) return;
  emit('update:weddingRegion', value as RegionName);
}
</script>

<template>
  <div
    v-if="step !== 'idle'"
    class="mt-3 flex justify-start"
  >
    <div
      v-if="step === 'selectingDate'"
      class="w-full max-w-sm rounded-2xl rounded-bl-md border border-dm-gray/25 bg-white p-3.5 shadow-sm"
    >
      <p class="mb-2 text-xs font-bold text-gray-800">결혼 예정일</p>
      <AiWeddingDatePicker
        :model-value="weddingDate"
        @update:model-value="emit('update:weddingDate', $event)"
      />
      <Button
        type="button"
        :disabled="!canConfirmDate"
        class="mt-3 h-11 w-full rounded-xl bg-brand text-sm font-extrabold text-white shadow-none hover:bg-brand-dark"
        @click="emit('confirmDate')"
      >
        날짜 선택 완료
      </Button>
    </div>

    <div
      v-else-if="step === 'selectingRegion'"
      class="w-full max-w-sm rounded-2xl rounded-bl-md border border-dm-gray/25 bg-white p-3.5 shadow-sm"
    >
      <p class="mb-2 text-xs font-bold text-gray-800">결혼 예정 지역</p>
      <Select
        :model-value="weddingRegion ?? undefined"
        @update:model-value="updateRegion"
      >
        <SelectTrigger
          class="h-11 rounded-xl border-dm-gray/40 bg-white shadow-none focus:ring-brand/20"
        >
          <SelectValue placeholder="지역을 선택해 주세요" />
        </SelectTrigger>
        <SelectContent class="z-[100]">
          <SelectItem
            v-for="region in REGIONS"
            :key="region"
            :value="region"
          >
            {{ region }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Button
        type="button"
        :disabled="!weddingRegion"
        class="mt-3 h-11 w-full rounded-xl bg-brand text-sm font-extrabold text-white shadow-none hover:bg-brand-dark"
        @click="emit('confirmRegion')"
      >
        이 지역으로 분석하기
      </Button>
    </div>

    <div
      v-else-if="step === 'analyzing'"
      class="flex items-center gap-2 rounded-2xl rounded-bl-md border border-dm-gray/25 bg-white px-3.5 py-3 text-sm text-dm-gray-dark shadow-sm"
    >
      <LoaderCircle class="h-4 w-4 animate-spin text-dm-mint-darker" />
      두 분의 최근 소비와 결혼 비용을 계산하고 있어요...
    </div>

    <AiWeddingBudgetRecommendationCard
      v-else-if="step === 'result' && recommendation"
      :recommendation="recommendation"
      @apply="emit('apply')"
    />
  </div>
</template>
