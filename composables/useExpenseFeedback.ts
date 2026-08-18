import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useExpenseStore } from '@/stores/expenseStore';

export function useExpenseFeedback() {
  const expenseStore = useExpenseStore();
  const { monthlyExpense } = storeToRefs(expenseStore);

  const feedbacks = computed(() =>
    monthlyExpense.value.feedbacks
      .filter((feedback) => feedback.content.trim().length > 0)
      .map((feedback) => ({
        ...feedback,
        isMine: feedback.writerUserId === monthlyExpense.value.me.userId,
      }))
  );
  const shouldShowPrompt = computed(
    () => !feedbacks.value.some((feedback) => feedback.isMine)
  );

  return { feedbacks, shouldShowPrompt };
}
