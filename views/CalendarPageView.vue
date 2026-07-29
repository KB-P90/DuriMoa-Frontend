<script setup lang="ts">
import { useCalendar } from '@/composables/useCalendar';
import CalendarView from '@/views/CalendarView.vue';
import TransactionEditView from '@/views/TransactionEditView.vue';

const {
  mode,
  selectedDate,
  selectedTransaction,
  calendarDays,
  summary,
  transactions,
  selectTransaction,
  closeTransaction,
} = useCalendar();
</script>

<template>
  <TransactionEditView
    v-if="selectedTransaction"
    :transaction="selectedTransaction"
    @close="closeTransaction"
    @delete="closeTransaction"
    @save="closeTransaction"
  />
  <CalendarView
    v-else
    :mode="mode"
    :selected-date="selectedDate"
    :days="calendarDays"
    :summary="summary"
    :transactions="transactions"
    @update:mode="mode = $event"
    @select-date="selectedDate = $event"
    @select-transaction="selectTransaction"
  />
</template>
