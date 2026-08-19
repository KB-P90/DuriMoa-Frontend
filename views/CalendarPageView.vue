<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useCalendar } from '@/composables/useCalendar';
import type { Transaction, TransactionForm } from '@/types/calendar';
import CalendarView from '@/views/CalendarView.vue';
import TransactionEditView from '@/views/TransactionEditView.vue';

useAuthCheck();

const {
  mode,
  selectedDate,
  selectedDateLabel,
  selectedTransaction,
  isEditorOpen,
  calendarDays,
  monthLabel,
  expenseAnalysisLabel,
  summary,
  transactions,
  showWeddingEmptyState,
  isLoading,
  isSubmitting,
  selectDate,
  changeMonth,
  openCreateTransaction,
  openExpenseAnalysis,
  selectTransaction,
  closeEditor,
  saveTransaction,
  removeTransaction,
} = useCalendar();

const createCalendarLabel = ref('');

function handleOpenCreateTransaction(calendarLabel: string) {
  createCalendarLabel.value = calendarLabel;
  openCreateTransaction();
}

function handleSelectTransaction(transaction: Transaction) {
  if (!transaction.isMine) {
    toast.error('상대방의 내역은 수정할 수 없어요.');
    return;
  }

  selectTransaction(transaction);
}

async function handleSaveTransaction(form: TransactionForm) {
  const isEditMode = selectedTransaction.value !== null;

  try {
    await saveTransaction(form);
    toast.success(
      isEditMode
        ? '내역이 수정되었어요.'
        : `${createCalendarLabel.value} 캘린더에 내역이 추가되었어요.`
    );
  } catch {
    toast.error('내역 저장에 실패했어요. 다시 시도해주세요.');
  }
}

async function handleRemoveTransaction() {
  try {
    await removeTransaction();
    toast.success('내역이 삭제되었어요.');
  } catch {
    toast.error('내역 삭제에 실패했어요. 다시 시도해주세요.');
  }
}
</script>

<template>
  <TransactionEditView
    v-if="isEditorOpen"
    :transaction="selectedTransaction"
    :default-date="selectedDate"
    :mode="mode"
    :is-submitting="isSubmitting"
    @close="closeEditor"
    @delete="handleRemoveTransaction"
    @save="handleSaveTransaction"
  />
  <CalendarView
    v-else
    :mode="mode"
    :selected-date="selectedDate"
    :selected-date-label="selectedDateLabel"
    :month-label="monthLabel"
    :expense-analysis-label="expenseAnalysisLabel"
    :days="calendarDays"
    :summary="summary"
    :transactions="transactions"
    :show-wedding-empty-state="showWeddingEmptyState"
    :is-loading="isLoading"
    @update:mode="mode = $event"
    @select-date="selectDate"
    @change-month="changeMonth"
    @select-transaction="handleSelectTransaction"
    @create-transaction="handleOpenCreateTransaction"
    @view-expense-analysis="openExpenseAnalysis"
  />
</template>
