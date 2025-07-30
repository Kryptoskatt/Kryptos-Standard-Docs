# Kryptos Standard Documentation

This repository contains the standardized type definitions and documentation for the Kryptos ecosystem. These types serve as the foundation for data structures across various Kryptos services and applications.

## Overview

Kryptos is a comprehensive crypto asset management and tracking system. This repository defines the standard types used throughout the ecosystem for:

- Asset Management (cryptocurrencies, NFTs, fiat)
- Transaction Tracking
- Tax Calculations
- Portfolio Holdings
- NFT Balance Management
- DeFi Protocol Integration

## Type Documentation

All type definitions are located in the `/types` directory and are thoroughly documented. Each type includes detailed JSDoc comments explaining its purpose and usage.

### Core Types

- **Asset Types** (`/types/asset.ts`): Defines the structure for various asset types including cryptocurrencies, NFTs, and fiat currencies.
- **Transaction Types** (`/types/transaction.ts`): Handles transaction tracking, transfers, and ledger entries.
- **Tax Types** (`/types/tax.ts`): Structures for tax calculations and profit/loss tracking.
- **Holdings Types** (`/types/holdings.ts`): Portfolio management and asset distribution tracking.
- **NFT Balance Types** (`/types/nft-balance.ts`): Specialized types for NFT holdings and collections.
- **DeFi Types** (`/types/defi.ts`): Comprehensive types for various DeFi activities.

## Usage

These type definitions can be imported into any TypeScript project that interacts with the Kryptos ecosystem:

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

## Features

- **Comprehensive Asset Support**: Support for all major asset types including cryptocurrencies, NFTs, and fiat currencies.
- **Detailed Transaction Tracking**: Complete transaction history with support for complex scenarios.
- **Tax Calculation Support**: Structures for tracking cost basis, proceeds, and profit/loss.
- **Portfolio Management**: Track holdings across multiple accounts and chains.
- **NFT Support**: Detailed NFT tracking including collection information and sales history.
- **DeFi Integration**: Support for various DeFi activities including:
  - Lending and Borrowing
  - Staking
  - Yield Farming
  - Derivatives Trading
  - Insurance
  - Token Vesting

## Contributing

We welcome contributions to improve and expand these type definitions. Please ensure:

1. All types are properly documented with JSDoc comments
2. Types follow TypeScript best practices
3. Breaking changes are clearly documented
4. New types are added to the appropriate category file

## License

This repository is part of the Kryptos ecosystem. Please refer to the main license for usage terms.
