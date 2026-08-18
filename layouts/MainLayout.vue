<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const route = useRoute();
const router = useRouter();

const active = computed(() => (typeof route.name === 'string' ? route.name : 'calendar'));
const hideBottomNav = computed(() => Boolean(route.meta.hideBottomNav));

function handleSelect(key: string) {
  router.push({ name: key });
}
</script>

<template>
  <DefaultLayout
    :active="active"
    :hide-bottom-nav="hideBottomNav"
    @select="handleSelect"
  >
    <RouterView />
  </DefaultLayout>
</template>
