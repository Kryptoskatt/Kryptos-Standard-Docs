---
id: intro
title: Introduction
sidebar_position: 1
---

# Kryptos API Documentation

A comprehensive API for accessing cryptocurrency portfolio data, transactions, DeFi holdings, NFT collections, and portfolio analytics.

## Overview

The Kryptos APIs provide access to:

- **Portfolio Holdings** -- Track crypto assets across multiple wallets and chains
- **Transaction History** -- Complete transaction records with advanced filtering
- **DeFi Integration** -- Lending, staking, farming, and derivatives positions
- **NFT Management** -- Collection tracking with metadata and sales history
- **Portfolio Insights** -- Net worth, cost basis, allocation, and value over time
- **Reconciliation** -- Find missing prices, missing purchases, and unconnected accounts

## Pick your use case

Each guide covers one way of building on Kryptos, from setup to your first API call.

| Use case | Build this when | Guide |
| --- | --- | --- |
| **White-label backend** (early access) | Kryptos is the backend of your crypto product: your customers' wallets and exchanges, transactions, balances and tax, under your brand and without a Kryptos account. Need only the data? Use the [Integrations only](/docs/integrations-api/integrations-only) setup. | [White-label backend](/docs/integrations-api/overview) |
| **Kryptos Connect** | Your users connect their wallets and exchanges, or their Kryptos account, and share that data with your app (read only) | [Kryptos Connect](/docs/kryptos-connect/overview) |
| **Sign in with Kryptos** | Your app acts for a Kryptos user inside their own account, with OAuth 2.0 | [OAuth 2.0](/docs/authentication/oauth) |
| **API keys** | You automate one of your own Kryptos workspaces, server to server. Each key is valid for a single workspace, the one it was created in (paid plans) | [API keys](/docs/authentication/api-key) |
| **AI plugins** | You want your Kryptos data in ChatGPT, Claude or Cursor, with no code | [AI plugins](/docs/mcp/chatgpt) |

Every use case except API keys and AI plugins starts with the
**[Developer Portal setup](/docs/developer-portal)**, where you get your client ID and secret.

## Quick Start

**Base URL:** `https://api-v2.kryptos.io`

```bash
curl -X GET "https://api-v2.kryptos.io/v1/holdings" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Send your access token as a bearer token (API keys use the `x-api-key` header instead). The **[API Reference](/docs/api-reference/kryptos-api)**
lists the White-label endpoints; [Access by credential](/docs/api/access-matrix) shows what OAuth,
Connect and API keys can reach.

:::tip Migrating?
If you built against `connect.kryptos.io/api`, see **[Migrating from the previous API](/docs/api/migrating-from-connect-apis)** for the complete list of changes.
:::

## Support

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
- **GitHub:** [github.com/Kryptoskatt](https://github.com/Kryptoskatt)
