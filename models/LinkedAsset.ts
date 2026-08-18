import type {
  LinkedAssetAccountResponseDto,
  LinkedAssetCardResponseDto,
  LinkedAssetsResponseDto,
} from '@/types/dto/linkedAsset.dto';
import type { LinkedAccount, LinkedAssets, LinkedCard } from '@/types/linkedAsset';

const toLinkedAccount = (account: LinkedAssetAccountResponseDto): LinkedAccount => ({
  id: account.id,
  company: account.company,
  accountName: account.accountName,
  maskedNumber: account.maskedNumber,
});

const toLinkedCard = (card: LinkedAssetCardResponseDto): LinkedCard => ({
  id: card.id,
  company: card.company,
  cardName: card.cardName,
  image: card.image,
});

export const toLinkedAssets = (assets: LinkedAssetsResponseDto): LinkedAssets => ({
  accounts: assets.accounts.map(toLinkedAccount),
  cards: assets.cards.map(toLinkedCard),
});
