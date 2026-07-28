<script setup lang="ts">
import { AUTH_ROUTE_NAMES, TERM_DOCUMENTS, TERM_ORDER } from '@/constants/auth';
import type { TermId } from '@/types/auth';

defineProps<{
  agreements: Record<TermId, boolean>;
  allAgreed: boolean;
}>();

defineEmits<{
  'update:all': [agreed: boolean];
  'update:term': [termId: TermId, agreed: boolean];
}>();
</script>

<template>
  <fieldset class="agreement-card">
    <legend class="auth-sr-only">약관 동의</legend>
    <label class="agreement-card__all">
      <input
        type="checkbox"
        :checked="allAgreed"
        @change="$emit('update:all', ($event.target as HTMLInputElement).checked)"
      />
      <span
        class="agreement-card__check"
        aria-hidden="true"
        >✓</span
      >
      <strong>약관 전체 동의</strong>
    </label>
    <div class="agreement-card__divider"></div>
    <div
      v-for="termId in TERM_ORDER"
      :key="termId"
      class="agreement-card__row"
    >
      <label>
        <input
          type="checkbox"
          :checked="agreements[termId]"
          @change="$emit('update:term', termId, ($event.target as HTMLInputElement).checked)"
        />
        <span
          class="agreement-card__check agreement-card__check--small"
          aria-hidden="true"
          >✓</span
        >
        <span>{{ TERM_DOCUMENTS[termId].title }}</span>
        <em :class="{ 'agreement-card__tag--optional': !TERM_DOCUMENTS[termId].required }">
          {{ TERM_DOCUMENTS[termId].required ? '필수' : '선택' }}
        </em>
      </label>
      <RouterLink
        class="agreement-card__view"
        :to="{ name: AUTH_ROUTE_NAMES.TERM_DETAIL, params: { termId } }"
        :aria-label="`${TERM_DOCUMENTS[termId].title} 전문 보기`"
      >
        보기
        <span aria-hidden="true">›</span>
      </RouterLink>
    </div>
  </fieldset>
</template>

<style scoped>
.agreement-card {
  min-width: 0;
  margin: 0;
  padding: 14px;
  border: 1px solid var(--auth-line);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 7px 18px rgb(40 43 53 / 7%);
}

.agreement-card label {
  cursor: pointer;
}

.agreement-card input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.agreement-card__all {
  display: flex;
  align-items: center;
  gap: 9px;
}

.agreement-card__all strong {
  color: var(--auth-ink);
  font-size: 14px;
  font-weight: 850;
}

.agreement-card__divider {
  height: 1px;
  margin: 12px 0 9px;
  background: #f0f1f4;
}

.agreement-card__row {
  display: flex;
  min-height: 34px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.agreement-card__row label {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 7px;
  color: #5d6270;
  font-size: 12px;
}

.agreement-card__check {
  display: grid;
  width: 21px;
  height: 21px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #dfe1e7;
  border-radius: 7px;
  background: #fff;
  color: transparent;
  font-size: 13px;
  font-style: normal;
  font-weight: 900;
}

input:checked + .agreement-card__check {
  border-color: var(--auth-primary);
  background: var(--auth-primary);
  color: #fff;
}

.agreement-card__check--small {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  font-size: 11px;
}

.agreement-card em {
  padding: 2px 6px;
  border-radius: 999px;
  background: #ffe2df;
  color: #e6766e;
  font-size: 9px;
  font-style: normal;
  font-weight: 800;
}

.agreement-card em.agreement-card__tag--optional {
  background: #f0f1f4;
  color: #969ba7;
}

.agreement-card__view {
  flex: 0 0 auto;
  padding: 6px 0 6px 8px;
  color: #9ca1ac;
  font-size: 11px;
  text-decoration: none;
}

.agreement-card__view span {
  padding-left: 2px;
  font-size: 15px;
}
</style>
