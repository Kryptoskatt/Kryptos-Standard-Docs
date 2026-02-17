---
id: transactions
title: Transactions
sidebar_position: 2
---

# Transactions (Legacy)

:::warning Legacy Endpoint
This endpoint will be deprecated. Use `/v1/transactions` for new integrations. Migrate to V1 when made live.
:::

**Base URL:** `https://connect.kryptos.io/api`

## GET Transactions

<span className="badge badge--get">GET</span> `/v0/transactions`

Retrieve user's transaction history in legacy format.

### Query Parameters

Same as `/v1/transactions`

---

## POST Transactions

<span className="badge badge--post">POST</span> `/v0/transactions`

Create new transactions manually.

**Required Permission:** `transactions:write`

### Request Body Schema

:::tip Getting Wallet IDs
To get valid `walletId` values for your connected wallets, call `GET /api/integrations`. See [Integrations](/api/integrations) documentation for details.
:::

```typescript
{
  walletId: string (required),           // ID of the wallet for these transactions (get from integrations list)
  transactions: [                         // Array of transaction objects (min: 1, required)
    {
      timestamp: number (required),       // Transaction timestamp in Unix milliseconds
      transactionType: enum (required),   // Must be: "deposit" | "withdrawal" | "trade" | "payment"
      transactionId: string (required),   // Unique transaction identifier

      description?: {                     // Optional transaction description
        title: string (required),         // Transaction title
        desc: string (required)           // Detailed description
      },

      sentCurrency?: {                    // Optional - Currency sent
        currency: string (required),      // Currency symbol (e.g., "BTC", "ETH")
        amount: number (required),        // Amount of currency
        contractAddress?: string          // Token contract address (for ERC-20, etc)
      },

      sender?: {                          // Optional - For deposits: can attach sender details
        name?: string,                    // Sender name in UPPERCASE (e.g., "BINANCE")
        publicName?: string,              // Public display name from integrations list (e.g., "Binance")
        address?: string,                 // Blockchain address
        walletId?: string,                // Only if sender wallet exists in Kryptos system
        logo_url?: string,                // URL to wallet/provider logo
        portfolioId?: string,             // Portfolio identifier
        portfolioName?: string            // Portfolio name
      } | null,

      receivedCurrency?: {                // Optional - Currency received
        currency: string (required),      // Currency symbol
        amount: number (required),        // Amount of currency
        contractAddress?: string          // Token contract address
      },

      receiver?: {                        // Optional - For withdrawals/payments: can attach receiver details
        name?: string,                    // Receiver name in UPPERCASE (e.g., "COINBASE")
        publicName?: string,              // Public display name from integrations list (e.g., "Coinbase")
        address?: string,                 // Blockchain address
        walletId?: string,                // Only if receiver wallet exists in Kryptos system
        logo_url?: string,                // URL to logo
        portfolioId?: string,             // Portfolio identifier
        portfolioName?: string            // Portfolio name
      } | null,

      fee?: {                             // Optional - Transaction fee
        currency: string (required),      // Fee currency symbol
        amount: number (required),        // Fee amount
        contractAddress?: string          // Token contract address
      },

      feeValue?: {                        // Optional - Fiat value of the fee
        fiatValue: number | null,         // Fiat value (can be null)
        priceAccuracy?: string,           // Price accuracy indicator (e.g., "high", "low")
        baseCurrency?: string             // Base currency (e.g., "USD", "EUR")
      },

      netValue?: {                        // Optional - Net fiat value of transaction
        fiatValue: number | null,         // Net fiat value (can be null)
        priceAccuracy?: string,           // Price accuracy indicator
        baseCurrency?: string             // Base currency
      },

      label?: enum                        // Optional - Must be one of the labels listed below
    }
  ]
}
```

<details style={{backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '6px'}}>
<summary style={{cursor: 'pointer', color: 'var(--ifm-color-primary)', fontWeight: '600'}}>📄 Click to view full example</summary>

```json
{
  "walletId": "wallet_123",
  "transactions": [
    {
      "timestamp": 1640995200000,
      "transactionType": "trade",
      "transactionId": "manual_001",
      "description": {
        "title": "Manual Trade",
        "desc": "Bought Bitcoin"
      },
      "sentCurrency": {
        "currency": "USD",
        "amount": 50000,
        "contractAddress": "0x..."
      },
      "sender": {
        "name": "ETHEREUM",
        "publicName": "Ethereum",
        "address": "0x742d35...",
        "walletId": "ethereum",
        "logo_url": "https://storage.googleapis.com/kryptos-public/logos/ethereum.png",
        "portfolioId": "portfolio_123",
        "portfolioName": "Main Portfolio"
      },
      "receivedCurrency": {
        "currency": "BTC",
        "amount": 1.0,
        "contractAddress": "0x..."
      },
      "receiver": {
        "name": "BINANCE",
        "publicName": "Binance",
        "address": "0x123abc...",
        "walletId": "binance",
        "logo_url": "https://storage.googleapis.com/kryptos-public/logos/binance.png",
        "portfolioId": "portfolio_456",
        "portfolioName": "Exchange Portfolio"
      },
      "fee": {
        "currency": "ETH",
        "amount": 0.005,
        "contractAddress": "0x..."
      },
      "feeValue": {
        "fiatValue": 10.50,
        "priceAccuracy": "high",
        "baseCurrency": "USD"
      },
      "netValue": {
        "fiatValue": 50010.50,
        "priceAccuracy": "high",
        "baseCurrency": "USD"
      },
      "label": "Buy"
    }
  ]
}
```

</details>

### Sender/Receiver Guidelines by Transaction Type

:::important Sender/Receiver Integration Details
The `walletId` field in `sender` or `receiver` objects is **only needed if the wallet exists in the Kryptos system**. If the sending/receiving wallet is external (not tracked in Kryptos), you can omit the `walletId` and just provide `address`, `name`, etc.

When referencing an integration, the `name` and `publicName` fields must match the corresponding values from the [Public Integrations List](/public-endpoints/integrations).
:::

| Transaction Type | When to Attach Sender | When to Attach Receiver | Notes |
| ---------------- | --------------------- | ----------------------- | ----- |
| `deposit`        | ✅ **Recommended**    | ❌ Not needed          | Attach sender details; `walletId` only if sender is in Kryptos |
| `withdrawal`     | ❌ Not needed         | ✅ **Recommended**     | Attach receiver details; `walletId` only if receiver is in Kryptos |
| `payment`        | ❌ Not needed         | ✅ **Recommended**     | Mostly for fees; `walletId` only if receiver is in Kryptos |
| `trade`          | ❌ Not needed         | ❌ Not needed          | Swaps don't require sender/receiver attachment |

**Example for Deposit (sender is a Kryptos wallet):**
```json
{
  "transactionType": "deposit",
  "sender": {
    "walletId": "binance",
    "name": "BINANCE",
    "publicName": "Binance"
  }
}
```

**Example for Deposit (sender is external):**
```json
{
  "transactionType": "deposit",
  "sender": {
    "address": "0x1234567890abcdef",
    "name": "EXTERNAL WALLET"
  }
}
```

**Example for Withdrawal (receiver is external):**
```json
{
  "transactionType": "withdrawal",
  "receiver": {
    "address": "0xabcdef1234567890",
    "name": "HARDWARE WALLET"
  }
}
```

:::tip Deriving name and publicName
- `name`: Use **UPPERCASE** (e.g., "BINANCE", "ETHEREUM")
- `publicName`: Use the value from the [Public Integrations List](/public-endpoints/integrations) (e.g., "Binance", "Ethereum")
:::

### Transaction Labels

:::info
The `label` field **must be one of the following values exactly as shown** (case-sensitive). Each label is associated with a specific transaction type.
:::

<details style={{backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '6px'}}>
<summary style={{cursor: 'pointer', color: 'var(--ifm-color-primary)', fontWeight: '600'}}>📋 Click to view all available labels (74 labels)</summary>

| Label                          | Transaction Type | Description                       |
| ------------------------------ | ---------------- | --------------------------------- |
| `Add Liquidity`                | `trade`          | Adding tokens to a liquidity pool in DeFi protocols (e.g., Uniswap, PancakeSwap) |
| `Airdrops`                     | `deposit`        | Free tokens received from blockchain projects or promotional campaigns |
| `Approve`                      | `payment`        | Smart contract approval to allow spending of tokens on your behalf |
| `Income`                       | `deposit`        | General taxable income from cryptocurrency activities |
| `Borrow`                       | `deposit`        | Receiving borrowed assets from DeFi lending protocols (Aave, Compound) |
| `Borrow Interest`              | `withdrawal`     | Interest payments on borrowed assets in lending protocols |
| `Bridge Receive`               | `deposit`        | Receiving tokens from a cross-chain bridge transfer |
| `Bridge Send`                  | `withdrawal`     | Sending tokens through a cross-chain bridge to another blockchain |
| `Burn`                         | `withdrawal`     | Permanently destroying tokens by sending to a burn address |
| `Buy`                          | `trade`          | Purchasing cryptocurrency with another crypto or fiat currency |
| `Cashback`                     | `deposit`        | Rewards received back from purchases or transactions (e.g., crypto cards) |
| `Casualty Loss`                | `withdrawal`     | Loss of assets due to theft, hacks, or other unforeseen events |
| `Collateral Deposit`           | `withdrawal`     | Depositing assets as collateral for loans or leveraged positions |
| `Collateral Withdrawal`        | `deposit`        | Withdrawing collateral after closing positions or repaying loans |
| `DeFi Swap`                    | `trade`          | Swapping tokens through decentralized exchanges (DEXs) like Uniswap |
| `Donations`                    | `withdrawal`     | Charitable donations made in cryptocurrency |
| `Expense`                      | `withdrawal`     | General business or personal expenses paid in crypto |
| `Failed`                       | `*`              | Transaction that failed to execute on-chain |
| `Farming Rewards`              | `deposit`        | Yield farming rewards from providing liquidity or staking in DeFi |
| `Fee`                          | `payment`        | Transaction fees paid for on-chain operations (gas fees, network fees) |
| `Fiat Deposit`                 | `deposit`        | Depositing fiat currency to exchange or platform to buy crypto |
| `Fiat Withdrawal`              | `withdrawal`     | Converting crypto to fiat and withdrawing to bank account |
| `Funding Fee Paid`             | `withdrawal`     | Periodic funding fees paid in perpetual futures trading |
| `Funding Fee Received`         | `deposit`        | Periodic funding fees received in perpetual futures trading |
| `Futures Expense`              | `payment`        | Costs associated with futures and derivatives trading |
| `ICO investment`               | `withdrawal`     | Participating in Initial Coin Offering by sending funds |
| `Ignore`                       | `*`              | Transaction to be ignored for tax and accounting purposes |
| `Incoming Gift`                | `deposit`        | Cryptocurrency received as a gift from another person |
| `Lend`                         | `withdrawal`     | Lending out assets to DeFi protocols to earn interest |
| `Lend Redeem`                  | `deposit`        | Redeeming lent assets plus earned interest from lending protocols |
| `Liquidation`                  | `payment`        | Forced closure of position due to insufficient collateral |
| `Loan`                         | `deposit`        | Receiving a loan that must be repaid (not taxable income) |
| `Loan Interest`                | `deposit`        | Interest earned from lending assets to borrowers |
| `Loan Payback`                 | `payment`        | Repaying principal and interest on a crypto loan |
| `Lost`                         | `withdrawal`     | Permanently lost access to assets (lost keys, forgotten passwords) |
| `Margin Fee`                   | `payment`        | Fees for margin trading and leveraged positions |
| `Mining`                       | `deposit`        | Cryptocurrency rewards from mining blocks (PoW) |
| `Mint NFT`                     | `trade`          | Creating and minting a new NFT on blockchain |
| `NFT Buy`                      | `trade`          | Purchasing a non-fungible token (NFT) |
| `NFT Sell`                     | `trade`          | Selling a non-fungible token (NFT) |
| `Outgoing Gift`                | `withdrawal`     | Sending cryptocurrency as a gift to another person |
| `Realized Loss`                | `withdrawal`     | Loss realized from selling crypto at lower price than purchase |
| `Realized Profit`              | `deposit`        | Profit realized from selling crypto at higher price than purchase |
| `Resource Staking`             | `withdrawal`     | Staking CPU/NET resources on blockchains like EOS |
| `Reward`                       | `deposit`        | General rewards from platform activities, promotions, or referrals |
| `Royalties`                    | `deposit`        | Royalty payments received from NFT sales or content licensing |
| `Sell`                         | `trade`          | Selling cryptocurrency for another crypto or fiat currency |
| `Liquidity Withdrawal`         | `trade`          | Removing liquidity from DeFi pools and receiving back LP tokens |
| `Spam`                         | `deposit`        | Unwanted spam tokens sent to your wallet |
| `Stake`                        | `withdrawal`     | Locking up tokens for staking to earn rewards (PoS) |
| `Unstake`                      | `deposit`        | Unlocking and withdrawing staked tokens from staking protocols |
| `Staking Rewards`              | `deposit`        | Rewards earned from staking tokens in proof-of-stake networks |
| `Security Token Offering(STO)` | `trade`          | Participating in regulated Security Token Offering |
| `Stolen`                       | `withdrawal`     | Assets stolen through hacks, scams, or unauthorized access |
| `Trade`                        | `trade`          | General cryptocurrency trading activity |
| `Withdrawal`                   | `withdrawal`     | Withdrawing cryptocurrency from exchange or platform to wallet |
| `Deposit`                      | `deposit`        | Depositing cryptocurrency from wallet to exchange or platform |
| `Payment`                      | `payment`        | Making a payment for goods or services using cryptocurrency |
| `Swap`                         | `trade`          | Exchanging one cryptocurrency for another |
| `Fork`                         | `deposit`        | Receiving new tokens from blockchain fork (e.g., Bitcoin Cash from Bitcoin) |
| `Wrap`                         | `trade`          | Wrapping tokens to use on different blockchain (e.g., ETH to WETH) |
| `Unwrap`                       | `trade`          | Unwrapping tokens back to original form (e.g., WETH to ETH) |
| `Buy (Fiat to Crypto)`         | `trade`          | Direct purchase of cryptocurrency using fiat money |
| `Sell (Crypto to Fiat)`        | `trade`          | Direct sale of cryptocurrency for fiat money |
| `Cross Chain Swaps`            | `trade`          | Swapping assets across different blockchain networks |
| `Rex Withdrawal`               | `deposit`        | Withdrawing from REX (Resource Exchange) on EOS blockchain |
| `Rex Deposit`                  | `withdrawal`     | Depositing to REX (Resource Exchange) on EOS blockchain |
| `Interest`                     | `deposit`        | Interest earned from savings accounts or interest-bearing products |
| `Earn`                         | `deposit`        | Earnings from various platform earn programs or savings products |
| `Centralized Stake`            | `withdrawal`     | Staking through centralized exchange staking programs |
| `Centralized Lending`          | `withdrawal`     | Lending through centralized exchange lending programs |
| `Vault Deposit`                | `withdrawal`     | Depositing assets into yield vaults for automated strategies |
| `Vault Withdrawal`             | `deposit`        | Withdrawing assets and returns from yield vaults |

:::note
`*` indicates the label can be used with any transaction type.
:::

</details>

### Response

```json
{
  "message": "1 transaction(s) created successfully",
  "data": [],
  "count": 1,
  "user_id": "user_123",
  "timestamp": 1640995200000
}
```

### Error Responses

#### 400 Bad Request - Invalid Parameters

```json
{
  "error": "invalid_parameters",
  "message": "Invalid request body",
  "details": [
    {
      "path": ["transactions", 0, "timestamp"],
      "message": "Required"
    }
  ]
}
```

#### 404 Not Found - Wallet Not Found

```json
{
  "error": "wallet_not_found",
  "message": "Wallet not found"
}
```

#### 500 Internal Server Error

```json
{
  "error": "internal_server_error",
  "message": "Failed to create transactions"
}
```
