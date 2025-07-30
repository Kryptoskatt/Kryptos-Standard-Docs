import { Asset } from "./asset";

/**
 * Represents price information for an asset at a specific point in time
 */
export type PriceModel = {
  /** Current price of the asset */
  price: number;

  /** Base currency in which the price is denominated */
  baseCurrency: string;

  /** Timestamp when the price was recorded */
  timestamp: number;

  /** Source of the price data (e.g., coingecko, coinbase) */
  source: string;
};

/**
 * Represents a wallet or contract address with associated metadata
 */
export type AccountType = {
  /** Name of the wallet provider */
  provider: string;

  /** Public display name of the wallet */
  providerPublicName?: string;

  /** Blockchain address of the wallet/account */
  publicAddress?: string;

  /** Unique identifier for user accounts */
  walletId?: string;

  /** URL to the wallet/account logo */
  logoUrl?: string;

  /** Indicates if the address is a smart contract */
  isContract?: boolean;

  /** User-defined alias for the wallet/account */
  alias?: string;
};

/**
 * Base type for asset transfers containing common fields
 */
export type AssetTransfer = {
  /** Asset being transferred */
  asset: Asset;

  /** Quantity of the asset transferred */
  quantity: number;

  /** Price information at the time of transfer */
  price: PriceModel;
};

/**
 * Represents an incoming asset transfer
 */
export type AssetTransferIncoming = AssetTransfer & {
  /** Transfer type identifier */
  type: "incoming";

  /** Optional source account */
  fromAccount?: AccountType;

  /** Destination account */
  toAccount: AccountType;

  /** Internal reference label */
  internalLabel?: string;

  /** Transaction identifier for cross-chain transfers */
  transactionPlatfromId: string;
};

/**
 * Represents an outgoing asset transfer
 */
export type AssetTransferOutgoing = AssetTransfer & {
  /** Transfer type identifier */
  type: "outgoing";

  /** Optional destination account */
  toAccount?: AccountType;

  /** Source account */
  fromAccount: AccountType;

  /** Internal reference label */
  internalLabel?: string;

  /** Transaction identifier for cross-chain transfers */
  transactionPlatfromId: string;
};

/**
 * Represents a fee associated with a transfer
 */
export type AssetTransferFee = AssetTransfer & {
  /** Transfer type identifier */
  type: "fee";

  /** Account from which the fee is deducted */
  feeAccount: AccountType;
};

/**
 * Represents a ledger entry recording asset movement
 */
export type LedgerType = {
  /** Unique identifier within Kryptos system */
  id: string;

  /** Associated transaction identifier */
  transactionId: string;

  /** Timestamp of the ledger entry */
  timestamp: number;

  /** Asset involved in the entry */
  asset: Asset;

  /** Quantity of the asset */
  quantity: number;

  /** Price information at time of entry */
  price: PriceModel;

  /** Type of ledger entry */
  type: "incoming" | "outgoing" | "fee";

  /** Entry label */
  label: string;

  /** Detailed description */
  description: string;

  /** Source account */
  fromAccount?: AccountType;

  /** Destination account */
  toAccount?: AccountType;

  // Balance tracking
  /** Asset balance before the transaction */
  beforeBalance: number;

  /** Asset balance after the transaction */
  afterBalance: number;

  // Tax-related fields
  /** Cost basis of the transferred asset */
  costbasis?: number;

  /** Proceeds from the transfer */
  proceeds?: number;

  /** Realized profit/loss */
  profit?: number;
};

/**
 * Represents a complete transaction with all associated transfers and metadata
 */
export type Transaction = {
  /** Unique identifier within Kryptos system */
  id: string;

  /** External platform transaction identifier */
  transactionPlatfromId?: string;

  /** List of incoming asset transfers */
  incomingAssets: AssetTransferIncoming[];

  /** List of outgoing asset transfers */
  outgoingAssets: AssetTransferOutgoing[];

  /** UTC timestamp of the transaction */
  timestamp: number;

  /** Transaction label */
  label: string;

  /** Associated fees */
  fee: AssetTransferFee[];

  /** Detailed description */
  description?: string;

  /** Additional notes */
  notes?: string;

  /** Transaction metadata */
  metadata: {
    /** Source of the transaction data */
    importSource: "API" | "CSV" | "Manual";

    /** Associated wallet identifier */
    importWalletId?: string;

    /** Manual entry indicator */
    isManual: boolean;

    /** Edit indicator */
    isEdited: boolean;

    /** DeFi transaction indicator */
    isDefiTrx: boolean;

    /** NFT transaction indicator */
    isNFTTrx: boolean;
  };

  /** Protocol-specific information */
  protocol?: {
    /** Called function name */
    functionName: string;

    /** Protocol identifier */
    protocolId: string;

    /** Protocol name */
    protocolName: string;

    /** Protocol logo URL */
    protocolLogoUrl: string;
  };

  /** Associated ledger entries */
  ledger: LedgerType[];

  /** Transaction tags */
  tags: string[];

  /** Raw transaction data */
  rawTrx: any;
};
