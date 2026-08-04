import { defineStore } from 'pinia';
import type { AssetConnectionForm } from '@/types/assetConnection';

const MOCK_ACCOUNT_CONNECTION_FORM: AssetConnectionForm = {
  selectedProvider: 'KB국민은행',
  loginId: '',
  loginPassword: '',
  helperText: '영문·숫자·특수문자 포함 8자 이상',
  passwordMessage: '비밀번호가 입력되었어요',
};

const MOCK_CARD_CONNECTION_FORM: AssetConnectionForm = {
  selectedProvider: '신한카드',
  loginId: '',
  loginPassword: '',
  helperText: '영문·숫자·특수문자 포함 8자 이상',
  passwordMessage: '비밀번호가 입력되었어요',
};

export const useAssetConnectionStore = defineStore('assetConnection', {
  state: () => ({
    accountForm: { ...MOCK_ACCOUNT_CONNECTION_FORM },
    cardForm: { ...MOCK_CARD_CONNECTION_FORM },
    isLoadingAccount: false,
    isLoadingCard: false,
  }),
  actions: {
    async fetchAccountConnectionForm() {
      this.accountForm = { ...MOCK_ACCOUNT_CONNECTION_FORM };
    },
    async fetchCardConnectionForm() {
      this.cardForm = { ...MOCK_CARD_CONNECTION_FORM };
    },
  },
});
