<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit';
  }>(),
  {
    loading: false,
    disabled: false,
    type: 'button',
  }
);
</script>

<template>
  <button
    class="auth-primary-button"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span
      v-if="loading"
      class="loading-button__spinner"
      aria-hidden="true"
    ></span>
    <slot v-else />
    <span class="auth-sr-only">{{ loading ? '요청 처리 중' : '' }}</span>
  </button>
</template>

<style scoped>
.loading-button__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgb(255 255 255 / 45%);
  border-top-color: #fff;
  border-radius: 50%;
  animation: loading-button-spin 800ms linear infinite;
}

@keyframes loading-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
