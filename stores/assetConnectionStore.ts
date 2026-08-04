import { defineStore } from 'pinia';
import { getAccountConnectionForm, getCardConnectionForm } from '@/apis/assetConnectionApi';
import { toAssetConnectionForm } from '@/models/AssetConnection';
import type { AssetConnectionForm } from '@/types/assetConnection';

const MOCK_ACCOUNT_CONNECTION_FORM: AssetConnectionForm = {
  selectedProvider: 'KB국민은행',
  loginId: 'password123!',
  loginPassword: 'password123!',
  helperText: '영문·숫자·특수문자 포함 8자 이상',
  passwordMessage: '비밀번호가 입력되었어요',
};

const MOCK_CARD_CONNECTION_FORM: AssetConnectionForm = {
  selectedProvider: '신한카드',
  loginId: 'password123!',
  loginPassword: 'password123!',
  helperText: '영문·숫자·특수문자 포함 8자 이상',
  passwordMessage: '비밀번호가 입력되었어요',
};

export const useAssetConnectionStore = defineStore('assetConnection', {
  state: () => ({
    accountForm: MOCK_ACCOUNT_CONNECTION_FORM,
    cardForm: MOCK_CARD_CONNECTION_FORM,
    isLoadingAccount: false,
    isLoadingCard: false,
  }),
  actions: {
    async fetchAccountConnectionForm() {
      this.isLoadingAccount = true;

      try {
        const formDto = await getAccountConnectionForm();
        this.accountForm = toAssetConnectionForm(formDto);
      } catch {
        this.accountForm = MOCK_ACCOUNT_CONNECTION_FORM;
      } finally {
        this.isLoadingAccount = false;
      }
    },
    async fetchCardConnectionForm() {
      this.isLoadingCard = true;

      try {
        const formDto = await getCardConnectionForm();
        this.cardForm = toAssetConnectionForm(formDto);
      } catch {
        this.cardForm = MOCK_CARD_CONNECTION_FORM;
      } finally {
        this.isLoadingCard = false;
      }
    },
  },
});
