<script setup lang="ts">
import type { Component } from 'vue';
import { BellRing, Heart, Hourglass } from 'lucide-vue-next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { BudgetProposalStatus, ProposalCardItem } from '@/types/goal';
import { formatAmount } from '@/utils/format';

defineProps<{ proposal: ProposalCardItem }>();
defineEmits<{
  open: [id: number];
  apply: [id: number];
  cancel: [id: number];
  review: [id: number];
}>();

const STATUS_META: Record<
  BudgetProposalStatus,
  {
    label: string;
    icon: Component | null;
    badgeClass: string;
    badgeHoverClass: string;
    cardBorderClass: string;
    cardHoverClass: string;
    amountClass: string;
    // 카드 hover 시 제목/날짜/금액 텍스트가 흰색으로 반전될지 여부. general은 hover 배경이
    // 옅은 색이라 반전시키면 안 보이므로 텍스트 색을 그대로 둔다.
    textHoverClass: string;
  }
> = {
  main: {
    label: '메인 시안',
    icon: Heart,
    badgeClass: 'bg-dm-co text-white',
    badgeHoverClass: 'group-hover:bg-white group-hover:text-dm-co',
    cardBorderClass: 'border-dm-co/50',
    cardHoverClass: 'hover:border-dm-co hover:bg-dm-co',
    amountClass: 'text-dm-co',
    textHoverClass: 'group-hover:text-white',
  },
  pending: {
    label: '수락 대기',
    icon: Hourglass,
    badgeClass: 'bg-dm-mint-dark text-white',
    badgeHoverClass: 'group-hover:bg-white group-hover:text-dm-mint-dark',
    cardBorderClass: 'border-dm-mint-dark/70',
    cardHoverClass: 'hover:border-dm-mint-dark hover:bg-dm-mint-dark',
    amountClass: 'text-[#232631]',
    textHoverClass: 'group-hover:text-white',
  },
  general: {
    label: '일반',
    icon: null,
    badgeClass: 'bg-dm-gray-dark text-white',
    badgeHoverClass: '',
    cardBorderClass: 'border-dm-gray/25',
    cardHoverClass: 'hover:border-dm-gray-light hover:bg-dm-gray-light',
    amountClass: 'text-[#232631]',
    textHoverClass: '',
  },
  incoming: {
    label: '수락 요청',
    icon: BellRing,
    badgeClass: 'bg-btn-pk/15 text-btn-pk-dark',
    badgeHoverClass: 'group-hover:bg-white group-hover:text-btn-pk-dark',
    cardBorderClass: 'border-btn-pk/50',
    cardHoverClass: 'hover:border-btn-pk-dark hover:bg-btn-pk-dark',
    amountClass: 'text-[#232631]',
    textHoverClass: 'group-hover:text-white',
  },
};
</script>

<template>
  <article
    class="group cursor-pointer rounded-2xl border-2 bg-white p-5 transition-colors"
    :class="[
      STATUS_META[proposal.status].cardBorderClass,
      STATUS_META[proposal.status].cardHoverClass,
    ]"
    @click="$emit('open', proposal.id)"
  >
    <Badge
      variant="outline"
      class="gap-1 border-transparent transition-colors"
      :class="[
        STATUS_META[proposal.status].badgeClass,
        STATUS_META[proposal.status].badgeHoverClass,
      ]"
    >
      <component
        :is="STATUS_META[proposal.status].icon"
        v-if="STATUS_META[proposal.status].icon"
        class="h-3.5 w-3.5"
      />
      {{ STATUS_META[proposal.status].label }}
    </Badge>

    <div class="mt-3 flex items-center justify-between gap-3">
      <h3
        class="text-lg font-bold text-[#232631] transition-colors"
        :class="STATUS_META[proposal.status].textHoverClass"
      >
        {{ proposal.title }}
      </h3>

      <Button
        v-if="proposal.status === 'pending'"
        type="button"
        variant="outline"
        class="h-8 shrink-0 cursor-pointer rounded-full border-dm-mint-dark/60 px-4 text-xs font-semibold text-dm-mint-darker shadow-none transition-colors hover:border-white hover:bg-white hover:text-dm-mint-dark group-hover:border-white group-hover:bg-white group-hover:text-dm-mint-dark"
        @click.stop="$emit('cancel', proposal.id)"
      >
        취소
      </Button>
      <Button
        v-else-if="proposal.status === 'general'"
        type="button"
        variant="outline"
        class="h-8 shrink-0 cursor-pointer rounded-full border-dm-gray/40 px-4 text-xs font-semibold text-dm-gray-dark shadow-none transition-colors hover:border-white hover:bg-white hover:text-dm-gray-dark group-hover:border-white group-hover:bg-white group-hover:text-dm-gray-dark"
        @click.stop="$emit('apply', proposal.id)"
      >
        신청
      </Button>
      <Button
        v-else-if="proposal.status === 'incoming'"
        type="button"
        class="h-8 shrink-0 cursor-pointer rounded-full px-4 text-xs font-semibold shadow-none transition-colors hover:bg-white hover:text-btn-pk-dark group-hover:bg-white group-hover:text-btn-pk-dark"
        @click.stop="$emit('review', proposal.id)"
      >
        확인하기
      </Button>
    </div>

    <div class="mt-2 flex items-center justify-between">
      <p
        class="text-sm text-dm-gray-dark transition-colors"
        :class="STATUS_META[proposal.status].textHoverClass"
      >
        생성일 · {{ proposal.createdAt }}
      </p>
      <p class="whitespace-nowrap">
        <span
          class="text-xl font-extrabold transition-colors"
          :class="[
            STATUS_META[proposal.status].amountClass,
            STATUS_META[proposal.status].textHoverClass,
          ]"
        >
          {{ formatAmount(proposal.amount) }}
        </span>
        <span
          class="ml-0.5 text-xs font-medium text-dm-gray-dark transition-colors"
          :class="STATUS_META[proposal.status].textHoverClass"
        >
          만원
        </span>
      </p>
    </div>

    <template v-if="proposal.status === 'pending'">
      <Separator class="my-3 transition-colors group-hover:bg-white/40" />
      <p class="text-sm font-semibold text-dm-mint-darker transition-colors group-hover:text-white">
        상대방의 수락을 기다리고 있어요
      </p>
    </template>
  </article>
</template>
