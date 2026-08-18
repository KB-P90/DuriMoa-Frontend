import { defineStore } from 'pinia';
import axios from 'axios';
import { getMyPageProfile, updateMyPageProfile, updateMyPageShare } from '@/server/myPageApi';
import { logoutAuth } from '@/server/authApi';
import { ACCESS_TOKEN_KEY } from '@/server/axios.js';
import { disconnectNotificationStream } from '@/composables/useNotificationStream';
import { toCoupleRole, toMyPage } from '@/models/MyPage';
import { formatPhoneNumber } from '@/utils/format';
import type { ApiErrorResponse } from '@/types/common';
import type { MyPage, MyPageProfileForm } from '@/types/myPage';

const DEFAULT_SAVE_ERROR_MESSAGE = '저장에 실패하였습니다. 다시 시도해주세요.';

export const useMyPageStore = defineStore('myPage', {
  state: (): {
    myPage: MyPage | null;
    isLoading: boolean;
    isSavingProfile: boolean;
    isUpdatingShare: boolean;
    lastErrorMessage: string;
  } => ({
    myPage: null,
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
        this.myPage = null;
        this.lastErrorMessage = '마이페이지 정보를 불러오지 못했어요.';
      } finally {
        this.isLoading = false;
      }
    },
    async saveProfile(
      form: MyPageProfileForm,
      imageFile: File | null = null,
      removeImage: boolean = false
    ) {
      if (!this.myPage) {
        return false;
      }

      this.isSavingProfile = true;
      this.lastErrorMessage = '';

      try {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('role', form.role === 'GROOM' ? 'G' : 'B');
        formData.append('phone', form.phoneNumber);
        if (form.newPassword) {
          formData.append('password', form.newPassword);
          formData.append('currentPassword', form.currentPassword);
        }
        if (imageFile) {
          formData.append('profileImage', imageFile);
        } else if (removeImage) {
          formData.append('removeProfileImage', 'true');
        }

        const updatedProfile = await updateMyPageProfile(formData);
        this.myPage = toMyPage(updatedProfile);
        return true;
      } catch (error: unknown) {
        if (axios.isAxiosError<ApiErrorResponse>(error) && error.response?.data.message) {
          this.lastErrorMessage = error.response.data.message;
        } else {
          this.lastErrorMessage = DEFAULT_SAVE_ERROR_MESSAGE;
        }
        return false;
      } finally {
        this.isSavingProfile = false;
      }
    },
    async toggleShareScope() {
      if (this.isUpdatingShare || !this.myPage) {
        return;
      }

      this.isUpdatingShare = true;
      this.lastErrorMessage = '';

      try {
        await updateMyPageShare();
        await this.fetchMyPage();
      } catch {
        this.lastErrorMessage = '공유 범위를 변경하지 못했어요.';
      } finally {
        this.isUpdatingShare = false;
      }
    },
    async logout() {
      try {
        await logoutAuth();
      } finally {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        disconnectNotificationStream();
      }
    },
    buildProfileForm(): MyPageProfileForm | null {
      if (!this.myPage) {
        return null;
      }

      return {
        name: this.myPage.user.name,
        role: toCoupleRole(this.myPage.user.role),
        phoneNumber: formatPhoneNumber(this.myPage.user.phoneNumber),
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      };
    },
  },
});
