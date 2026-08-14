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
  Package,
  PiggyBank,
  ShieldAlert,
  Shirt,
  ShoppingBag,
  Ticket,
  Utensils,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import type { Component } from 'vue';
import DeleteConfirmDialog from '@/components/calendar/DeleteConfirmDialog.vue';
import CalendarDatePicker from '@/components/common/CalendarDatePicker.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { Button } from '@/components/ui/button';
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
const MAX_AMOUNT_DIGITS = 10;
const isFormValid = computed(() => {
  const parsedAmount = parseFormattedAmount(amount.value);

  return (
    Boolean(selectedType.value) &&
    Boolean(category.value) &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    Boolean(recordDate.value)
  );
});
const categoryGroups = computed(() => [
  {
    mode: 'personal' as const,
    label: '개인 카테고리',
    options: CALENDAR_CATEGORIES.personal[selectedType.value],
  },
  {
    mode: 'wedding' as const,
    label: '결혼 카테고리',
    options: CALENDAR_CATEGORIES.wedding[selectedType.value],
  },
]);

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

const CATEGORY_ICON_COLORS: Record<string, string> = {
  '급여': 'text-deep-blue',
  '부수입': 'text-dm-mint-darker',
  '기타': 'text-dm-gray-dark',
  '축의금': 'text-brand',
  '식비': 'text-pink-05',
  '생활': 'text-deep-green',
  '쇼핑': 'text-blue',
  '문화/여가': 'text-sky-09',
  '예식장': 'text-brand-dark',
  '스튜디오': 'text-deep-blue',
  '메이크업': 'text-pink-06',
  '드레스': 'text-pink-05',
  '예비비': 'text-red',
  '저축': 'text-dm-mint-darker',
  '결혼 자금': 'text-brand',
};

// TODO: 수입·저축 색상 토큰 등록 검토
const TRANSACTION_TYPE_STYLES: Record<TransactionType, string> = {
  income: 'border-[#65C466] bg-[#65C466]/10 text-[#65C466]',
  expense: 'border-brand bg-pink-01 text-brand',
  saving: 'border-[#3B86F7] bg-[#3B86F7]/10 text-[#3B86F7]',
};

function selectType(type: TransactionType) {
  if (selectedType.value === type) return;
  selectedType.value = type;
  category.value = '';
}

function handleAmountInput(event: Event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;

  const digits = input.value.replace(/\D/g, '').slice(0, MAX_AMOUNT_DIGITS);
  const formattedAmount = digits ? formatAmount(Number(digits)) : '';

  amount.value = formattedAmount;
  input.value = formattedAmount;
}

function save() {
  if (!isFormValid.value) return;

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
  <div
    class="fixed inset-0 z-[60] mx-auto w-full max-w-[768px] overflow-y-auto bg-background pb-6"
  >
    <div class="relative">
      <PageHeader
        :title="isEditMode ? '내역 수정' : '내역 생성'"
        :on-back="() => emit('close')"
        :show-back="true"
      />
      <button
        v-if="isEditMode"
        type="button"
        class="absolute right-4 top-0 flex h-[50px] items-center text-sm font-semibold text-brand"
        :disabled="isSubmitting"
        @click="deleteConfirmationVisible = true"
      >
        삭제
      </button>
    </div>

    <form
      class="space-y-5 px-4 pb-20 pt-5 sm:px-5"
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
                ? TRANSACTION_TYPE_STYLES[type.key]
                : 'border-dm-gray/30 text-gray-600'
            "
            @click="selectType(type.key)"
          >
            {{ type.label }}
          </button>
        </div>
      </fieldset>

      <fieldset :disabled="isSubmitting">
        <legend class="sr-only">카테고리</legend>
        <section
          v-for="(group, groupIndex) in categoryGroups"
          :key="group.mode"
          :class="groupIndex > 0 && 'mt-4'"
        >
          <p
            class="mb-2 text-xs font-semibold"
            :class="
              group.mode === 'personal'
                ? 'text-btn-mt-dark'
                : 'text-brand-dark'
            "
          >
            {{ group.label }}
          </p>
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="option in group.options"
              :key="`${group.mode}-${option}`"
              type="button"
              variant="outline"
              class="h-10 min-w-0 flex-row gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              :class="
                group.mode === 'personal'
                  ? category === option
                    ? 'border-dm-mint-darker bg-dm-mint-darker text-white hover:bg-dm-mint-darker hover:text-white'
                    : 'border-dm-gray/30 bg-white text-dm-gray-dark hover:border-dm-mint-dark hover:bg-white hover:text-btn-mt-dark'
                  : category === option
                    ? 'border-brand bg-brand text-white hover:bg-brand hover:text-white'
                    : 'border-dm-gray/30 bg-white text-dm-gray-dark hover:border-pink-04 hover:bg-white hover:text-brand-dark'
              "
              :aria-pressed="category === option"
              @click="category = option"
            >
              <span
                class="grid h-5 w-5 place-items-center transition-colors"
                :class="
                  category === option ? 'text-white' : CATEGORY_ICON_COLORS[option]
                "
                aria-hidden="true"
              >
                <component
                  :is="CATEGORY_ICONS[option]"
                  class="h-3.5 w-3.5"
                  :stroke-width="2"
                />
              </span>
              <span class="whitespace-nowrap">{{ option }}</span>
            </Button>
          </div>
        </section>
      </fieldset>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold">금액</span>
        <span class="flex items-center rounded-2xl border border-dm-gray/30 px-4 py-3.5">
          <input
            :value="amount"
            inputmode="numeric"
            pattern="[0-9,]+"
            maxlength="13"
            class="min-w-0 flex-1 text-right text-base font-semibold outline-none"
            :disabled="isSubmitting"
            required
            @input="handleAmountInput"
          />
          <span class="ml-3 text-sm font-medium text-dm-gray-dark">원</span>
        </span>
      </label>

      <div>
        <label
          class="mb-2 block text-sm font-semibold"
          for="transaction-record-date"
        >
          날짜
        </label>
        <CalendarDatePicker
          id="transaction-record-date"
          v-model="recordDate"
          title="날짜 선택"
          :allow-past="true"
          :disabled="isSubmitting"
        />
      </div>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold">메모</span>
        <textarea
          v-model="memo"
          class="h-20 w-full resize-none rounded-2xl border border-dm-gray/30 p-3 text-sm outline-none"
          :disabled="isSubmitting"
        />
      </label>

      <div
        class="fixed inset-x-0 bottom-[env(safe-area-inset-bottom)] z-40 mx-auto w-full max-w-xl bg-white px-4 pb-5 pt-2 sm:px-5"
      >
        <button
          type="submit"
          class="w-full rounded-2xl bg-brand py-3.5 text-base font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:bg-pink-03 disabled:text-white"
          :disabled="isSubmitting || !isFormValid"
        >
          {{ isSubmitting ? '처리 중...' : isEditMode ? '수정하기' : '등록하기' }}
        </button>
      </div>
    </form>

    <DeleteConfirmDialog
      v-if="deleteConfirmationVisible"
      :is-submitting="isSubmitting"
      @cancel="deleteConfirmationVisible = false"
      @confirm="emit('delete')"
    />
  </div>
</template>
