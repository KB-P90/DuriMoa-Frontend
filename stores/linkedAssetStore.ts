import { defineStore } from 'pinia';
import { toLinkedAssets } from '@/models/LinkedAsset';
import { getLinkedAssets } from '@/server/linkedAssetApi';
import type { LinkedAssets } from '@/types/linkedAsset';

const EMPTY_LINKED_ASSETS: LinkedAssets = {
  accounts: [],
  cards: [],
};

export const useLinkedAssetStore = defineStore('linkedAsset', {
  state: (): {
    assets: LinkedAssets;
    isLoading: boolean;
    lastErrorMessage: string;
  } => ({
    assets: { ...EMPTY_LINKED_ASSETS },
    isLoading: false,
    lastErrorMessage: '',
  }),
  actions: {
    async fetchLinkedAssets() {
      this.isLoading = true;
      this.lastErrorMessage = '';

      try {
        const assetsDto = await getLinkedAssets();
        this.assets = toLinkedAssets(assetsDto);
      } catch {
        this.assets = { ...EMPTY_LINKED_ASSETS };
        this.lastErrorMessage = '연결된 자산을 불러오지 못했어요.';
      } finally {
        this.isLoading = false;
      }
    },
  },
});
