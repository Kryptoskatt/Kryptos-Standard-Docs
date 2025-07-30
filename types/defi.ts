import { Asset } from "./asset";
import { AccountType, PriceModel } from "./transaction";

/**
 * Categories of DeFi portfolios supported by the system
 */
export type PortfolioCategory =
  | "lending" // Money markets, lending protocols
  | "borrowing" // Debt positions
  | "staking" // Proof-of-stake, liquid staking
  | "farming" // Liquidity mining, yield farming
  | "trading" // DEX trading, AMM positions
  | "derivatives" // Options, futures, perpetuals
  | "insurance" // DeFi insurance protocols
  | "governance" // DAO governance tokens and voting
  | "vesting" // Token vesting schedules
  | "other"; // Catch-all for new DeFi primitives

/**
 * Token position with amount and value
 */
export type TokenPosition = {
  /** The underlying asset/token */
  asset: Asset;

  /** Amount of tokens held (as string to preserve precision) */
  amount: string;

  /** Value of the token position */
  value?: PriceModel;

  /** Whether this token is being used as collateral */
  isCollateral?: boolean;

  /** Whether this is a reward token earned from the protocol */
  isReward?: boolean;

  /** When the tokens will be unlocked */
  unlockTimestamp?: number;

  /** When the position was first opened */
  entryTimestamp?: number;

  /** When this position was last updated */
  lastUpdated?: number;
};

/**
 * Base portfolio type with common fields
 */
export type BasePortfolio = {
  /** Category of DeFi activity */
  category: PortfolioCategory;

  /** Main token positions */
  positions: TokenPosition[];

  /** Reward tokens earned */
  rewardPositions?: TokenPosition[];

  /** Annual percentage yield */
  apy?: number;

  /** Additional protocol-specific data */
  metadata?: Record<string, any>;
};

/**
 * Common/Other Portfolio for non-specialized DeFi activities
 */
export type CommonPortfolio = BasePortfolio & {
  category: "other" | "governance" | "trading";
};

/**
 * Lending and Borrowing Portfolio
 */
export type LendingPortfolio = Omit<BasePortfolio, "positions"> & {
  category: "lending" | "borrowing";

  /** Tokens supplied to earn interest */
  suppliedPositions: TokenPosition[];

  /** Tokens borrowed against collateral */
  borrowedPositions: TokenPosition[];

  /** Health factor for loan positions */
  healthFactor?: number;

  /** APY earned on supplied tokens */
  supplyApy?: number;

  /** APY paid on borrowed tokens */
  borrowApy?: number;
};

/**
 * Staking Portfolio
 */
export type StakingPortfolio = Omit<BasePortfolio, "positions"> & {
  category: "staking";

  /** Tokens that are currently staked */
  stakedPositions: TokenPosition[];

  /** Annual percentage yield from staking */
  stakingApy?: number;

  /** Address of the validator */
  validatorAddress?: string;

  /** Human-readable name of the validator */
  validatorName?: string;

  /** When currently locked tokens will be unlocked */
  unlockTimestamp?: number;

  /** Unbonding period required to withdraw */
  unbondingPeriod?: number;
};

/**
 * Liquidity Farming Portfolio
 */
export type FarmingPortfolio = Omit<BasePortfolio, "positions"> & {
  category: "farming";

  /** LP token positions in various pools */
  lpTokenPositions: TokenPosition[];

  /** APY earned from farming rewards */
  farmApy?: number;

  /** Percentage of the total pool owned */
  poolShare?: number;

  /** The underlying tokens in the LP */
  poolTokens: Asset[];
};

/**
 * Derivatives Portfolio
 */
export type DerivativesPortfolio = Omit<BasePortfolio, "positions"> & {
  category: "derivatives";

  /** Individual derivative positions */
  derivativePositions: DerivativePosition[];

  /** Collateral tokens backing the positions */
  collateralPositions: TokenPosition[];
};

/**
 * Individual derivative position details
 */
export type DerivativePosition = {
  /** Unique identifier for this position */
  positionId: string;

  /** Type of derivative instrument */
  type: "option" | "future" | "perpetual" | "swap";

  /** Position direction */
  side: "long" | "short";

  /** The underlying asset being traded */
  baseAsset: Asset;

  /** The quote/pricing asset */
  quoteAsset: Asset;

  /** Position size (as string for precision) */
  size: string;

  /** Price at which the position was entered */
  entryPrice?: number;

  /** Current market price */
  markPrice?: number;

  /** Notional value of the position */
  notionalValue?: PriceModel;

  /** Current unrealized P&L */
  unrealizedPnl?: PriceModel;

  // Option-specific fields
  /** Strike price for options */
  strikePrice?: number;

  /** Expiry timestamp */
  expiryTimestamp?: number;

  /** Option type */
  optionType?: "call" | "put";

  // Perpetual-specific fields
  /** Leverage multiplier */
  leverage?: number;

  /** Current funding rate */
  fundingRate?: number;

  /** When position was opened */
  createdAt?: number;

  /** When position was last updated */
  lastUpdated?: number;
};

/**
 * Insurance Portfolio
 */
export type InsurancePortfolio = BasePortfolio & {
  category: "insurance";

  /** Whether user is buying or selling coverage */
  type: "buyer" | "seller";

  /** Amount of coverage in native tokens */
  coverageAmount: number;

  /** Premium paid/earned in native tokens */
  premium: number;

  /** Protocol being covered */
  coveredProtocol?: string;

  /** Type of coverage */
  coverageType: string;

  /** When coverage begins */
  coverageStartTimestamp: number;

  /** When coverage expires */
  coverageEndTimestamp: number;

  /** Whether a claim can currently be made */
  claimable: boolean;

  /** Amount that can be claimed */
  claimAmount?: number;
};

/**
 * Vesting Portfolio
 */
export type VestingPortfolio = Omit<BasePortfolio, "positions" | "apy"> & {
  category: "vesting";

  /** The token being vested */
  vestedAsset: Asset;

  /** Total amount in the vesting schedule */
  totalAmount: string;

  /** Amount already vested */
  vestedAmount: string;

  /** Amount that can be claimed now */
  claimableAmount: string;

  /** When vesting began */
  startTimestamp: number;

  /** When vesting completes */
  endTimestamp: number;

  /** Cliff period end */
  cliffTimestamp?: number;

  /** Detailed release schedule */
  releaseSchedule?: VestingSchedule[];
};

/**
 * Individual vesting release event
 */
export type VestingSchedule = {
  /** When this release occurs */
  releaseTimestamp: number;

  /** Amount released at this timestamp */
  releaseAmount: string;

  /** Whether this release has occurred */
  isReleased: boolean;

  /** Whether this release has been claimed */
  isClaimed: boolean;
};

/**
 * Union type for all DeFi portfolio types
 */
export type DefiPortfolio =
  | CommonPortfolio
  | LendingPortfolio
  | StakingPortfolio
  | FarmingPortfolio
  | DerivativesPortfolio
  | InsurancePortfolio
  | VestingPortfolio;

/**
 * Main holding entity for a complete DeFi protocol position
 */
export type DefiHolding = {
  /** Unique identifier for this holding */
  holdingId: string;

  /** Account that owns this holding */
  owner: AccountType;

  /** Name of the DeFi protocol */
  protocolName: string;

  /** Version of the protocol */
  protocolVersion?: string;

  /** Blockchain network */
  chain: string;

  /** Smart contract address */
  contractAddress?: string;

  /** Protocol logo URL */
  logoUrl?: string;

  /** Protocol website URL */
  siteUrl?: string;

  /** Category of DeFi activity */
  category: PortfolioCategory;

  /** The underlying DeFi portfolio */
  portfolio: DefiPortfolio;

  /** Total value of the holding */
  totalValue: PriceModel;

  /** Net value (assets minus liabilities) */
  netValue: PriceModel;

  /** When this holding was first detected */
  createdAt: number;

  /** Last update timestamp */
  updatedAt: number;

  /** Whether the holding is currently active */
  isActive: boolean;

  /** User-defined tags */
  tags?: string[];

  /** User notes */
  notes?: string;
};
