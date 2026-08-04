<script setup lang="ts">
defineProps<{ isSubmitting: boolean }>();

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/40 px-6"
      role="presentation"
      @click.self="emit('cancel')"
    >
      <section
        class="w-full max-w-xs rounded-3xl border border-dm-gray/30 bg-dm-gray-light p-5 text-center shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
      >
        <h2
          id="delete-confirm-title"
          class="text-base font-semibold text-gray-800"
        >
          정말 삭제하시겠습니까?
        </h2>
        <div class="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            class="rounded-2xl border border-dm-gray/30 bg-dm-gray-light py-3 text-sm font-semibold text-dm-gray-dark"
            :disabled="isSubmitting"
            @click="emit('cancel')"
          >
            아니오
          </button>
          <button
            type="button"
            class="rounded-2xl bg-btn-pk py-3 text-sm font-semibold text-white disabled:opacity-60"
            :disabled="isSubmitting"
            @click="emit('confirm')"
          >
            {{ isSubmitting ? '삭제 중...' : '예' }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
