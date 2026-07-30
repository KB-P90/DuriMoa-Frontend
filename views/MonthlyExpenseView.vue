<script setup lang="ts">
import CategoryExpenseChart from '@/components/expense/CategoryExpenseChart.vue';
import SavingMissionList from '@/components/expense/SavingMissionList.vue';
</script>

<template>
  <div>
    <header>
      <h1>7월 지출 관리</h1>
    </header>

    <CategoryExpenseChart />

    <SavingMissionList />
  </div>
</template>
