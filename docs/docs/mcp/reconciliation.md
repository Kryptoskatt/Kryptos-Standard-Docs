---
id: mcp-reconciliation
title: Reconciliation Tools
sidebar_position: 3
---

# Reconciliation Tools

Data quality validation and correction tools for cryptocurrency portfolios. Detect missing transactions, price data, cost basis, and counterparty identification issues.

All reconciliation tools require valid authentication via the MCP setup. Tools operate on the authenticated user's portfolio data and return current database state.

---

## get_missing_balances

Detect wallet balance mismatches between API-reported balance and calculated balance from transaction history.

**Required Scope:** `transactions:read`

**Parameters:** None

**Returns:** Balance discrepancies by currency and wallet.

**Interpretation:**
- **Negative difference** = missing buy/deposit transactions (API shows more than history calculates)
- **Positive difference** = missing sell/withdrawal transactions (API shows less than history calculates)

**Example prompt:**

> "Check my portfolio for any balance mismatches"

---

## get_missing_prices

Find transactions missing historical price data at the time of transaction.

**Required Scope:** `transactions:read`

**Parameters:** None

**Returns:** Transactions grouped by currency and source wallet that lack price data.

**Why this matters:** Without prices, P&L calculations fail and tax reports are incomplete.

**Common causes:**
- Low-cap tokens with no price history
- Transactions before token listing on price feeds
- Delisted tokens
- Private/unlisted tokens

**Example prompt:**

> "Show me all transactions that are missing price data"

---

## get_missing_purchases

Find sell transactions without corresponding purchase transactions (missing cost basis).

**Required Scope:** `transactions:read`

**Parameters:** None

**Returns:** Sell transactions grouped by currency and source wallet that lack purchase records.

**Why this matters:** Capital gains = sale price - cost basis. No cost basis means gains can't be calculated, and tax reports fail.

**Common causes:**
- Transferred crypto from external wallet (no purchase record)
- Received crypto as payment/gift (not categorized as acquisition)
- Pre-tracking purchases (bought before Kryptos tracking started)
- Airdrops/forks not recorded

**Example prompt:**

> "Find all my sells that are missing cost basis"

---

## get_uncategorized_transactions

Find deposits and withdrawals with default labels requiring manual categorization.

**Required Scope:** `transactions:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 100 | Maximum results |
| `offset` | number | No | 0 | Pagination offset |

**Returns:** Paginated list of transactions with generic/default labels.

**Example prompt:**

> "Show me transactions that need to be categorized"

---

### Supported Transaction Labels

When categorizing transactions, use only labels from this list:

**DeFi & Swaps:** `DeFi Swap`, `Swap`, `Trade`, `Cross Chain Swaps`, `Add Liquidity`, `Liquidity Withdrawal`, `Wrap`, `Unwrap`

**Buy/Sell:** `Buy`, `Sell`, `Buy (Fiat to Crypto)`, `Sell (Crypto to Fiat)`

**NFT Trading:** `NFT Buy`, `NFT Sell`, `Mint NFT`

**Rewards & Income:** `Staking Rewards`, `Farming Rewards`, `Mining`, `Reward`, `Cashback`, `Interest`, `Earn`

**Airdrops & Gifts:** `Airdrops`, `Incoming Gift`, `Royalties`, `Income`

**DeFi Operations (Deposits):** `Borrow`, `Collateral Withdrawal`, `Lend Redeem`, `Loan`, `Loan Interest`, `Funding Fee Received`, `Unstake`, `Vault Withdrawal`

**DeFi Operations (Withdrawals):** `Stake`, `Centralized Stake`, `Centralized Lending`, `Lend`, `Borrow Interest`, `Collateral Deposit`, `Vault Deposit`, `Resource Staking`

**Deposits:** `Deposit`, `Fiat Deposit`, `Bridge Receive`, `Fork`

**Withdrawals:** `Withdrawal`, `Fiat Withdrawal`, `Bridge Send`, `Expense`

**Fees & Costs:** `Fee`, `Margin Fee`, `Futures Expense`, `Bridge Fee`, `Burn`, `Funding Fee Paid`

**Payments:** `Payment`, `Approve`, `Liquidation`, `Loan Payback`

**Transfers:** `Transfer`, `Bridge Transfer`

**Investments:** `ICO investment`, `Donations`, `Outgoing Gift`, `Security Token Offering(STO)`

**Losses:** `Lost`, `Stolen`, `Casualty Loss`, `Realized Loss`, `Realized Profit`

**Special:** `Spam`, `Ignore`, `Failed`, `Unknown`

---

## get_high_pnl_transactions

Flag transactions with unusually high capital gains indicating potential data quality issues.

**Required Scope:** `transactions:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 100 | Maximum results |
| `offset` | number | No | 0 | Pagination offset |

**Detection method:** Uses statistical analysis to determine outlier threshold.

**Red flags:**
- Gain % &gt; 1000% (unless early crypto adopter)
- Cost basis suspiciously low (&lt; $10 for major crypto)
- Sale price doesn't match market price on transaction date

**Example prompt:**

> "Flag any transactions with suspiciously high gains"

---

## get_missing_integrations

Find unidentified transaction counterparties (addresses not recognized as known exchanges/wallets).

**Required Scope:** `integrations:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 100 | Maximum results |
| `offset` | number | No | 0 | Pagination offset |
| `timeStart` | string | No | — | Filter start time (ISO 8601) |
| `timeEnd` | string | No | — | Filter end time (ISO 8601) |

**Returns:** Paginated list of unrecognized counterparty addresses.

**Example prompt:**

> "Find any unknown addresses I've transacted with"

---

## Recommended Audit Sequence

### Phase 1: Data Completeness
Run once after initial import:

1. **`get_missing_balances`** → Fix missing transactions first
2. **`get_missing_prices`** → Ensure price coverage
3. **`get_missing_purchases`** → Establish cost basis

### Phase 2: Data Quality
Run before tax reporting:

4. **`get_uncategorized_transactions`** → Categorize everything
5. **`get_high_pnl_transactions`** → Fix outliers
6. **`get_missing_integrations`** → Label counterparties

### Phase 3: Ongoing Maintenance
Monthly or quarterly:

- Re-run all tools after adding new integrations
- Check uncategorized after bulk imports
- Audit high P&L before finalizing tax reports

---

## Common Patterns & Fixes

### Many missing balances across wallets

**Cause:** Partial transaction import (only recent history)
**Fix:** Re-import full transaction history from all sources, or use `create_manual_transaction` to add missing entries.

### Missing prices for specific date range

**Cause:** Price feed gap or exchange maintenance
**Fix:** Contact support or manually add prices for that period.

### All sales missing purchases

**Cause:** Transferred crypto from external source not tracked
**Fix:** Add "Transfer" transactions or initial "Buy" entries using `create_manual_transaction`.

### High P&L on small transactions

**Cause:** Wrong cost basis method (FIFO vs specific ID)
**Fix:** Check workspace cost basis settings in the Kryptos platform.

### Hundreds of uncategorized transactions

**Cause:** Bulk exchange import with generic labels
**Fix:** Use `bulk_update_transaction_labels` for pattern-based categorization (e.g., all from Uniswap Router = DeFi Swap).

---

## Write Operations

Use these tools to fix issues discovered during reconciliation:

### update_transaction_label

Update the label of a single transaction.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transactionId` | string | Yes | Transaction ID to update |
| `label` | string | Yes | New label (from supported labels list) |
| `reason` | string | No | Reason for the change |

### bulk_update_transaction_labels

Update labels for multiple transactions (max 100) in one call.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transactionIds` | string[] | Yes | Transaction IDs (max 100) |
| `label` | string | Yes | New label to apply |
| `reason` | string | No | Reason for changes |

### create_manual_transaction

Create manual transactions for missing trades, old purchases, or off-chain activities.

**Common scenarios:**

- **Old purchase before tracking:** Add a `trade` transaction with `sentCurrency` (USD) and `receivedCurrency` (BTC/ETH)
- **Staking reward:** Add a `deposit` with `receivedCurrency` only and label `Staking Rewards`
- **Transfer between wallets:** Add a `withdrawal` with `sentCurrency` and label `Transfer`

**Rules of thumb:**
- For **trades**: provide both `sentCurrency` and `receivedCurrency`
- For **deposits**: provide only `receivedCurrency`
- For **withdrawals**: provide only `sentCurrency`
- Always include `netValue.fiatValue` for accurate cost basis

---

## Next Steps

- **[MCP Overview →](/mcp/overview)** – Setup and configuration
- **[Tools Reference →](/mcp/tools)** – Portfolio and data tools
