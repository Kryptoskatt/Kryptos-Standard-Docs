# Kryptos Standard Types Documentation

This repository contains the standardized type definitions used across the Kryptos ecosystem. These types serve as the foundation for data structures in various Kryptos services and applications.

## Structure

The types are organized into the following categories:

- `asset.ts` - Asset and NFT related types
- `transaction.ts` - Transaction and ledger related types
- `tax.ts` - Tax calculation and PnL related types
- `holdings.ts` - Portfolio holdings related types
- `nft-balance.ts` - NFT balance and collection related types
- `defi.ts` - DeFi portfolio and protocol related types

## Quick Links

- [Asset Types](./asset.ts)
- [Transaction Types](./transaction.ts)
- [Tax Types](./tax.ts)
- [Holdings Types](./holdings.ts)
- [NFT Balance Types](./nft-balance.ts)
- [DeFi Types](./defi.ts)

## Usage

These types are designed to be imported and used in TypeScript projects. They provide consistent data structures across the Kryptos ecosystem.

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

## Type Categories

### Asset Types

Defines the structure for various asset types including cryptocurrencies, NFTs, and fiat currencies. Includes metadata like token standards, chain information, and provider IDs.

### Transaction Types

Contains types for handling various transaction scenarios including transfers, fees, and ledger entries. Supports both incoming and outgoing transactions with detailed metadata.

### Tax Types

Structures for tax calculations and profit/loss tracking. Includes cost basis, proceeds, and holding period information.

### Holdings Types

Types for tracking portfolio holdings including quantity, cost basis, market value, and unrealized PnL.

### NFT Balance Types

Specialized types for NFT holdings including collection information, metadata, and last sale information.

### DeFi Types

Comprehensive types for various DeFi activities including lending, staking, farming, derivatives, insurance, and vesting schedules.

## Contributing

When contributing to this repository, please ensure:

1. All types are properly documented with JSDoc comments
2. Types follow TypeScript best practices
3. Breaking changes are clearly documented
4. New types are added to the appropriate category file

## License

This repository is part of the Kryptos ecosystem. Please refer to the main license for usage terms.
