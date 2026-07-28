<script setup lang="ts">
import AuthHeader from '@/components/auth/AuthHeader.vue';
import AuthScreen from '@/components/auth/AuthScreen.vue';
import { useTermDetail } from '@/composables/useTermDetail';

const { term, goBack } = useTermDetail();
</script>

<template>
  <AuthScreen scrollable>
    <AuthHeader
      :title="term.title"
      @back="goBack"
    />

    <article class="term-view">
      <section class="term-view__summary">
        <span
          class="term-view__icon"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24">
            <path d="M7 3h7l4 4v14H7z" />
            <path d="M14 3v5h5M10 12h5M10 16h5" />
          </svg>
        </span>
        <div>
          <h2>{{ term.title }}</h2>
          <p>시행일자 {{ term.effectiveDate }}</p>
          <p>최종 업데이트 {{ term.updatedDate }}</p>
        </div>
      </section>

      <p class="term-view__intro">{{ term.summary }}</p>

      <section
        v-for="section in term.sections"
        :key="section.heading"
        class="term-view__section"
      >
        <h2>{{ section.heading }}</h2>
        <p
          v-for="paragraph in section.paragraphs"
          :key="paragraph"
        >
          {{ paragraph }}
        </p>
      </section>
    </article>
  </AuthScreen>
</template>

<style scoped>
.term-view {
  padding: 15px 21px 32px;
  color: var(--auth-body);
}

.term-view__summary {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--auth-line);
  border-radius: 18px;
  background: #fff;
  box-shadow: var(--auth-shadow);
}

.term-view__icon {
  display: grid;
  width: 50px;
  height: 50px;
  flex: 0 0 50px;
  place-items: center;
  border-radius: 50%;
  background: var(--auth-primary-soft);
  color: var(--auth-primary);
}

.term-view__icon svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.term-view__summary h2 {
  margin: 0 0 7px;
  color: var(--auth-ink);
  font-size: 16px;
  font-weight: 850;
}

.term-view__summary p {
  margin: 2px 0 0;
  color: #8f95a2;
  font-size: 11px;
  line-height: 1.4;
}

.term-view__intro {
  margin: 23px 0 -1px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fafafb;
  color: #7a808d;
  font-size: 11px;
  line-height: 1.6;
}

.term-view__section {
  padding: 22px 0;
  border-bottom: 1px solid #eef0f3;
}

.term-view__section h2 {
  margin: 0 0 15px;
  color: var(--auth-ink);
  font-size: 14px;
  font-weight: 850;
  letter-spacing: -0.02em;
}

.term-view__section p {
  margin: 8px 0 0;
  color: #5d6371;
  font-size: 12px;
  line-height: 1.75;
  word-break: keep-all;
}
</style>
