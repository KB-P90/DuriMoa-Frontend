<script setup lang="ts">
// 하단 주요 버튼의 문구와 비활성화 상태다.
withDefaults(
  defineProps<{
    disabled?: boolean;
    label: string;
  }>(),
  {
    disabled: false,
  }
);

// 주요 버튼 클릭을 현재 단계 화면에 전달한다.
defineEmits<{ primary: [] }>();
</script>

<template>
  <footer
    class="shrink-0 border-t border-dm-gray/10 bg-dm-gray-light px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-3 max-[359px]:px-3 sm:px-5"
  >
    <button
      type="button"
      class="h-[54px] w-full rounded-[13px] bg-btn-pk text-[15px] font-extrabold text-dm-gray-light transition enabled:hover:bg-btn-pk-dark disabled:cursor-not-allowed disabled:bg-dm-gray/45 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-btn-pk/30"
      :disabled="disabled"
      @click="$emit('primary')"
    >
      {{ label }}
    </button>
  </footer>
</template>
