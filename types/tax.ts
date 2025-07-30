import { Asset } from "./asset";
import { AccountType } from "./transaction";

/**
 * Represents a tax-relevant profit and loss entry
 */
export type TaxPnL = {
  /** Asset involved in the tax calculation */
  Asset: Asset;

  /** Total quantity of the asset */
  quantity: number;

  /** Entry date for LIFO, FIFO and HIFO calculations */
  entryDate?: number;

  /** Exit date for LIFO, FIFO and HIFO calculations */
  exitDate?: number;

  /** Cost basis in base currency */
  costbasis: number;

  /** Sale value in base currency */
  proceeds: number;

  /** Total profit/loss in base currency */
  profit: number;

  /** Holding period in days for LIFO, FIFO and HIFO */
  holdingPeriod?: number;

  /** Transaction description */
  desc?: string;

  /** Type of transaction */
  trxType?: string;

  /** Source wallet information */
  source?: AccountType;

  /** Associated transaction identifier */
  transactionId?: string;

  /** Indicates if the gains are from other sources */
  isOtherGains?: boolean;
};
