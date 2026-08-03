import type { MyPageResponseDto } from '@/types/dto/myPage.dto';
import type { MyPage } from '@/types/myPage';

export const toMyPage = (dto: MyPageResponseDto): MyPage => ({
  user: {
    name: dto.user.name,
    role: dto.user.role,
    phoneNumber: dto.user.phone_number,
  },
  partner: dto.partner
    ? {
        name: dto.partner.name,
        role: dto.partner.role,
        connectedSince: dto.partner.connected_since,
        status: dto.partner.status,
      }
    : null,
  assetSummary: {
    connectedAccountsCount: dto.asset_summary.connected_accounts_count,
    connectedCardsCount: dto.asset_summary.connected_cards_count,
  },
  shareSetting: {
    selectedScope: dto.share_scope.selected_scope,
    statusText: dto.share_scope.status_text,
  },
  appVersion: dto.app_version,
});
