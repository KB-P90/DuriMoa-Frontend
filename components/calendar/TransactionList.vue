<script setup lang="ts">
import {
  Banknote,
  Brush,
  Building2,
  Camera,
  CircleDollarSign,
  Gift,
  HandHeart,
  House,
  Landmark,
  Package,
  Pencil,
  PiggyBank,
  ShieldAlert,
  Shirt,
  ShoppingBag,
  Ticket,
  Utensils,
} from '@lucide/vue';
import type { Component } from 'vue';
import type { Transaction, TransactionType } from '@/types/calendar';
import { formatWonAmount } from '@/utils/format';

defineProps<{ transactions: readonly Transaction[] }>();
const emit = defineEmits<{ select: [transaction: Transaction] }>();

const TRANSACTION_ICONS: Record<TransactionType, Component> = {
  income: Banknote,
  expense: Utensils,
  saving: Landmark,
};

const CATEGORY_ICONS: Record<string, Component> = {
  급여: Banknote,
  부수입: CircleDollarSign,
  기타: Package,
  축의금: Gift,
  식비: Utensils,
  생활: House,
  쇼핑: ShoppingBag,
  '문화/여가': Ticket,
  예식장: Building2,
  스튜디오: Camera,
  메이크업: Brush,
  드레스: Shirt,
  예비비: ShieldAlert,
  저축: PiggyBank,
  '결혼 자금': HandHeart,
};

const TYPE_COLORS: Record<TransactionType, string> = {
  income: 'text-[#65C466]',
  expense: 'text-brand',
  saving: 'text-[#3B86F7]',
};
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-dm-gray/30 bg-background">
    <button
      v-for="transaction in transactions"
      :key="transaction.id"
      type="button"
      class="flex w-full items-center gap-3 border-b border-dm-gray/30 px-4 py-3.5 text-left last:border-b-0"
      :class="transaction.isMine && 'cursor-pointer'"
      @click="emit('select', transaction)"
    >
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dm-gray/15"
        :class="TYPE_COLORS[transaction.type]"
      >
        <component
          :is="CATEGORY_ICONS[transaction.title] ?? TRANSACTION_ICONS[transaction.type]"
          class="h-5 w-5"
          :stroke-width="1.8"
        />
      </span>
      <span class="min-w-0 flex-1">
        <span class="flex min-w-0 items-center gap-1.5">
          <strong class="truncate text-sm font-semibold text-gray-800"
            >{{ transaction.title }} {{ transaction.memo ? ' · ' + transaction.memo : '' }}
          </strong>
        </span>

        <span class="flex gap-2">
          <small class="mt-0.5 block text-xs text-dm-gray-dark">
            {{ transaction.category }} · {{ transaction.owner }}
          </small>
          <span
            v-if="transaction.isUserCreated"
            class="px-2 py-1 flex shrink-0 items-center justify-center rounded-full bg-dm-gray-light text-dm-gray-dark"
            title="직접 입력한 내역"
            aria-label="직접 입력한 내역"
          >
            <Pencil
              class="h-2.5 w-2.5"
              :stroke-width="2"
              aria-hidden="true"
            />
            <p class="pl-1 text-xs">직접 추가</p>
          </span></span
        >
      </span>
      <strong
        class="shrink-0 text-sm font-semibold tracking-tight"
        :class="TYPE_COLORS[transaction.type]"
      >
        {{ formatWonAmount(transaction.amount) }}
      </strong>
    </button>
  </div>
</template>
