<script setup lang="ts">
defineProps<{
  title: string;
}>();

defineEmits<{
  back: [];
}>();
</script>

<template>
  <header class="auth-header">
    <button
      class="auth-header__back"
      type="button"
      :aria-label="`${title}에서 이전 화면으로 이동`"
      @click="$emit('back')"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
    <h1>{{ title }}</h1>
    <span aria-hidden="true"></span>
  </header>
</template>

<style scoped>
.auth-header {
  position: sticky;
  z-index: 5;
  top: 0;
  display: grid;
  height: 54px;
  flex: 0 0 54px;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  padding: 0 14px;
  border-bottom: 1px solid #f0f1f4;
  background: rgb(255 255 255 / 94%);
  backdrop-filter: blur(12px);
}

.auth-header h1 {
  margin: 0;
  color: var(--auth-ink);
  font-size: 16px;
  font-weight: 850;
  letter-spacing: -0.025em;
  text-align: center;
}

.auth-header__back {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #292d38;
  cursor: pointer;
}

.auth-header__back:hover {
  background: #f6f6f8;
}

.auth-header__back svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.2;
}
</style>
