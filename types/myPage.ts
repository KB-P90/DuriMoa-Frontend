export type CoupleRole = 'GROOM' | 'BRIDE';

export type PartnerConnectionStatus = 'CONNECTED' | 'WAIT' | 'DISCONNECTED';

export type ShareScope = 'WEDDING_FUND_ONLY' | 'ALL';

export interface MyPageUser {
  name: string;
  role: CoupleRole;
  phoneNumber: string;
}

export interface MyPagePartner {
  name: string;
  role: CoupleRole;
  connectedSince: string;
  status: PartnerConnectionStatus;
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
  appVersion: string;
}
