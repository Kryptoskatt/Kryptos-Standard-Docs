---
id: mcp-reconciliation
title: Reconciliation Tools
sidebar_position: 3
---

# Reconciliation Tools

"Reconciliation" is the process of making sure your Kryptos data is clean and complete: every transaction is accounted for, every coin has a price, every sell has a matching purchase, and every transaction is properly categorized. Getting this right matters most around tax time — without it, P&L numbers and tax reports can be off.

These six tools help you find the gaps, and the write tools (see [Fixing what you find](#fixing-what-you-find) below) help you fix them.

---

## get_missing_balances

Spots cases where your wallet's actual balance doesn't match what your transaction history adds up to — a sign that some transactions are missing.

**Required Scope:** `transactions:read`

**Parameters:** None

**Returns:** Balance gaps by currency and wallet.

**How to read the result:**
- **Wallet has more than history shows** → you're missing some buys or deposits
- **Wallet has less than history shows** → you're missing some sells or withdrawals

**Example prompt:**

> "Check my portfolio for any balance mismatches"

---

## get_missing_prices

Finds transactions where Kryptos doesn't know the price of the coin at the time of the trade.

**Required Scope:** `transactions:read`

**Parameters:** None

**Returns:** Transactions (grouped by coin and wallet) that are missing a price.

**Why it matters:** Without a price, Kryptos can't calculate P&L or generate an accurate tax report for that transaction.

**Why this happens:**
- The coin is small or obscure and has no price history available
- The trade happened before the coin was listed on any price feed
- The coin has since been delisted
- It's a private or unlisted token

**Example prompt:**

> "Show me all transactions that are missing price data"

---

## get_missing_purchases

Finds sells where Kryptos doesn't know how the coin was originally acquired — i.e., the cost basis is missing.

**Required Scope:** `transactions:read`

**Parameters:** None

**Returns:** Sells (grouped by coin and wallet) with no matching buy.

**Why it matters:** Capital gain = what you sold for − what you paid for it. If Kryptos doesn't know what you paid, it can't calculate the gain, and your tax report will be incomplete.

**Why this happens:**
- You transferred coins in from a wallet Kryptos doesn't track
- You received them as a gift, payment, or airdrop and never categorized it as an acquisition
- You bought them before you started using Kryptos
- A fork or airdrop wasn't recorded

**Example prompt:**

> "Find all my sells that are missing cost basis"

---

## get_uncategorized_transactions

Finds deposits and withdrawals that still have generic labels and need to be properly categorized (e.g. as "Staking Rewards", "Airdrop", "Transfer", etc.).

**Required Scope:** `transactions:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 100 | Maximum results |
| `offset` | number | No | 0 | Pagination offset |

**Returns:** A paginated list of transactions still tagged with generic labels.

**Example prompt:**

> "Show me transactions that need to be categorized"

---

### Labels you can use

When categorizing, ask your AI to pick from this list (these are the categories Kryptos recognizes for tax and reporting purposes):

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

Flags transactions with unusually large gains — usually a sign that something's off (wrong cost basis, missing prior purchases, bad price data) rather than a real windfall.

**Required Scope:** `transactions:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 100 | Maximum results |
| `offset` | number | No | 0 | Pagination offset |

**How it decides what's "unusual":** Statistical analysis of your own transactions — it flags genuine outliers, not just big numbers.

**What usually indicates a real problem:**
- A gain over 1000% (possible for early adopters, but worth a second look)
- A suspiciously low cost basis (e.g. less than $10 for BTC or ETH)
- Sale price that doesn't match the market price on that date

**Example prompt:**

> "Flag any transactions with suspiciously high gains"

---

## get_missing_integrations

Finds addresses you've transacted with that Kryptos hasn't matched to a known exchange or wallet. Connecting these (or labeling them) makes your transaction history more meaningful.

**Required Scope:** `integrations:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 100 | Maximum results |
| `offset` | number | No | 0 | Pagination offset |
| `timeStart` | string | No | — | Filter start time (ISO 8601) |
| `timeEnd` | string | No | — | Filter end time (ISO 8601) |

**Returns:** A paginated list of unrecognized addresses you've sent to or received from.

**Example prompt:**

> "Find any unknown addresses I've transacted with"

---

## A good order to run these in

You don't have to follow this exactly, but this is the order that catches the most issues with the least re-work.

### After you first import your data

1. **`get_missing_balances`** — fill in missing transactions first
2. **`get_missing_prices`** — make sure every transaction has a price
3. **`get_missing_purchases`** — make sure every sell has a matching buy

### Before doing your taxes

4. **`get_uncategorized_transactions`** — give every transaction a proper category
5. **`get_high_pnl_transactions`** — investigate any suspiciously large gains
6. **`get_missing_integrations`** — label the unknown addresses

### Ongoing (monthly or quarterly)

- Re-run everything after connecting a new wallet or exchange
- Check uncategorized after any bulk import
- Audit high-P&L items before finalizing tax reports

---

## Common situations and how to handle them

### Lots of missing balances across many wallets

**Usually means:** Only partial transaction history was imported.
**Fix:** Re-import the full history from each wallet/exchange, or use `create_manual_transaction` to add the missing entries.

### Missing prices for a specific date range

**Usually means:** A gap in the price feed (e.g. exchange downtime).
**Fix:** Contact [support@kryptos.io](mailto:support@kryptos.io), or add prices manually for that window.

### Every sell shows as missing a purchase

**Usually means:** The coin was transferred in from a source Kryptos doesn't track.
**Fix:** Add "Transfer" entries or initial "Buy" entries with `create_manual_transaction`.

### Huge gains showing up on small transactions

**Usually means:** Your cost basis method (FIFO, LIFO, specific ID) doesn't match how you actually acquired the coin.
**Fix:** Check the cost basis setting for your workspace in the Kryptos dashboard.

### Hundreds of uncategorized transactions

**Usually means:** A bulk import dropped everything in with generic labels.
**Fix:** Use `bulk_update_transaction_labels` to fix them in groups (e.g. "everything from Uniswap Router → DeFi Swap").

---

## Fixing what you find

Once reconciliation surfaces an issue, these tools let you fix it:

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

Add transactions Kryptos doesn't already know about.

**Common examples:**

- **Old purchase from before you started tracking:** a `trade` with USD going out (`sentCurrency`) and BTC/ETH coming in (`receivedCurrency`)
- **Staking reward:** a `deposit` with only `receivedCurrency` and the label `Staking Rewards`
- **Transfer between two wallets:** a `withdrawal` with only `sentCurrency` and the label `Transfer`

**Quick rules:**
- A **trade** needs both `sentCurrency` and `receivedCurrency`
- A **deposit** needs only `receivedCurrency`
- A **withdrawal** needs only `sentCurrency`
- Always include `netValue.fiatValue` — it's what Kryptos uses for cost basis

---

## Next steps

- **[MCP overview →](/docs/mcp/mcp-overview)** – Setup and configuration
- **[Portfolio & Data tools →](/docs/mcp/mcp-tools)** – Read your holdings, transactions, and more
