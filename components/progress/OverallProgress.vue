<script setup lang="ts">
import CategoryCheck from '@/components/progress/CategoryCheck.vue';
import CoupleAchievement from '@/components/progress/CoupleAchievement.vue';
</script>

<template>
  <div class="flex flex-col gap-10 px-4 py-8">
    <CoupleAchievement show-detail />
    <CategoryCheck />
  </div>
</template>
