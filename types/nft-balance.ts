import { Asset } from "./asset";
import { AccountType, PriceModel } from "./transaction";

/**
 * Represents social media links for an NFT collection
 */
interface SocialLink {
  /** Social media platform name */
  platform: string;

  /** URL to the social media profile */
  url: string;
}

/**
 * Represents detailed information about an NFT collection
 */
export interface Collection {
  /** URL to the collection's banner image */
  banner_image_url: string | null;

  /** Collection category */
  category: string | null;

  /** Blockchain networks where collection is deployed */
  chains: string[];

  /** Unique collection identifier */
  collectionId: string;

  /** Collection description */
  description: string | null;

  /** Discord community URL */
  discordUrl: string | null;

  /** Total number of unique NFT holders */
  ownerCount: number;

  /** Collection website URL */
  externalUrl: string | null;

  /** Floor prices across different marketplaces */
  floorPrice: PriceModel[];

  /** Collection thumbnail URL */
  imageUrl: string | null;

  /** Marketplace listing URLs */
  marketplaceUrls: string[];

  /** Collection name */
  name: string;

  /** Current top bids on collection items */
  topBids?: PriceModel[];

  /** Total supply of NFTs in collection */
  totalQuantity: number;

  /** Social media presence */
  socialLinks: SocialLink[];
}

/**
 * Represents the last sale information for an NFT
 */
export interface LastSale {
  /** Seller's address */
  fromAddress: string | null;

  /** Buyer's address */
  toAddress: string | null;

  /** Quantity sold */
  quantity: number | null;

  /** Quantity as string (for precision) */
  quantityString: string | null;

  /** Sale timestamp */
  timestamp: string | null;

  /** Transaction hash */
  transactionHash: string | null;

  /** Marketplace identifier */
  marketplaceId: string | null;

  /** Marketplace name */
  marketplaceName: string | null;

  /** Bundle sale indicator */
  isBundleSale: boolean | null;

  /** Payment token details */
  paymentToken?: Asset;

  /** Total sale price */
  totalPrice: PriceModel | null;
}

/**
 * Represents an NFT balance entry
 */
export type NFTBalance = {
  /** Unique identifier within Kryptos system */
  id: string;

  // NFT identifiers
  /** Smart contract address */
  contractAddress: string;

  /** Token ID within contract */
  tokenId: string;

  /** NFT name */
  name: string;

  /** NFT description */
  description: string;

  /** File format (e.g., .png, .gif) */
  contentType: string;

  /** Primary NFT content URL */
  nftUrl: string;

  /** Thumbnail image URL */
  thumbnailUrl: string;

  /** Audio content URL */
  audioUrl: string;

  /** Video content URL */
  videoUrl: string;

  /** Wallet holding the NFT */
  source: AccountType;

  /** Token standard (e.g., ERC1155, ERC721) */
  ercType: string;

  /** Token quantity held */
  amount: number;

  /** Current USD value */
  price: PriceModel;

  /** Spam detection flag */
  isNftSpam: boolean;

  /** Collection metadata */
  collection: Collection;

  /** Most recent sale information */
  lastSale?: LastSale | null;
};
