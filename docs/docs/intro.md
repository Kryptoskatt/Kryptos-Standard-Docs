---
id: intro
title: Introduction
sidebar_position: 1
---

# Kryptos API Documentation

A comprehensive API for accessing cryptocurrency portfolio data, transactions, DeFi holdings, NFT collections, and portfolio analytics.

## Overview

Kryptos Connect APIs provide access to:

- **Portfolio Holdings** -- Track crypto assets across multiple wallets and chains
- **Transaction History** -- Complete transaction records with advanced filtering
- **DeFi Integration** -- Lending, staking, farming, and derivatives positions
- **NFT Management** -- Collection tracking with metadata and sales history
- **Portfolio Insights** -- Net worth, cost basis, allocation, and value over time
- **Reconciliation** -- Find missing prices, missing purchases, and unconnected accounts

## Authentication Options

Kryptos provides two ways to access user portfolio data:

### OAuth 2.0 Authentication

Standard OAuth 2.0 flow for web applications where users authenticate directly with Kryptos. **[OAuth 2.0 Guide](/docs/authentication/oauth)**

### Kryptos Connect Widget

A pre-built widget (Web SDK & Mobile SDK) that handles the complete authentication flow for embedded integrations. **[Kryptos Connect Guide](/docs/kryptos-connect/overview)**

## Quick Start

**Base URL:** `https://api-v2.kryptos.io`

```bash
curl -X GET "https://api-v2.kryptos.io/v1/holdings" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

A bearer token is the only header you need. See the **[API Overview](/docs/api/overview)** for the
base URL, workspace resolution, response shapes and error codes.

:::info Step-by-Step Guide
New to Kryptos Connect? Follow our **[Developer Portal Setup Guide](/docs/developer-portal)** for detailed instructions with screenshots.
:::

:::tip Migrating?
If you built against `connect.kryptos.io/api`, see **[Migrating from the previous API](/docs/api/migrating-from-connect-apis)** for the complete list of changes.
:::

## Next Steps

1. **[Developer Portal Setup](/docs/developer-portal)** -- Create your account and get credentials
2. **[Set up Authentication](/docs/authentication/oauth)** -- Configure OAuth 2.0 flow
3. **[API Overview](/docs/api/overview)** -- Base URL, auth, envelopes, and scopes
4. **[Explore Endpoints](/docs/api/holdings)** -- Browse the API reference
5. **[View Types](/docs/reference/types)** -- TypeScript definitions

## Support

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
- **GitHub:** [github.com/Kryptoskatt](https://github.com/Kryptoskatt)
