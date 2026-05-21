---
id: mcp-tools
title: Tools Reference
sidebar_position: 2
---

# MCP Tools Reference

Reference for all 12 portfolio and data tools available in the Kryptos MCP Server.

## Portfolio Tools

### get_user_info

Get authenticated user's profile information.

**Required Scope:** `profile`

**Parameters:** None

**Example prompt:**

> "Show me my Kryptos account profile"

---

### get_holdings

Get cryptocurrency portfolio holdings with asset distribution, cost basis, unrealized P&L, and 24h changes.

**Required Scope:** `portfolios:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 100 | Max holdings (max: 1000) |
| `offset` | number | No | 0 | Pagination offset |

**Example prompt:**

> "Show my top 10 holdings by market value"

---

### get_holdings_graph

Get historical portfolio value and cost basis graph data over time.

**Required Scope:** `portfolios:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `days` | number | No | 7 | Number of days (1-365) |
| `portfolioId` | string | No | — | Portfolio ID filter |

**Example prompt:**

> "Plot my portfolio value over the last 30 days"

---

## Transaction Tools

### get_transactions

Get transaction history with advanced filtering. Use `get_integrations` to discover available wallet IDs.

**Required Scope:** `transactions:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `walletId` | string | No | — | Filter by wallet ID (comma-separated) |
| `currencyId` | string | No | — | Filter by currency/asset ID (comma-separated) |
| `trxId` | string | No | — | Find specific transaction by ID |
| `transactionType` | string | No | — | Type: `swap`, `deposit`, `withdraw` |
| `label` | string | No | — | Filter by label (comma-separated) |
| `timeStart` | string | No | — | Start date (ISO 8601) |
| `timeEnd` | string | No | — | End date (ISO 8601) |
| `isNft` | boolean | No | — | Filter NFT transactions |
| `isMissingPrice` | boolean | No | — | Filter missing price data |
| `isMissingPurchase` | boolean | No | — | Filter missing purchase data |
| `isEdited` | boolean | No | — | Filter manually edited |
| `isManual` | boolean | No | — | Filter manually created |
| `order` | string | No | — | Sort: `asc` or `desc` |
| `limit` | number | No | 100 | Max results (max: 1000) |
| `offset` | number | No | 0 | Pagination offset |

**Example prompts:**

> "Show my last 20 transactions"
> "Find all swap transactions from January 2024"

---

### get_transaction_summary

Get aggregated transaction statistics.

**Required Scope:** `transactions:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `timeStart` | string | No | — | Start date (ISO 8601) |
| `timeEnd` | string | No | — | End date (ISO 8601) |

**Example prompt:**

> "Summarize my transaction activity for Q1 2024"

---

### update_transaction_label

Update the label (category) of a single transaction.

**Required Scope:** `transactions:write`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transactionId` | string | Yes | Transaction ID to update |
| `label` | string | Yes | New Kryptos label (from supported labels) |
| `reason` | string | No | Reason for the change |

**Example prompt:**

> "Categorize transaction abc123 as 'Staking Rewards'"

---

### bulk_update_transaction_labels

Update labels for multiple transactions at once.

**Required Scope:** `transactions:write`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transactionIds` | string[] | Yes | Transaction IDs to update (max 100) |
| `label` | string | Yes | New Kryptos label to apply |
| `reason` | string | No | Reason for the changes |

**Example prompt:**

> "Mark all 50 incoming UNI transactions as 'Airdrops'"

---

### create_manual_transaction

Create manual transaction(s) for missing trades, old purchases, or off-chain activities.

**Required Scope:** `transactions:write`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `walletId` | string | Yes | Wallet ID (from `get_integrations`) |
| `transactions` | object[] | Yes | Array of transaction objects (max 50) |

**Transaction Object Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `timestamp` | number | Yes | Unix timestamp in milliseconds |
| `transactionType` | string | Yes | `deposit`, `withdrawal`, `trade`, or `payment` |
| `transactionId` | string | Yes | Unique ID (e.g., `manual_BTC_buy_2024`) |
| `description.title` | string | No | Transaction title |
| `description.desc` | string | No | Transaction description |
| `sentCurrency.currency` | string | Conditional | Currency sent |
| `sentCurrency.amount` | number | Conditional | Amount sent |
| `receivedCurrency.currency` | string | Conditional | Currency received |
| `receivedCurrency.amount` | number | Conditional | Amount received |
| `fee.currency` | string | No | Fee currency |
| `fee.amount` | number | No | Fee amount |
| `netValue.fiatValue` | number | No | Fiat value at transaction time |
| `label` | string | No | Kryptos label for categorization |

**Example prompt:**

> "Add a manual BTC purchase of 0.5 BTC for $20,000 on January 15, 2024 in my Coinbase wallet"

---

## DeFi & NFT Tools

### get_defi_holdings

Get DeFi positions (lending, staking, farming, derivatives).

**Required Scope:** `portfolios:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `source` | string | No | — | Comma-separated sources |
| `protocol` | string | No | — | Comma-separated protocols |
| `chain` | string | No | — | Comma-separated chains |
| `limit` | number | No | 100 | Max results (max: 1000) |
| `offset` | number | No | 0 | Pagination offset |

**Example prompt:**

> "Show my staking positions on Ethereum"

---

### get_nft_holdings

Get NFT holdings with collection metadata.

**Required Scope:** `portfolios:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `source` | string | No | — | Comma-separated sources |
| `collection` | string | No | — | Comma-separated collections |
| `chain` | string | No | — | Comma-separated chains |
| `tokenId` | string | No | — | Specific NFT token ID |
| `contract` | string | No | — | Specific contract address |
| `limit` | number | No | 100 | Max results (max: 1000) |
| `offset` | number | No | 0 | Pagination offset |

**Example prompt:**

> "List my Bored Ape NFTs with floor prices"

---

## Profiling & Integrations

### get_profiling

Get comprehensive user profiling data including classification, portfolio overview, asset breakdown, activity summary, and AI-ready insights.

**Required Scope:** `profile`

**Parameters:** None

**User classifications include:** NFT Maniac, DeFi Hodler, Futures Trader, Hodler, BTC Keeper, Degen

**Example prompt:**

> "Analyze my trading profile and give me portfolio insights"

---

### get_integrations

Get connected wallets, exchanges, and blockchain integrations.

**Required Scope:** `integrations:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `pageSize` | number | No | 25 | Items per page (max: 200) |
| `searchedKey` | string | No | — | Search term for integration names/addresses |

**Example prompt:**

> "Show all my connected exchanges and wallets"

---

## Pagination

Many tools support pagination via `limit` and `offset` parameters:

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `limit` | 100 | 1000 | Number of items per page |
| `offset` | 0 | — | Number of items to skip |

For tools using `page`/`pageSize` (get_integrations):

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `page` | 1 | — | Page number |
| `pageSize` | 25 | 200 | Items per page |

---

## Next Steps

- **[Reconciliation Tools →](/mcp/mcp-reconciliation)** – Data quality validation and correction tools
- **[MCP Overview →](/mcp/mcp-overview)** – Setup and configuration
