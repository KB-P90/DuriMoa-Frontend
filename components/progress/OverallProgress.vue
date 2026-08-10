<script setup lang="ts">
import CategoryCheck from '@/components/progress/CategoryCheck.vue';
import CoupleAchievement from '@/components/progress/CoupleAchievement.vue';
</script>

<template>
  <div class="flex flex-col pt-4 gap-8">
    <CoupleAchievement show-detail />
    <CategoryCheck />
  </div>
</template>
