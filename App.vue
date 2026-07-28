<script setup lang="ts">
import { ref } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const active = ref('home');
</script>

<template>
  <RouterView />
</template>
