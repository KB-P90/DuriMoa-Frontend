import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useExpenseStore } from '@/stores/expenseStore';

export function useExpenseFeedback(year: () => number, month: () => number) {
  const expenseStore = useExpenseStore();
  const { monthlyExpense, feedbackSaving } = storeToRefs(expenseStore);
  const isEditing = ref(false);
  const draftContent = ref('');
  const saveErrorMessage = ref('');

  const feedbacks = computed(() =>
    monthlyExpense.value.feedbacks
      .filter((feedback) => feedback.content.trim().length > 0)
      .map((feedback) => ({
        ...feedback,
        isMine: feedback.writerUserId === monthlyExpense.value.me.userId,
      }))
  );
  const myFeedback = computed(() => feedbacks.value.find((feedback) => feedback.isMine) ?? null);
  const shouldShowPrompt = computed(() => !myFeedback.value);

  function openEditor() {
    draftContent.value = myFeedback.value?.content ?? '';
    saveErrorMessage.value = '';
    isEditing.value = true;
  }

  function closeEditor() {
    isEditing.value = false;
    draftContent.value = '';
    saveErrorMessage.value = '';
  }

  async function submitFeedback() {
    saveErrorMessage.value = '';
    const content = draftContent.value.trim();
    if (!content) {
      saveErrorMessage.value = '상대에게 전하고 싶은 말을 한 글자 이상 적어주세요.';
      return;
    }

    try {
      await expenseStore.saveFeedback(year(), month(), content);
      closeEditor();
    } catch {
      saveErrorMessage.value = '피드백을 저장하지 못했어요. 잠시 후 다시 시도해주세요.';
    }
  }

  return {
    feedbacks,
    myFeedback,
    shouldShowPrompt,
    feedbackSaving,
    isEditing,
    draftContent,
    saveErrorMessage,
    openEditor,
    closeEditor,
    submitFeedback,
  };
}
