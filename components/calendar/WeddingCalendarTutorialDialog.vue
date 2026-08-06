<script setup lang="ts">
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
            class="flex h-7 w-7 items-center justify-center rounded-full bg-dm-cb text-sm font-medium text-btn-pk-dark"
          >
            1
          </span>
          <span
            class="flex h-16 w-16 items-center justify-center rounded-full bg-btn-mt/60 text-btn-mt-dark"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 56 56"
              class="h-11 w-11"
              fill="none"
            >
              <g
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 7h22l9 9v22" />
                <path d="M34 7v9h9M12 7v42h25M19 24h15M19 32h11" />
                <path d="m30 47 2.5-8.5 10.8-10.8a3.8 3.8 0 0 1 5.4 5.4L37.9 43.9 30 47Z" />
                <path d="m40.8 30.2 5.4 5.4" />
              </g>
            </svg>
          </span>
          <p class="text-sm leading-6 text-gray-800">
            캘린더에서 소비 내역을<br />추가하거나 수정해요.
          </p>
        </li>

        <li
          class="grid grid-cols-[1.75rem_4rem_1fr] items-center gap-2.5 border-t border-dm-gray/30 py-3.5"
        >
          <span
            class="flex h-7 w-7 items-center justify-center rounded-full bg-dm-cb text-sm font-medium text-btn-pk-dark"
          >
            2
          </span>
          <span
            class="flex h-16 w-16 items-center justify-center rounded-full bg-dm-cb text-btn-pk-dark"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 56 56"
              class="h-11 w-11"
              fill="none"
            >
              <g
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect
                  x="8"
                  y="12"
                  width="40"
                  height="37"
                  rx="4"
                />
                <path d="M8 22h40M18 7v10M38 7v10" />
              </g>
              <path
                d="M19 32c0-5.6 7.2-6.6 9-2 1.8-4.6 9-3.6 9 2 0 4.7-4.7 7.7-9 10.7-4.3-3-9-6-9-10.7Z"
                fill="currentColor"
              />
            </svg>
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
                class="inline-flex min-w-16 items-center justify-center rounded-full border border-btn-pk-dark bg-dm-cb-light px-3 py-1.5 text-xs font-medium text-btn-pk-dark"
              >
                예식장
              </span>
            </div>
          </div>
        </li>
      </ol>

      <AlertDialogFooter class="mt-5">
        <AlertDialogAction
          class="h-12 w-full rounded-2xl bg-btn-pk text-sm font-semibold text-white hover:bg-btn-pk-dark"
        >
          확인했어요
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
