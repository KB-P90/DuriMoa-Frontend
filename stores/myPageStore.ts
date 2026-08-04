import { defineStore } from 'pinia';
import {
  getMyPageAssetSummary,
  getMyPageProfile,
  logoutMyPage,
  updateMyPageProfile,
  updateMyPageShare,
  uploadMyPageProfileImage,
} from '@/apis/myPageApi';
import { ACCESS_TOKEN_KEY } from '@/apis/axios.js';
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
    isUploadingImage: false,
    lastErrorMessage: '',
  }),
  actions: {
    async fetchMyPage() {
      this.isLoading = true;
      this.lastErrorMessage = '';

      try {
        const [profileDto, assetSummaryDto] = await Promise.all([
          getMyPageProfile(),
          getMyPageAssetSummary().catch(() => ({
            summary: {
              accountCount: MOCK_ASSET_SUMMARY.connectedAccountsCount,
              cardCount: MOCK_ASSET_SUMMARY.connectedCardsCount,
            },
          })),
        ]);

        this.myPage = toMyPage(profileDto, {
          connectedAccountsCount: assetSummaryDto.summary.accountCount,
          connectedCardsCount: assetSummaryDto.summary.cardCount,
        });
      } catch {
        this.myPage = MOCK_MY_PAGE;
        this.lastErrorMessage = '마이페이지 정보를 불러오지 못해 임시 데이터를 표시하고 있어요.';
      } finally {
        this.isLoading = false;
      }
    },
    async saveProfile(form: MyPageProfileForm) {
      this.isSavingProfile = true;
      this.lastErrorMessage = '';

      try {
        const updatedProfile = await updateMyPageProfile({
          id: this.myPage.user.id,
          name: form.name,
          role: form.role === 'GROOM' ? 'G' : 'B',
          phone: form.phoneNumber,
          ...(form.newPassword ? { password: form.newPassword } : {}),
        });

        this.myPage = toMyPage(updatedProfile, this.myPage.assetSummary);
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
    async uploadProfileImage(file: File) {
      this.isUploadingImage = true;
      this.lastErrorMessage = '';

      const previewUrl = URL.createObjectURL(file);
      this.myPage = {
        ...this.myPage,
        user: {
          ...this.myPage.user,
          profileImage: previewUrl,
        },
      };

      try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await uploadMyPageProfileImage(formData);
        this.myPage.user.profileImage = response.profileImage;
      } catch {
        this.lastErrorMessage = '이미지 업로드 API 연결 전이라 미리보기만 표시하고 있어요.';
      } finally {
        this.isUploadingImage = false;
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
