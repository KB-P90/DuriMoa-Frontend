import { defineStore } from 'pinia';
import {
  getMyPageProfile,
  logoutMyPage,
  updateMyPageProfile,
  updateMyPageShare,
} from '@/server/myPageApi';
import { ACCESS_TOKEN_KEY } from '@/server/axios.js';
import { toCoupleRole, toMyPage } from '@/models/MyPage';
import type { MyPage, MyPageAssetSummary, MyPageProfileForm } from '@/types/myPage';

const MOCK_ASSET_SUMMARY: MyPageAssetSummary = {
  connectedAccountsCount: 3,
  connectedCardsCount: 3,
};

const MOCK_MY_PAGE: MyPage = {
  user: {
    id: 1,
    name: '김민준',
    role: 'GROOM',
    phoneNumber: '010-1234-5678',
    profileImage: null,
    provider: 'LOCAL',
  },
  partner: {
    name: '이서연',
    role: 'BRIDE',
    connectedSince: '2026.01.15',
    status: 'CONNECTED',
  },
  assetSummary: MOCK_ASSET_SUMMARY,
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
    isSavingProfile: false,
    isUpdatingShare: false,
    lastErrorMessage: '',
  }),
  actions: {
    async fetchMyPage() {
      this.isLoading = true;
      this.lastErrorMessage = '';

      try {
        const profileDto = await getMyPageProfile();
        this.myPage = toMyPage(profileDto);
      } catch {
        this.myPage = MOCK_MY_PAGE;
        this.lastErrorMessage = '마이페이지 정보를 불러오지 못해 임시 데이터를 표시하고 있어요.';
      } finally {
        this.isLoading = false;
      }
    },
    async saveProfile(form: MyPageProfileForm, imageFile: File | null = null) {
      this.isSavingProfile = true;
      this.lastErrorMessage = '';

      try {
        const formData = new FormData();
        formData.append('id', String(this.myPage.user.id));
        formData.append('name', form.name);
        formData.append('role', form.role === 'GROOM' ? 'G' : 'B');
        formData.append('phone', form.phoneNumber);
        if (form.newPassword) {
          formData.append('password', form.newPassword);
        }
        if (imageFile) {
          formData.append('profileImage', imageFile);
        }

        const updatedProfile = await updateMyPageProfile(formData);

        this.myPage = toMyPage(updatedProfile);
        return true;
      } catch {
        this.myPage = {
          ...this.myPage,
          user: {
            ...this.myPage.user,
            name: form.name,
            role: form.role,
            phoneNumber: form.phoneNumber,
          },
        };
        this.lastErrorMessage = '프로필 저장 API 연결 전이라 화면에만 임시 반영했어요.';
        return false;
      } finally {
        this.isSavingProfile = false;
      }
    },
    async toggleShareScope() {
      if (this.isUpdatingShare) {
        return;
      }

      this.isUpdatingShare = true;
      this.lastErrorMessage = '';

      try {
        await updateMyPageShare();
        await this.fetchMyPage();
      } catch {
        const nextScope =
          this.myPage.shareSetting.selectedScope === 'WEDDING_FUND_ONLY'
            ? 'ALL'
            : 'WEDDING_FUND_ONLY';

        this.myPage = {
          ...this.myPage,
          shareSetting: {
            selectedScope: nextScope,
            statusText: nextScope === 'ALL' ? '전체 공개 중' : '요약 공개 중',
          },
        };
        this.lastErrorMessage = '공유범위 API 연결 전이라 화면에만 임시 반영했어요.';
      } finally {
        this.isUpdatingShare = false;
      }
    },
    async logout() {
      try {
        await logoutMyPage();
      } catch {
        // 서버 로그아웃 API가 준비되기 전에도 클라이언트 세션은 종료한다.
      } finally {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    },
    buildProfileForm(): MyPageProfileForm {
      return {
        name: this.myPage.user.name,
        role: toCoupleRole(this.myPage.user.role),
        phoneNumber: this.myPage.user.phoneNumber,
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      };
    },
  },
});
