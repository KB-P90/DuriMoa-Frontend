<script setup lang="ts">
import { CalendarHeart, FilePenLine } from '@lucide/vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const open = defineModel<boolean>('open', { default: false });
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogContent class="gap-0 rounded-3xl border-0 p-5 sm:p-6">
      <AlertDialogHeader>
        <AlertDialogTitle class="text-center text-xl">결혼비용은 이렇게 모여요</AlertDialogTitle>
      </AlertDialogHeader>

      <ol class="mt-5">
        <li class="grid grid-cols-[1.75rem_4rem_1fr] items-center gap-2.5 py-3.5">
          <span
            class="flex h-7 w-7 items-center justify-center rounded-full bg-dm-cb text-sm font-medium text-brand-dark"
          >
            1
          </span>
          <span
            class="flex h-16 w-16 items-center justify-center rounded-full bg-btn-mt/60 text-btn-mt-dark"
            aria-hidden="true"
          >
            <FilePenLine
              class="h-10 w-10"
              :stroke-width="1.4"
            />
          </span>
          <p class="text-sm leading-6 text-gray-800">
            캘린더에서 소비 내역을<br />추가하거나 수정해요.
          </p>
        </li>

        <li
          class="grid grid-cols-[1.75rem_4rem_1fr] items-center gap-2.5 border-t border-dm-gray/30 py-3.5"
        >
          <span
            class="flex h-7 w-7 items-center justify-center rounded-full bg-dm-cb text-sm font-medium text-brand-dark"
          >
            2
          </span>
          <span
            class="flex h-16 w-16 items-center justify-center rounded-full bg-dm-cb text-brand-dark"
            aria-hidden="true"
          >
            <CalendarHeart
              class="h-9 w-9"
              :stroke-width="1.4"
            />
          </span>
          <div class="min-w-0">
            <p class="text-sm leading-6 text-gray-800">
              결혼 카테고리를 선택하면<br />결혼비용 달력에 표시돼요.
            </p>
            <div
              class="mt-3 flex items-center gap-2.5 whitespace-nowrap"
              aria-label="식비에서 예식장 카테고리로 변경"
            >
              <span
                class="inline-flex min-w-16 items-center justify-center rounded-full border border-btn-mt-dark bg-dm-mint-lighter px-3 py-1.5 text-xs font-medium text-btn-mt-dark"
              >
                식비
              </span>
              <span
                class="text-lg leading-none text-dm-gray-dark"
                aria-hidden="true"
                >→</span
              >
              <span
                class="inline-flex min-w-16 items-center justify-center rounded-full border border-pink-03-dark bg-pink-01 px-3 py-1.5 text-xs font-medium text-brand-dark"
              >
                예식장
              </span>
            </div>
          </div>
        </li>
      </ol>

      <AlertDialogFooter class="mt-5">
        <AlertDialogAction
          class="h-12 w-full rounded-2xl bg-brand text-sm font-semibold text-white hover:bg-brand-dark"
        >
          확인했어요
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
