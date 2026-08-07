export type MyPageRoleDto = 'G' | 'B' | 'GROOM' | 'BRIDE';

export type MyPageCoupleStatusDto = 'CONNECTED' | 'WAIT' | 'REQUESTED' | 'DISCONNECTED' | null;

export interface MyPageProfileResponseDto {
  id: number;
  name: string;
  role: MyPageRoleDto;
  provider: string;
  profileImage: string | null;
  phone: string | null;
  shared: boolean;
  password?: null;
  partnerName: string | null;
  partnerRole: MyPageRoleDto | null;
  coupleCreatedAt: string | null;
  coupleStatus: MyPageCoupleStatusDto;
}

export interface MyPageProfileUpdateRequestDto {
  id: number;
  name: string;
  role?: MyPageRoleDto;
  phone?: string | null;
  password?: string;
}

export interface MyPageAssetSummaryDto {
  accountCount: number;
  cardCount: number;
}

export interface MyPageAssetSummaryResponseDto {
  summary: MyPageAssetSummaryDto;
}

export interface MyPageLogoutResponseDto {
  loggedOut: boolean;
}

export interface MyPageCoupleInviteRequestDto {
  inviteCode: string;
}

export interface MyPageCoupleAcceptRequestDto {
  partnerUserId: number;
}

export interface MyPageCouplePartnerResponseDto {
  userId: number;
  name: string;
  role: 'B' | 'G';
  status: 'WAIT' | 'REQUESTED' | 'CONNECTED' | 'DISCONNECTED';
}
