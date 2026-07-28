<script setup lang="ts">
import '@/assets/auth.css';

defineProps<{
  scrollable?: boolean;
}>();
</script>

<template>
  <main class="auth-stage">
    <section
      class="auth-device"
      :class="{ 'auth-device--scrollable': scrollable }"
    >
      <div
        class="auth-status-bar"
        aria-hidden="true"
      >
        <span>9:41</span>
        <span class="auth-status-icons"> <i></i><i></i><i></i><b></b> </span>
      </div>
      <div class="auth-device__content">
        <slot />
      </div>
    </section>
  </main>
</template>

<style scoped>
.auth-stage {
  display: block;
  width: 100%;
  min-height: 100dvh;
  padding: 0;
  background: #fff;
  color: var(--auth-ink);
  font-family:
    Pretendard,
    'Pretendard Variable',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-synthesis: none;
  line-height: 1.5;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.auth-stage,
.auth-stage * {
  box-sizing: border-box;
}

.auth-stage :is(button, input) {
  font: inherit;
}

.auth-device {
  display: flex;
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;
  flex-direction: column;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: #fff;
  box-shadow: none;
}

.auth-status-bar {
  display: flex;
  height: 30px;
  flex: 0 0 30px;
  align-items: center;
  justify-content: space-between;
  padding: 0 21px;
  background: #fff;
  color: #222631;
  font-size: 11px;
  font-weight: 800;
}

.auth-status-icons {
  display: flex;
  align-items: flex-end;
  gap: 3px;
}

.auth-status-icons i {
  display: block;
  width: 3px;
  border-radius: 2px;
  background: #252936;
}

.auth-status-icons i:nth-child(1) {
  height: 4px;
}

.auth-status-icons i:nth-child(2) {
  height: 6px;
}

.auth-status-icons i:nth-child(3) {
  height: 8px;
}

.auth-status-icons b {
  width: 17px;
  height: 8px;
  margin-left: 5px;
  border: 1.5px solid #252936;
  border-radius: 2px;
}

.auth-device__content {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
}

.auth-device--scrollable .auth-device__content {
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
}

.auth-device--scrollable .auth-device__content::-webkit-scrollbar {
  display: none;
}
</style>
