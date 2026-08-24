<script setup lang="ts">
import { LoaderCircle } from '@lucide/vue';
import AiSpendingReportCard from '@/components/ai/AiSpendingReportCard.vue';
import type { AiSpendingReportStep, SpendingReport } from '@/types/aiSpendingReport';

defineProps<{
  step: AiSpendingReportStep;
  report: SpendingReport | null;
}>();
</script>

<template>
  <div
    v-if="step !== 'idle'"
    class="mt-3 flex justify-start"
  >
    <div
      v-if="step === 'analyzing'"
      class="flex items-center gap-2 rounded-2xl rounded-bl-md border border-dm-gray/25 bg-white px-3.5 py-3 text-sm text-dm-gray-dark shadow-sm"
    >
      <LoaderCircle class="h-4 w-4 animate-spin text-dm-mint-darker" />
      가입 후 개인 소비 데이터를 계산하고 있어요...
    </div>

    <AiSpendingReportCard
      v-else-if="step === 'result' && report"
      :report="report"
    />
  </div>
</template>
