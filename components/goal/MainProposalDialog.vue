<script setup lang="ts">
import { X } from 'lucide-vue-next';
import ProposalSummaryCard from '@/components/goal/ProposalSummaryCard.vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { MainProposalRequest } from '@/types/goal';

withDefaults(
  defineProps<{
    open: boolean;
    mode: 'request' | 'accept';
    request?: MainProposalRequest | null;
  }>(),
  { request: null }
);

defineEmits<{
  'update:open': [value: boolean];
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <AlertDialog
    :open="open"
    @update:open="$emit('update:open', $event)"
  >
    <AlertDialogContent class="relative">
      <AlertDialogCancel
        class="absolute right-4 top-4 h-6 w-6 border-none p-0 text-dm-gray-dark hover:bg-dm-gray-light"
        @click="$emit('update:open', false)"
      >
        <X class="h-4 w-4" />
      </AlertDialogCancel>

      <template v-if="mode === 'request'">
        <AlertDialogHeader>
          <AlertDialogTitle>메인 시안 신청</AlertDialogTitle>
          <AlertDialogDescription
            >이 시안을 상대방에게 공동 목표로 요청할까요?</AlertDialogDescription
          >
        </AlertDialogHeader>

        <AlertDialogFooter class="flex-row gap-2">
          <AlertDialogCancel
            class="h-12 flex-1 rounded-xl"
            @click="$emit('cancel')"
          >
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            class="h-12 flex-1 rounded-xl hover:bg-brand-dark bg-brand"
            @click="$emit('confirm')"
          >
            신청하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </template>

      <template v-else-if="request">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-xl">메인 시안 수락 요청</AlertDialogTitle>
          <AlertDialogDescription class="font-medium text-[#4B4B57]">
            <strong class="font-bold text-[#232631]">{{ request.proposerName }}</strong
            >님이 아래 시안을<br />
            공동 목표로 설정하려고 해요.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ProposalSummaryCard
          :proposal="request.proposal"
          :diff-from-current-main="request.diffFromCurrentMain"
          :monthly-saving="request.monthlySaving"
        />

        <p class="text-center text-xs text-dm-gray-dark">
          수락하면 두 사람의 공동 목표가 이 시안으로 바뀌어요.
        </p>

        <AlertDialogFooter class="flex-row gap-2">
          <AlertDialogCancel
            class="h-12 flex-1 rounded-xl"
            @click="$emit('cancel')"
          >
            거절
          </AlertDialogCancel>
          <AlertDialogAction
            class="h-12 flex-[1.6] rounded-xl hover:bg-brand-dark bg-brand"
            @click="$emit('confirm')"
          >
            수락하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </template>
    </AlertDialogContent>
  </AlertDialog>
</template>
