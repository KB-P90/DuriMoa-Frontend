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
    cardClass: string;
    textClass: string;
    subTextClass: string;
    // 카드 hover 시 제목/날짜/금액 텍스트가 흰색으로 반전될지 여부. general은 hover 배경이
    // 옅은 색이라 반전시키면 안 보이므로 텍스트 색을 그대로 둔다.
    textHoverClass: string;
  }
> = {
  main: {
    label: '메인 시안',
    icon: Heart,
    badgeClass: 'bg-white/30 text-white',
    badgeHoverClass: '',
    textClass: 'text-white',
    subTextClass: 'text-white/80',
    cardClass: 'bg-brand-dark',
    cardBorderClass: '',
    cardHoverClass: 'hover:bg-brand/80',
    amountClass: 'text-white',
    textHoverClass: 'group-hover:text-white',
  },
  pending: {
    label: '수락 대기',
    icon: Hourglass,
    badgeClass: 'bg-white/30 text-white',
    badgeHoverClass: '',
    cardBorderClass: 'border-dm-mint-dark/70',
    cardClass: 'bg-dm-mint-darker',
    cardHoverClass: 'hover:bg-dm-mint-darker/80',
    amountClass: 'text-white',
    textClass: 'text-white',
    subTextClass: 'text-white/80',
    textHoverClass: 'group-hover:text-white',
  },
  general: {
    label: '일반',
    icon: null,
    badgeClass: 'bg-dm-gray-dark text-white',
    cardClass: 'bg-white',
    badgeHoverClass: '',
    cardBorderClass: 'border-dm-gray/25',
    cardHoverClass: 'hover:border-dm-gray-light hover:bg-dm-gray-light',
    amountClass: 'text-[#232631]',
    textClass: 'text-[#232631]',
    subTextClass: 'text-dm-gray-dark',
    textHoverClass: '',
  },
  incoming: {
    label: '수락 요청',
    icon: BellRing,
    badgeClass: 'bg-white/30 text-brand-dark',
    badgeHoverClass: 'group-hover:text-white',
    cardBorderClass: 'border-pink-03/50',
    cardClass: 'bg-pink-03/70',
    cardHoverClass: 'hover:border-pink-03-dark hover:bg-brand-dark',
    amountClass: 'text-[#232631]',
    textClass: 'text-[#232631]',
    subTextClass: 'text-dm-gray-dark',
    textHoverClass: 'group-hover:text-white',
  },
};
</script>

<template>
  <article
    class="group cursor-pointer rounded-2xl border-2 p-4 transition-colors shadow-md"
    :class="[
      STATUS_META[proposal.status].cardBorderClass,
      STATUS_META[proposal.status].cardClass,
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
        class="text-lg font-bold transition-colors"
        :class="[
          STATUS_META[proposal.status].textClass,
          STATUS_META[proposal.status].textHoverClass,
        ]"
      >
        {{ proposal.title }}
      </h3>

      <Button
        v-if="proposal.status === 'pending'"
        type="button"
        variant="outline"
        class="h-8 shrink-0 cursor-pointer rounded-full border-white/60 px-4 text-xs font-semibold text-dm-mint-darker shadow-none transition-colors hover:border-white hover:bg-white hover:text-dm-mint-dark group-hover:border-white group-hover:bg-white group-hover:text-dm-mint-dark"
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
        class="h-8 shrink-0 cursor-pointer rounded-full bg-white px-4 text-xs font-semibold text-brand-dark shadow-none transition-colors"
        @click.stop="$emit('review', proposal.id)"
      >
        확인하기
      </Button>
    </div>

    <div class="mt-2 flex items-center justify-between">
      <p
        class="text-sm transition-colors"
        :class="[
          STATUS_META[proposal.status].subTextClass,
          STATUS_META[proposal.status].textHoverClass,
        ]"
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
          class="ml-0.5 text-xs font-medium transition-colors"
          :class="[
            STATUS_META[proposal.status].subTextClass,
            STATUS_META[proposal.status].textHoverClass,
          ]"
        >
          만원
        </span>
      </p>
    </div>

    <template v-if="proposal.status === 'pending'">
      <Separator class="my-3 transition-colors group-hover:bg-white/40" />
      <p class="text-sm font-semibold text-white transition-colors group-hover:text-white">
        상대방의 수락을 기다리고 있어요
      </p>
    </template>
  </article>
</template>
