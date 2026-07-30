<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const route = useRoute();
const router = useRouter();

const active = computed(() => (typeof route.name === 'string' ? route.name : 'calendar'));

function handleSelect(key: string) {
  router.push({ name: key });
}
</script>

<template>
  <DefaultLayout
    :active="active"
    @select="handleSelect"
  >
    <RouterView />
  </DefaultLayout>
</template>
