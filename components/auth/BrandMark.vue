<template>
  <div class="brand-mark">
    <span
      class="brand-mark__ring"
      aria-hidden="true"
      >💍</span
    >
    <strong>두리모아</strong>
    <p>결혼 준비에 필요한 만큼만<br />함께 보고 함께 모아요</p>
  </div>
</template>

<style scoped>
.brand-mark {
  text-align: center;
}

.brand-mark__ring {
  display: block;
  font-size: 34px;
  line-height: 1;
  transform: rotate(-9deg);
}

.brand-mark strong {
  display: block;
  margin-top: 13px;
  color: var(--auth-ink);
  font-size: 25px;
  font-weight: 900;
  letter-spacing: -0.055em;
}

.brand-mark p {
  margin: 8px 0 0;
  color: var(--auth-muted);
  font-size: 12px;
  line-height: 1.55;
}
</style>
