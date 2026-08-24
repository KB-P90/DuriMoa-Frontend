import { computed, ref } from 'vue';

import { toHomeDashboard } from '@/models/Home';
import { getHomeDashboard } from '@/server/homeApi';

export function useGoalAssetSummary() {
  const totalSavedAmount = ref<number | null>(null);
  const isAssetLoading = ref(true);

  const currentAssetManwon = computed(() =>
    totalSavedAmount.value === null ? null : Math.round(totalSavedAmount.value / 10_000)
  );

  async function loadCurrentAsset() {
    isAssetLoading.value = true;

    try {
      const dashboardDto = await getHomeDashboard();
      totalSavedAmount.value = dashboardDto
        ? toHomeDashboard(dashboardDto).totalAccumulatedAmount
        : null;
    } catch {
      totalSavedAmount.value = null;
    } finally {
      isAssetLoading.value = false;
    }
  }

  return {
    currentAssetManwon,
    isAssetLoading,
    loadCurrentAsset,
  };
}
