---
id: intro
title: Introduction
sidebar_position: 1
slug: /
---

# Kryptos Connect API

A comprehensive API for accessing cryptocurrency portfolio data, transactions, DeFi holdings, NFT collections, and portfolio analytics.

## Overview

Kryptos Connect APIs provide access to:

- **Portfolio Holdings** – Track crypto assets across multiple wallets and chains
- **Transaction History** – Complete transaction records with advanced filtering
- **DeFi Integration** – Lending, staking, farming, and derivatives positions
- **NFT Management** – Collection tracking with metadata and sales history
- **Portfolio Insights** – Analytics and user classification
- **Tax Calculations** – Cost basis, P&L, and tax reporting data

## Use Cases

Kryptos Connect is ideal for:

| Use Case | Description |
|----------|-------------|
| **Portfolio Trackers** | Build portfolio dashboards that aggregate holdings across wallets and exchanges |
| **Tax Software** | Access transaction history and cost basis data for tax calculations |
| **DeFi Analytics** | Monitor DeFi positions, yields, and performance across protocols |
| **NFT Platforms** | Display NFT collections with metadata, floor prices, and sales history |
| **Risk Assessment** | Analyze portfolio composition for lending, insurance, or compliance |
| **Financial Advisors** | View client holdings with their consent for advisory services |

## Upcoming: Kryptos Connect Widget

:::tip Coming Soon
**Kryptos Connect** enables users to securely share their crypto portfolio data with third-party applications—with their explicit consent—through a single, easy-to-integrate widget. All data is delivered in a standardized format, making integration seamless for developers.

**Key Features:**

- 🔐 Secure OAuth 2.0 authorization flow
- 📊 User-consented data sharing
- 🧩 Single widget integration
- 📋 Standardized data format
- 🛡️ Granular permission scopes
:::

## API Versions

| Version | Path | Description |
|---------|------|-------------|
| **V1** | `/v1/*` | Modern format with standardized structure |
| **V0** | `/v0/*` | Legacy format (will be deprecated) |

## Quick Start

Get up and running in minutes:

**1. Register your application** → Obtain `client_id` and `client_secret`

**2. Implement OAuth flow** → Redirect users to authorize access

**3. Exchange code for tokens** → Receive `access_token` and `refresh_token`

**4. Call the API** → Fetch portfolio data with a single request

```bash
curl -X GET "https://connect.kryptos.io/api/v1/holdings" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

That's it! You're now ready to access user portfolio data.

## Features

| Feature | Description |
|---------|-------------|
| **11 Endpoints** | Complete API coverage |
| **2 Auth Methods** | OAuth 2.0 & API Key |
| **11 OAuth Scopes** | Granular permissions |
| **TypeScript Types** | Full type definitions |

## Next Steps

1. **[Set up Authentication](/authentication/oauth)** – Configure OAuth 2.0 or API Key
2. **[Explore Endpoints](/api/health)** – Browse the API reference
3. **[View Types](/reference/types)** – TypeScript definitions

## Support

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
- **GitHub:** [github.com/Kryptoskatt](https://github.com/Kryptoskatt)
