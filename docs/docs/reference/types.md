---
id: types
title: TypeScript Types
sidebar_position: 2
---

# Kryptos Standard Types

Standardized type definitions used across the Kryptos ecosystem. These types serve as the foundation for data structures in various Kryptos services and applications.

📦 **GitHub Repository:** [Kryptos-Standard-Docs/types](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/README.md)

## Available Type Files

| File | Description |
|------|-------------|
| [`asset.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/asset.ts) | Asset and NFT related types |
| [`transaction.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/transaction.ts) | Transaction and ledger related types |
| [`holdings.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/holdings.ts) | Portfolio holdings related types |
| [`defi.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/defi.ts) | DeFi portfolio and protocol related types |
| [`nft-balance.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/nft-balance.ts) | NFT balance and collection related types |
| [`tax.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/tax.ts) | Tax calculation and PnL related types |

## Installation

```typescript
import {
  Asset,
  Transaction,
  TaxPnL,
  HoldingsType,
  NFTBalance,
  DefiHolding,
} from "@kryptos/types";
```

Or copy the type files directly:

```bash
cp -r types/ your-project/src/types/
```

## Type Categories

### Asset Types

Defines the structure for various asset types including cryptocurrencies, NFTs, and fiat currencies. Includes metadata like token standards, chain information, and provider IDs.

```typescript
interface Asset {
  tokenId: string;
  symbol: string;
  publicName: string;
  chainId?: string;
  logoUrl?: string;
  standard?: string;
  explorerUrl?: string;
  category?: string;
  type: "crypto" | "nft" | "fiat";
  providerId?: {
    coingecko?: string;
    coinmarketcap?: string;
  };
}
```

### Transaction Types

Contains types for handling various transaction scenarios including transfers, fees, and ledger entries. Supports both incoming and outgoing transactions with detailed metadata.

```typescript
interface Transaction {
  id: string;
  transactionPlatfromId: string;
  timestamp: number;
  label: string;
  description?: string;
  incomingAssets: TransactionAsset[];
  outgoingAssets: TransactionAsset[];
  fee: TransactionAsset[];
  metadata: {
    importSource: string;
    isManual: boolean;
    isEdited: boolean;
    isDefiTrx: boolean;
    isNFTTrx: boolean;
  };
  tags: string[];
}
```

### Holdings Types

Types for tracking portfolio holdings including quantity, cost basis, market value, and unrealized PnL.

```typescript
interface HoldingsType {
  asset: Asset;
  totalQuantity: number;
  costbasis: number;
  marketPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  baseCurrency: string;
  "24hrChange": number;
  assetDistribution: {
    quantity: number;
    account: {
      provider: string;
      walletId: string;
    };
    allocationPercentage: number;
  }[];
}
```

### Tax Types

Structures for tax calculations and profit/loss tracking. Includes cost basis, proceeds, and holding period information.

```typescript
interface TaxPnL {
  asset: Asset;
  quantity: number;
  costBasis: number;
  proceeds: number;
  gainLoss: number;
  holdingPeriod: "short" | "long";
  acquisitionDate: number;
  disposalDate: number;
}
```

### NFT Balance Types

Specialized types for NFT holdings including collection information, metadata, and last sale information.

```typescript
interface NFTBalance {
  id: string;
  contractAddress: string;
  tokenId: string;
  name: string;
  description?: string;
  ercType: "ERC-721" | "ERC-1155";
  price: { price: number; baseCurrency: string };
  collection: {
    name: string;
    floorPrice: { price: number; baseCurrency: string }[];
  };
}
```

### DeFi Types

Comprehensive types for various DeFi activities including lending, staking, farming, derivatives, insurance, and vesting schedules.

```typescript
interface DefiHolding {
  holdingId: string;
  owner: { provider: string; walletId: string; publicAddress: string };
  protocolName: string;
  chain: string;
  category: "lending" | "staking" | "farming" | "liquidity" | "derivatives";
  totalValue: { price: number; baseCurrency: string };
  netValue: { price: number; baseCurrency: string };
}
```

## Usage Example

```typescript
import { Asset } from "./types/asset";
import { Transaction } from "./types/transaction";
import { HoldingsType } from "./types/holdings";
import { DefiHolding } from "./types/defi";
import { NFTBalance } from "./types/nft-balance";

// Define an asset
const bitcoin: Asset = {
  tokenId: "bitcoin",
  symbol: "BTC",
  publicName: "Bitcoin",
  chainId: "bitcoin",
  logoUrl: "https://...",
  standard: "Native",
  explorerUrl: "https://blockchain.com",
  category: "cryptocurrency",
  type: "crypto",
  providerId: { coingecko: "bitcoin" },
};

// Use with API responses
async function getTypedHoldings(): Promise<HoldingsType[]> {
  const response = await fetch("https://connect.kryptos.io/api/v1/holdings", {
    headers: { "X-API-Key": API_KEY },
  });

  const data = await response.json();
  return data.holdings as HoldingsType[];
}
```

## Contributing

When contributing to the types repository, please ensure:

1. All types are properly documented with JSDoc comments
2. Types follow TypeScript best practices
3. Breaking changes are clearly documented
4. New types are added to the appropriate category file

## Resources

- [GitHub Repository](https://github.com/Kryptoskatt/Kryptos-Standard-Docs)
- [Types README](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/README.md)
