<script setup lang="ts">
import { useCalendar } from '@/composables/useCalendar';
import CalendarView from '@/views/CalendarView.vue';
import TransactionEditView from '@/views/TransactionEditView.vue';

const {
  mode,
  selectedDate,
  selectedDateLabel,
  selectedTransaction,
  isEditorOpen,
  calendarDays,
  monthLabel,
  summary,
  transactions,
  isLoading,
  isSubmitting,
  selectDate,
  changeMonth,
  openCreateTransaction,
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
    :days="calendarDays"
    :summary="summary"
    :transactions="transactions"
    :is-loading="isLoading"
    @update:mode="mode = $event"
    @select-date="selectDate"
    @change-month="changeMonth"
    @select-transaction="selectTransaction"
    @create-transaction="openCreateTransaction"
  />
</template>
