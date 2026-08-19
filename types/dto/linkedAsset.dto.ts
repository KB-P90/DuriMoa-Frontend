export interface LinkedAssetAccountResponseDto {
  id: number;
  company: string;
  accountName: string;
  maskedNumber: string;
}

export interface LinkedAssetCardResponseDto {
  id: number;
  company: string;
  cardName: string;
  image: string;
}

export interface LinkedAssetsResponseDto {
  accounts: LinkedAssetAccountResponseDto[];
  cards: LinkedAssetCardResponseDto[];
}
