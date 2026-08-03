export interface MyPagePartnerDto {
  name: string;
  role: 'GROOM' | 'BRIDE';
  connected_since: string;
  status: 'CONNECTED' | 'WAIT' | 'DISCONNECTED';
}

export interface MyPageAssetSummaryDto {
  connected_accounts_count: number;
  connected_cards_count: number;
}

export interface MyPageShareScopeDto {
  selected_scope: 'WEDDING_FUND_ONLY' | 'ALL';
  status_text: string;
}

export interface MyPageResponseDto {
  user: {
    name: string;
    role: 'GROOM' | 'BRIDE';
    phone_number: string;
  };
  partner: MyPagePartnerDto | null;
  asset_summary: MyPageAssetSummaryDto;
  share_scope: MyPageShareScopeDto;
  app_version: string;
}
