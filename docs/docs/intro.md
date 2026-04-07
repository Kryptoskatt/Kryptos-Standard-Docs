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
- **Portfolio Insights** -- Analytics and user classification
- **Tax Calculations** -- Cost basis, P&L, and tax reporting data

## Authentication Options

Kryptos provides two ways to access user portfolio data:

### OAuth 2.0 Authentication

Standard OAuth 2.0 flow for web applications where users authenticate directly with Kryptos. **[OAuth 2.0 Guide](/docs/authentication/oauth)**

### Kryptos Connect Widget

A pre-built widget (Web SDK & Mobile SDK) that handles the complete authentication flow for embedded integrations. **[Kryptos Connect Guide](/docs/kryptos-connect/overview)**

## Quick Start

```bash
curl -X GET "https://connect.kryptos.io/api/v1/holdings" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

:::info Step-by-Step Guide
New to Kryptos Connect? Follow our **[Developer Portal Setup Guide](/docs/developer-portal)** for detailed instructions with screenshots.
:::

## Next Steps

1. **[Developer Portal Setup](/docs/developer-portal)** -- Create your account and get credentials
2. **[Set up Authentication](/docs/authentication/oauth)** -- Configure OAuth 2.0 flow
3. **[Explore Endpoints](/docs/api/health)** -- Browse the API reference
4. **[View Types](/docs/reference/types)** -- TypeScript definitions

## Support

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
- **GitHub:** [github.com/Kryptoskatt](https://github.com/Kryptoskatt)
