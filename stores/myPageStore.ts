import { defineStore } from 'pinia';
import { getMyPage } from '@/apis/myPageApi';
import { toMyPage } from '@/models/MyPage';
import type { MyPage } from '@/types/myPage';

const MOCK_MY_PAGE: MyPage = {
  user: {
    name: '김민준',
    role: 'GROOM',
    phoneNumber: '010-1234-5678',
  },
  partner: {
    name: '이서연',
    role: 'BRIDE',
    connectedSince: '2026.01.15',
    status: 'CONNECTED',
  },
  assetSummary: {
    connectedAccountsCount: 3,
    connectedCardsCount: 3,
  },
  shareSetting: {
    selectedScope: 'WEDDING_FUND_ONLY',
    statusText: '요약 공개 중',
  },
  appVersion: 'P90 prototype · v1.0',
};

export const useMyPageStore = defineStore('myPage', {
  state: () => ({
    myPage: MOCK_MY_PAGE,
    isLoading: false,
  }),
  actions: {
    async fetchMyPage() {
      this.isLoading = true;

      try {
        const myPageDto = await getMyPage();
        this.myPage = toMyPage(myPageDto);
      } catch {
        this.myPage = MOCK_MY_PAGE;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
