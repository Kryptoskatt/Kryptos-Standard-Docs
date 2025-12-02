---
id: intro
title: Introduction
sidebar_position: 1
slug: /
---

# Kryptos Connect API

Comprehensive API for accessing cryptocurrency portfolio data, transactions, DeFi holdings, NFT collections, and user analytics.

## Overview

Kryptos Connect APIs provide access to:

- **Portfolio Holdings** - Track crypto assets across multiple wallets and chains
- **Transaction History** - Complete transaction records with advanced filtering
- **DeFi Integration** - Lending, staking, farming, and derivatives positions
- **NFT Management** - Collection tracking with metadata and sales history
- **User Analytics** - Portfolio profiling and classification
- **Tax Calculations** - Cost basis, P&L, and tax reporting data

## Upcoming: Kryptos Connect

:::tip Coming Soon
**Kryptos Connect** enables users to securely share their crypto portfolio data with third-party applications—with their explicit consent—through a single, easy-to-integrate widget. All data is delivered in a standardized format, making integration seamless for developers.

**Key Features:**

- 🔐 Secure authorization flow
- 📊 User-consented data sharing
- 🧩 Single widget integration
- 📋 Standardized data format
- 🛡️ Granular permission scopes

:::

## API Versions

| Version | Path    | Description                               |
| ------- | ------- | ----------------------------------------- |
| **V1**  | `/v1/*` | Modern format with standardized structure |
| **V0**  | `/v0/*` | Legacy format (will be deprecated)        |

## Quick Example

```bash
curl -X GET "https://connect.kryptos.io/api/v1/holdings" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Features

| Feature              | Description           |
| -------------------- | --------------------- |
| **11 Endpoints**     | Complete API coverage |
| **2 Auth Methods**   | OAuth 2.0 & API Key   |
| **11 OAuth Scopes**  | Granular permissions  |
| **TypeScript Types** | Full type definitions |

## Getting Started

1. **[Set up Authentication](/authentication/oauth)** - Configure OAuth 2.0 or API Key
2. **[Explore Endpoints](/api/health)** - Browse the API reference
3. **[View Types](/reference/types)** - TypeScript definitions

## Support

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
- **GitHub:** [github.com/kryptoskatt](https://github.com/kryptoskatt)
