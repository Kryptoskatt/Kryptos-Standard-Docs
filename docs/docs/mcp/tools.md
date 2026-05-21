---
id: mcp-tools
title: Tools Reference
sidebar_position: 2
---

# MCP Tools Reference

These are the 12 tools your AI uses to read and update your Kryptos data. You don't call these directly — instead, you ask your AI things in plain English ("show my top holdings", "add a manual BTC purchase") and it picks the right tool. This page lists what each tool does, along with example prompts you can try.

> **Tip:** Skim the example prompts under each tool to get a feel for what kinds of questions work well.

## Portfolio tools

Read your account, holdings, and historical portfolio value.

### get_user_info

Returns your basic Kryptos account info (name, email, workspace).

**Required Scope:** `profile`

**Parameters:** None

**Example prompt:**

> "Show me my Kryptos account profile"

---

### get_holdings

Returns your current crypto holdings — each asset's amount, value, cost basis, unrealized P&L, and 24-hour change.

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

Returns the data points for charting your portfolio value (and cost basis) over time.

**Required Scope:** `portfolios:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `days` | number | No | 7 | Number of days (1-365) |
| `portfolioId` | string | No | — | Portfolio ID filter |

**Example prompt:**

> "Plot my portfolio value over the last 30 days"

---

## Transaction tools

Search, summarize, recategorize, and add transactions.

### get_transactions

Search your transaction history with detailed filters. Use `get_integrations` first if you need to look up a wallet ID.

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

Returns totals and breakdowns of your transaction activity over a time period — useful for "how much did I trade last quarter?" type questions.

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

Changes the category (label) on one transaction — for example, marking a transfer as "Staking Rewards".

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

Changes the category on up to 100 transactions in one go — handy after a big import where everything came in with generic labels.

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

Adds transactions Kryptos doesn't already know about — old purchases from before you started tracking, off-chain trades, gifts, and so on. You can add up to 50 at once.

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

## DeFi & NFT tools

Inspect positions outside your spot wallet.

### get_defi_holdings

Returns your DeFi positions — anything lent, staked, farmed, or open as a derivative.

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

Returns the NFTs in your wallets, with collection info like floor price and traits.

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

## Profiling & integrations

Higher-level insights and a list of everything connected.

### get_profiling

Returns a big-picture view of your activity — your investor "type" (e.g. NFT Maniac, DeFi Hodler, Futures Trader, Hodler, BTC Keeper, Degen), a portfolio overview, asset breakdown, and recent activity summary.

**Required Scope:** `profile`

**Parameters:** None

**Example prompt:**

> "Analyze my trading profile and give me portfolio insights"

---

### get_integrations

Lists every wallet, exchange, and blockchain you've connected to Kryptos. Use this when you need a wallet ID to pass to another tool.

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

## Working with lots of results

Most tools return results in pages so the response stays manageable. If you have hundreds or thousands of transactions, your AI will page through them automatically when needed — you usually don't need to think about this.

For reference:

| Parameter | Default | Max | What it does |
|-----------|---------|-----|--------------|
| `limit` | 100 | 1000 | How many items to return at once |
| `offset` | 0 | — | How many items to skip (for the next page) |

`get_integrations` uses `page` / `pageSize` instead (default 25, max 200 per page).

---

## Next steps

- **[Reconciliation tools →](/docs/mcp/mcp-reconciliation)** – Find and fix gaps in your data
- **[MCP overview →](/docs/mcp/mcp-overview)** – Setup and configuration
