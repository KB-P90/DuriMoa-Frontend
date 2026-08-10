<script setup lang="ts">
import { ArrowLeft, Banknote, Landmark, Utensils } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';
import CategorySelect from '@/components/calendar/CategorySelect.vue';
import DeleteConfirmDialog from '@/components/calendar/DeleteConfirmDialog.vue';
import { CALENDAR_CATEGORIES, TRANSACTION_TYPES } from '@/constants/calendar';
import type { CalendarMode, Transaction, TransactionForm, TransactionType } from '@/types/calendar';
import { formatAmount, parseFormattedAmount } from '@/utils/format';

const props = defineProps<{
  transaction: Transaction | null;
  defaultDate: string;
  mode: CalendarMode;
  isSubmitting: boolean;
}>();
const emit = defineEmits<{
  close: [];
  delete: [];
  save: [form: TransactionForm];
}>();

const selectedType = ref<TransactionType>(props.transaction?.type ?? 'expense');
const category = ref(props.transaction?.title ?? '');
const amount = ref(props.transaction ? formatAmount(props.transaction.amount) : '');
const recordDate = ref(props.transaction?.date ?? props.defaultDate);
const memo = ref(props.transaction?.memo ?? '');
const deleteConfirmationVisible = ref(false);
const isEditMode = computed(() => props.transaction !== null);
const categoryGroups = computed(() => {
  const otherMode: CalendarMode = props.mode === 'personal' ? 'wedding' : 'personal';
  const modeLabels: Record<CalendarMode, string> = {
    personal: '개인 카테고리',
    wedding: '결혼 카테고리',
  };

  return [
    {
      mode: props.mode,
      label: modeLabels[props.mode],
      options: CALENDAR_CATEGORIES[props.mode][selectedType.value],
    },
    {
      mode: otherMode,
      label: modeLabels[otherMode],
      options: CALENDAR_CATEGORIES[otherMode][selectedType.value],
    },
  ];
});
const categoryOptions = computed(() => categoryGroups.value.flatMap((group) => group.options));

const TRANSACTION_ICONS: Record<TransactionType, Component> = {
  income: Banknote,
  expense: Utensils,
  saving: Landmark,
};

const TYPE_COLORS: Record<TransactionType, string> = {
  income: 'text-[#65C466]',
  expense: 'text-[#F09488]',
  saving: 'text-[#3B86F7]',
};

watch(
  categoryOptions,
  (options) => {
    if (!options.some((option) => option === category.value)) category.value = options[0];
  },
  { immediate: true }
);

function save() {
  emit('save', {
    type: selectedType.value,
    category: category.value,
    amount: parseFormattedAmount(amount.value),
    recordDate: recordDate.value,
    memo: memo.value.trim(),
  });
}
</script>

<template>
  <div class="mx-auto w-full max-w-xl px-4 pb-6 pt-5 sm:px-5">
    <header class="mb-5 grid grid-cols-3 items-center">
      <button
        type="button"
        class="justify-self-start"
        aria-label="뒤로 가기"
        @click="emit('close')"
      >
        <ArrowLeft class="h-6 w-6" />
      </button>
      <h1 class="whitespace-nowrap text-center text-xl font-semibold text-gray-800">
        {{ isEditMode ? '내역 수정' : '내역 생성' }}
      </h1>
      <button
        v-if="isEditMode"
        type="button"
        class="justify-self-end text-sm font-semibold text-brand"
        :disabled="isSubmitting"
        @click="deleteConfirmationVisible = true"
      >
        삭제
      </button>
    </header>

    <form
      class="space-y-3.5"
      @submit.prevent="save"
    >
      <fieldset :disabled="isSubmitting">
        <legend class="mb-2 text-sm font-semibold">구분</legend>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="type in TRANSACTION_TYPES"
            :key="type.key"
            type="button"
            class="relative rounded-2xl border py-3.5 text-sm font-semibold"
            :class="
              selectedType === type.key
                ? 'border-dm-mint-dark bg-btn-mt'
                : 'border-dm-gray/30 text-gray-600'
            "
            @click="selectedType = type.key"
          >
            {{ type.label }}
            <span
              v-if="selectedType === type.key"
              class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-dm-mint-dark text-sm text-white"
              >✓</span
            >
          </button>
        </div>
      </fieldset>

      <div class="block">
        <span class="mb-2 block text-sm font-semibold">카테고리</span>
        <span class="flex items-center rounded-2xl border border-dm-gray/30 px-4 py-3">
          <span
            class="mr-3 rounded-lg bg-dm-gray/15 p-2"
            :class="TYPE_COLORS[selectedType]"
          >
            <component
              :is="TRANSACTION_ICONS[selectedType]"
              class="h-4 w-4"
              :stroke-width="1.8"
            />
          </span>
          <CategorySelect
            v-model="category"
            :groups="categoryGroups"
            :disabled="isSubmitting"
          />
        </span>
      </div>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold">금액</span>
        <span class="flex items-center rounded-2xl border border-dm-gray/30 px-4 py-3.5">
          <input
            v-model="amount"
            inputmode="numeric"
            pattern="[0-9,]+"
            class="min-w-0 flex-1 text-right text-base font-semibold outline-none"
            :disabled="isSubmitting"
            required
          />
          <span class="ml-3 text-sm font-medium text-dm-gray-dark">원</span>
        </span>
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold">날짜</span>
        <input
          v-model="recordDate"
          type="date"
          class="w-full rounded-2xl border border-dm-gray/30 px-4 py-3.5 text-sm font-semibold outline-none"
          :disabled="isSubmitting"
          required
        />
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold">메모</span>
        <textarea
          v-model="memo"
          class="h-20 w-full resize-none rounded-2xl border border-dm-gray/30 p-3 text-sm outline-none"
          :disabled="isSubmitting"
        />
      </label>

      <button
        type="submit"
        class="w-full rounded-2xl bg-brand py-3.5 text-base font-semibold text-white disabled:opacity-60"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? '처리 중...' : isEditMode ? '수정하기' : '등록하기' }}
      </button>
      <button
        type="button"
        class="w-full rounded-2xl border border-dm-gray/30 bg-dm-gray-light py-3.5 text-base font-semibold text-gray-600 shadow-sm"
        :disabled="isSubmitting"
        @click="emit('close')"
      >
        취소
      </button>
    </form>

    <DeleteConfirmDialog
      v-if="deleteConfirmationVisible"
      :is-submitting="isSubmitting"
      @cancel="deleteConfirmationVisible = false"
      @confirm="emit('delete')"
    />
  </div>
</template>
