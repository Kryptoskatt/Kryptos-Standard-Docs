---
id: types
title: TypeScript Types
sidebar_position: 2
---

# Kryptos Standard Types

Standardized type definitions used across the Kryptos ecosystem. These types serve as the foundation for data structures in various Kryptos services and applications.

📦 **GitHub Repository:** [Kryptos-Standard-Docs/types](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/README.md)

:::info Abbreviated on purpose
The interfaces below show the fields you will use most, not every field a response carries. The
endpoint pages under [API Reference](/docs/api/overview) are authoritative — they document optional
fields, nullability, and which fields appear only on list or detail responses.
:::

:::caution Two things that bite
`roiPercentage` is `number | null` — `null` means "no cost basis recorded", which is not the same as a
0% return. And ledger `quantity` is a **decimal string**, not a number, so that 18-decimal amounts
survive; parsing it as a float loses precision on large balances.
:::

## Available Type Files

| File                                                                                                    | Description                               |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [`asset.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/asset.ts)             | Asset and NFT related types               |
| [`transaction.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/transaction.ts) | Transaction and ledger related types      |
| [`holdings.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/holdings.ts)       | Portfolio holdings related types          |
| [`defi.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/defi.ts)               | DeFi portfolio and protocol related types |
| [`nft-balance.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/nft-balance.ts) | NFT balance and collection related types  |
| [`tax.ts`](https://github.com/Kryptoskatt/Kryptos-Standard-Docs/blob/main/types/tax.ts)                 | Tax calculation and PnL related types     |

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
  workspaceId: string;
  transactionPlatformId?: string;
  timestamp: number; // Unix ms
  type?: string | null; // derived from `label`
  label: string;
  description?: string;
  notes?: string;
  importSource?: {
    type: "API" | "CSV" | "Manual";
    importedAt: number;
    walletId?: string;
    syncId?: string;
    functionName?: string;
  };
  isManual: boolean;
  isEdited: boolean;
  isDefiTrx: boolean;
  isNFTTrx: boolean;
  isMissingTransaction?: boolean;
  tags: string[];
  comments?: { id: string; text: string; timestamp: number; author?: string }[];
  incomingAssets: LedgerLeg[];
  outgoingAssets: LedgerLeg[];
  fee: LedgerLeg[];
  netValue?: { fiatValue: number | null; currency: string };
  totalCostbasis?: number;
  totalGains?: number;
  explorerLink?: string | null;
}

interface LedgerLeg {
  id: string;
  assetId: string | null;
  assetRaw: Record<string, unknown>;
  quantity: string; // decimal string — never parse as a float
  baseCurrency: string;
  price: { price: number; baseCurrency: string; timestamp: number; source: string } | null;
  value?: number | null; // quantity × price, derived on read
  fromAccount: AccountType | null;
  toAccount: AccountType | null;
  label?: string | null;
  description?: string | null;
  asset: { symbol: string; name: string; logoUrl: string | null; type: string } | null;
}
```

### Holdings Types

Types for tracking portfolio holdings including quantity, cost basis, market value, and unrealized PnL.

```typescript
interface HoldingsType {
  assetId: string;
  asset: Asset;
  totalQuantity: number;
  costBasis: number;
  costPerUnit: number;
  marketPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  roiPercentage: number | null; // null when cost basis is 0 — not the same as 0%
  change24h: number; // absolute
  change24hPercentage: number; // percentage
  baseCurrency: string;
  isSpam: boolean;
  transactionCount: number;
  assetDistribution: {
    integrationId: string;
    quantity: number;
    account: AccountType;
    allocationPercentage: number;
    transactionCount: number;
    portfolioId?: string;
    portfolioName?: string;
  }[];
}

interface AccountType {
  provider: string;
  providerPublicName?: string;
  publicAddress?: string;
  walletId?: string;
  logoUrl?: string;
  alias?: string;
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
  id: string;
  owner: AccountType;
  protocolId: string;
  protocolName: string;
  protocolLogoUrl?: string;
  chain: string;
  positionName?: string;
  category: string; // 18 values — see the DeFi endpoint reference
  pool?: Record<string, unknown>;
  portfolio: Record<string, unknown>;
  totalValue: PriceModel;
  debtValue?: PriceModel;
  netValue: PriceModel;
  isActive: boolean;
}

interface PriceModel {
  price: number;
  baseCurrency: string;
  timestamp: number;
  source: string;
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
  const response = await fetch("https://api-v2.kryptos.io/v1/holdings", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const body = await response.json();
  return body.data as HoldingsType[];
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
