/**
 * Represents a collection of NFTs with associated metadata
 */
export interface NftCollection {
  /** Collection category or classification */
  category: string | null;

  /** List of blockchain networks where the collection is deployed */
  chains: string[];

  /** Unique identifier for the collection */
  collection_id: string;

  /** Detailed description of the collection */
  description: string | null;

  /** URL to the collection's image */
  image_url: string | null;

  /** List of marketplace URLs where the collection is listed */
  marketplace_collection_url: string[];

  /** Name of the collection */
  name: string;

  /** Total supply of NFTs in the collection */
  total_quantity: number;
}

/**
 * Represents any digital or traditional asset in the Kryptos system
 */
export type Asset = {
  /** Unique identifier within Kryptos system */
  tokenId: string;

  /** Ticker or symbol (e.g., ETH, USDC) */
  symbol: string;

  /** Full display name (e.g., Ethereum, Tether USD) */
  publicName: string;

  /** Chain/network identifier (e.g., polygon, ethereum) */
  chainId: string;

  /** Smart contract address (applicable for crypto and NFTs) */
  contractAddress?: string;

  /** URL to the token or NFT logo */
  logoUrl: string;

  /** Token standard (e.g., ERC-20, BEP-20, ERC-721) */
  standard: string;

  /** Link to blockchain explorer for the token/NFT */
  explorerUrl: string;

  /** Asset category (e.g., "stablecoin", "governance", "collectible") */
  category: string;

  /** Asset classification */
  type: "crypto" | "nft" | "fiat";

  /** Provider-specific identifiers {provider: id} */
  providerId: { [key: string]: string };

  // NFT-specific fields
  /** NFT's internal token ID */
  innerId?: string;

  /** Reference to parent NFT collection */
  collection?: NftCollection;
};
