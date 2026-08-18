export type CoupleRole = 'GROOM' | 'BRIDE';

export type PartnerConnectionStatus = 'CONNECTED' | 'WAIT' | 'REQUESTED' | 'DISCONNECTED';

export type ShareScope = 'WEDDING_FUND_ONLY' | 'ALL';

export interface MyPageUser {
  id: number;
  name: string;
  role: CoupleRole;
  phoneNumber: string;
  profileImage: string | null;
  provider: string;
}

export interface MyPagePartner {
  name: string;
  role: CoupleRole;
  connectedSince: string;
  status: PartnerConnectionStatus;
  profileImage: string | null;
}

export interface MyPageAssetSummary {
  connectedAccountsCount: number;
  connectedCardsCount: number;
}

export interface MyPageShareSetting {
  selectedScope: ShareScope;
  statusText: string;
}

export interface MyPage {
  user: MyPageUser;
  partner: MyPagePartner | null;
  assetSummary: MyPageAssetSummary;
  shareSetting: MyPageShareSetting;
}

export interface MyPageProfileForm {
  name: string;
  role: CoupleRole;
  phoneNumber: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}
