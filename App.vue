<script setup>
import { ConfigProvider } from 'reka-ui';
import { Toaster } from '@/components/ui/sonner';
</script>

<template>
  <ConfigProvider :scroll-body="false">
    <RouterView />
    <Toaster position="top-center" />
  </ConfigProvider>
</template>
