import { Asset } from "./asset";
import { AccountType } from "./transaction";

/**
 * Represents a portfolio holding with detailed asset information
 */
export type HoldingsType = {
  /** Asset being held */
  asset: Asset;

  /** Total quantity of the asset */
  totalQuantity: number;

  /** Total cost basis of the holding */
  costbasis: number;

  /** Current market price */
  marketPrice: number;

  /** Total market value of the holding */
  marketValue: number;

  /** Unrealized profit/loss */
  unrealizedPnL: number;

  /** 24-hour price change percentage */
  "24hrChange": number;

  /** Links to market data sources */
  marketLinks: {
    [key: string]: string; // e.g., {coingecko: "https://coingecko.com/en/coins/ethereum"}
  };

  /** Distribution of assets across accounts */
  assetDistribution: {
    /** Amount held in this account */
    quantity: number;

    /** Account holding the assets */
    account: AccountType;

    /** Percentage of total holdings in this account */
    allocationPercentage: number;
  }[];
};
