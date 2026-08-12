import type { MyPageProfileResponseDto, MyPageRoleDto } from '@/types/dto/myPage.dto';
import type { CoupleRole, MyPage } from '@/types/myPage';

export const toCoupleRole = (role: MyPageRoleDto | null | undefined): CoupleRole =>
  role === 'B' || role === 'BRIDE' ? 'BRIDE' : 'GROOM';

export const toDisplayDate = (date: string | null | undefined): string => {
  if (!date) {
    return '';
  }

  if (/^\d{8}$/.test(date)) {
    return `${date.slice(0, 4)}.${date.slice(4, 6)}.${date.slice(6, 8)}`;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
    return date.slice(0, 10).replaceAll('-', '.');
  }

  return date;
};

export const toMyPage = (profile: MyPageProfileResponseDto): MyPage => {
  const isShared = Boolean(profile.shared);

  return {
    user: {
      id: profile.id,
      name: profile.name,
      role: toCoupleRole(profile.role),
      phoneNumber: profile.phone ?? '',
      profileImage: profile.profileImage,
      provider: profile.provider,
    },
    partner:
      profile.partnerName && profile.coupleStatus
        ? {
            name: profile.partnerName,
            role: toCoupleRole(profile.partnerRole),
            connectedSince: toDisplayDate(profile.coupleCreatedAt),
            status: profile.coupleStatus,
          }
        : null,
    assetSummary: {
      connectedAccountsCount: profile.accountCount,
      connectedCardsCount: profile.cardCount,
    },
    shareSetting: {
      selectedScope: isShared ? 'ALL' : 'WEDDING_FUND_ONLY',
      statusText: isShared ? '전체 공개 중' : '요약 공개 중',
    },
    appVersion: 'P90 prototype · v1.0',
  };
};
