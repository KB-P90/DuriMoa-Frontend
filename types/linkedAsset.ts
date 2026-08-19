export interface LinkedAccount {
  id: number;
  company: string;
  accountName: string;
  maskedNumber: string;
}

export interface LinkedCard {
  id: number;
  company: string;
  cardName: string;
  image: string;
}

export interface LinkedAssets {
  accounts: LinkedAccount[];
  cards: LinkedCard[];
}
