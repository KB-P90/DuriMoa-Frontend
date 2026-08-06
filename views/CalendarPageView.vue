<script setup lang="ts">
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useCalendar } from '@/composables/useCalendar';
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
</script>

<template>
  <TransactionEditView
    v-if="isEditorOpen"
    :transaction="selectedTransaction"
    :default-date="selectedDate"
    :mode="mode"
    :is-submitting="isSubmitting"
    @close="closeEditor"
    @delete="removeTransaction"
    @save="saveTransaction"
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
    @select-transaction="selectTransaction"
    @create-transaction="openCreateTransaction"
    @view-expense-analysis="openExpenseAnalysis"
  />
</template>
