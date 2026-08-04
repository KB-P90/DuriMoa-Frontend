<script setup lang="ts">
import { Separator } from '@/components/ui/separator';
import { formatAmount, formatSignedAmount } from '@/utils/format';

defineProps<{
  proposal: { title: string; amount: number };
  diffFromCurrentMain: number;
  monthlySaving: { before: number; after: number };
}>();
</script>

<template>
  <div class="rounded-2xl border border-dm-co/30 bg-dm-cb-light p-4">
    <div class="flex items-center justify-between gap-3">
      <span
        class="truncate rounded-full bg-dm-cb px-3 py-1.5 text-sm font-semibold text-dm-co-darker"
      >
        {{ proposal.title }}
      </span>
      <p class="whitespace-nowrap">
        <span class="text-base font-extrabold text-[#232631]">{{
          formatAmount(proposal.amount)
        }}</span>
        <span class="ml-0.5 text-xs font-medium text-dm-gray-dark">만원</span>
      </p>
    </div>

    <Separator class="my-3 bg-dm-co/20" />

    <dl class="space-y-2 text-sm">
      <div class="flex items-center justify-between">
        <dt class="text-dm-gray-dark">현재 메인과 차이</dt>
        <dd class="font-bold text-dm-co-darker">
          {{ formatSignedAmount(diffFromCurrentMain, '만원') }}
        </dd>
      </div>
      <div class="flex items-center justify-between">
        <dt class="text-dm-gray-dark">월 저축 목표</dt>
        <dd class="font-bold text-[#232631]">
          월 {{ formatAmount(monthlySaving.before) }} → {{ formatAmount(monthlySaving.after) }} 만원
        </dd>
      </div>
    </dl>
  </div>
</template>
