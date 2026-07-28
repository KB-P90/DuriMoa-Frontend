<script setup lang="ts">
import { ref } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const active = ref('home');
</script>

<template>
  <DefaultLayout
    :active="active"
    @select="active = $event"
  >
    <div class="p-4">
      <h1 class="text-lg font-bold">{{ active }} 화면</h1>
    </div>
  </DefaultLayout>
</template>
