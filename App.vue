<script setup lang="ts">
import { ref } from 'vue';
import { useCalendar } from '@/composables/useCalendar';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import CalendarView from '@/views/CalendarView.vue';
import TransactionEditView from '@/views/TransactionEditView.vue';

// TODO: 라우터 연결 전 캘린더 화면 확인용
const active = ref('calendar');
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
  <DefaultLayout :active="active" @select="active = $event">
    <TransactionEditView
      v-if="active === 'calendar' && selectedTransaction"
      :transaction="selectedTransaction"
      @close="closeTransaction"
      @delete="closeTransaction"
      @save="closeTransaction"
    />
    <CalendarView
      v-else-if="active === 'calendar'"
      :mode="mode"
      :selected-date="selectedDate"
      :days="calendarDays"
      :summary="summary"
      :transactions="transactions"
      @update:mode="mode = $event"
      @select-date="selectedDate = $event"
      @select-transaction="selectTransaction"
    />
    <div v-else class="p-4">
      <h1 class="text-lg font-bold">{{ active }} 화면</h1>
    </div>
  </DefaultLayout>
</template>

<style scoped></style>
