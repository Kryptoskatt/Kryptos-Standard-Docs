---
id: transactions
title: Transactions
sidebar_position: 4
---

# Transactions

<span className="badge badge--get">GET</span> `/v1/transactions`

**Base URL:** `https://connect.kryptos.io/api`

Retrieve user's transaction history with advanced filtering options.

**Required Permission:** `transactions:read`

## Request

```bash
curl -X GET "https://connect.kryptos.io/api/v1/transactions?limit=10&order=desc" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Query Parameters

| Parameter           | Type    | Description                                    |
| ------------------- | ------- | ---------------------------------------------- |
| `walletId`          | string  | Filter by wallet IDs (comma-separated)         |
| `currencyId`        | string  | Filter by currency IDs (comma-separated)       |
| `trxId`             | string  | Specific transaction ID                        |
| `isNft`             | boolean | Filter NFT transactions                        |
| `isMissingPrice`    | boolean | Transactions missing price data                |
| `isMissingPurchase` | boolean | Transactions missing purchase data             |
| `isEdited`          | boolean | Manually edited transactions                   |
| `isManual`          | boolean | Manually created transactions                  |
| `transactionType`   | string  | Types: `swap`, `deposit`, `withdraw`           |
| `label`             | string  | Labels (comma-separated)                       |
| `order`             | string  | Sort order: `asc`, `desc`                      |
| `timeStart`         | number  | Start timestamp (Unix ms)                      |
| `timeEnd`           | number  | End timestamp (Unix ms)                        |
| `limit`             | number  | Max results (1-1000, default: 100)             |
| `offset`            | number  | Number of records to skip (min: 0, default: 0) |

## Response

```json
{
  "message": "User transactions retrieved successfully",
  "data": [
    {
      "id": "trx_123",
      "transactionPlatfromId": "0xabc123...",
      "timestamp": 1640995200000,
      "label": "Swap",
      "description": "Swapped ETH for USDC",
      "incomingAssets": [
        {
          "asset": {
            "tokenId": "usd-coin",
            "symbol": "USDC",
            "publicName": "USD Coin",
            "type": "crypto"
          },
          "quantity": 3000,
          "price": 1.0,
          "baseCurrency": "USD",
          "timestamp": 1640995200000,
          "type": "incoming",
          "toAccount": {
            "provider": "MetaMask",
            "walletId": "wallet_123",
            "publicAddress": "0x742d35..."
          }
        }
      ],
      "outgoingAssets": [
        {
          "asset": {
            "tokenId": "ethereum",
            "symbol": "ETH",
            "publicName": "Ethereum",
            "type": "crypto"
          },
          "quantity": 1.5,
          "price": 2000,
          "baseCurrency": "USD",
          "timestamp": 1640995200000,
          "type": "outgoing",
          "fromAccount": {
            "provider": "MetaMask",
            "walletId": "wallet_123",
            "publicAddress": "0x742d35..."
          }
        }
      ],
      "fee": [
        {
          "asset": {
            "tokenId": "ethereum",
            "symbol": "ETH",
            "type": "crypto"
          },
          "quantity": 0.005,
          "price": 2000,
          "baseCurrency": "USD",
          "type": "fee"
        }
      ],
      "metadata": {
        "importSource": "API",
        "isManual": false,
        "isEdited": false,
        "isDefiTrx": false,
        "isNFTTrx": false
      },
      "tags": [],
      "ledger": [],
      "rawTrx": {}
    }
  ],
  "pagination": {
    "limit": 100,
    "offset": 0,
    "returned_count": 1
  },
  "user_id": "user_123",
  "timestamp": 1640995200000
}
```

## Pagination

The response includes a `pagination` object with the following fields:

| Field            | Type   | Description                            |
| ---------------- | ------ | -------------------------------------- |
| `limit`          | number | Maximum number of results requested    |
| `offset`         | number | Number of records skipped              |
| `returned_count` | number | Actual number of transactions returned |

### Pagination Example

To retrieve transactions in pages of 50:

```bash
# First page
curl -X GET "https://connect.kryptos.io/api/v1/transactions?limit=50&offset=0" \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Second page
curl -X GET "https://connect.kryptos.io/api/v1/transactions?limit=50&offset=50" \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Third page
curl -X GET "https://connect.kryptos.io/api/v1/transactions?limit=50&offset=100" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Transaction Labels

Use these labels with the `label` query parameter to filter transactions.

| Label                          | Description                       |
| ------------------------------ | --------------------------------- |
| `Add Liquidity`                | Adding liquidity to a pool        |
| `Airdrops`                     | Airdrop received                  |
| `Approve`                      | Token approval transaction        |
| `Income`                       | General income                    |
| `Borrow`                       | Borrowing assets                  |
| `Borrow Interest`              | Interest paid on borrowed assets  |
| `Bridge Receive`               | Receiving from cross-chain bridge |
| `Bridge Send`                  | Sending via cross-chain bridge    |
| `Bridge Transfer`              | Cross-chain bridge transfer       |
| `Burn`                         | Token burn                        |
| `Buy`                          | Purchase transaction              |
| `Cashback`                     | Cashback reward                   |
| `Casualty Loss`                | Loss due to casualty              |
| `Collateral Deposit`           | Depositing collateral             |
| `Collateral Withdrawal`        | Withdrawing collateral            |
| `DeFi Swap`                    | Decentralized exchange swap       |
| `Donations`                    | Charitable donation               |
| `Expense`                      | General expense                   |
| `Failed`                       | Failed transaction                |
| `Farming Rewards`              | Yield farming rewards             |
| `Fee`                          | Transaction fee                   |
| `Fiat Deposit`                 | Fiat currency deposit             |
| `Fiat Withdrawal`              | Fiat currency withdrawal          |
| `Funding Fee Paid`             | Futures funding fee paid          |
| `Funding Fee Received`         | Futures funding fee received      |
| `Futures Expense`              | Futures trading expense           |
| `ICO investment`               | ICO participation                 |
| `Ignore`                       | Ignored transaction               |
| `Incoming Gift`                | Gift received                     |
| `Transfer`                     | General transfer                  |
| `Lend`                         | Lending assets                    |
| `Liquidation`                  | Liquidation event                 |
| `Loan`                         | Loan received                     |
| `Loan Interest`                | Interest earned on loan           |
| `Loan Payback`                 | Loan repayment                    |
| `Lost`                         | Lost assets                       |
| `Margin Fee`                   | Margin trading fee                |
| `Mining`                       | Mining reward                     |
| `Mint NFT`                     | NFT minting                       |
| `NFT Buy`                      | NFT purchase                      |
| `NFT Sell`                     | NFT sale                          |
| `Outgoing Gift`                | Gift sent                         |
| `Realized Loss`                | Realized trading loss             |
| `Realized Profit`              | Realized trading profit           |
| `Resource Staking`             | Resource staking (e.g., EOS)      |
| `Reward`                       | General reward                    |
| `Royalties`                    | Royalty payment                   |
| `Sell`                         | Sale transaction                  |
| `Liquidity Withdrawal`         | Removing liquidity from pool      |
| `Spam`                         | Spam transaction                  |
| `Stake`                        | Staking assets                    |
| `Unstake`                      | Unstaking assets                  |
| `Staking Rewards`              | Staking reward                    |
| `Security Token Offering(STO)` | STO participation                 |
| `Stolen`                       | Stolen assets                     |
| `Trade`                        | General trade                     |
| `Withdrawal`                   | Withdrawal                        |
| `Deposit`                      | Deposit                           |
| `Payment`                      | Payment transaction               |
| `Swap`                         | Token swap                        |
| `Fork`                         | Blockchain fork                   |
| `Wrap`                         | Token wrapping                    |
| `Unwrap`                       | Token unwrapping                  |
| `Buy (Fiat to Crypto)`         | Fiat to crypto purchase           |
| `Sell (Crypto to Fiat)`        | Crypto to fiat sale               |
| `Cross Chain Swaps`            | Cross-chain swap                  |
| `Rex Withdrawal`               | REX withdrawal (EOS)              |
| `Rex Deposit`                  | REX deposit (EOS)                 |
| `Interest`                     | Interest earned                   |
| `Earn`                         | Earnings                          |
| `Centralized Stake`            | CEX staking                       |
| `Centralized Lending`          | CEX lending                       |
| `Vault Deposit`                | Vault deposit                     |
| `Vault Withdrawal`             | Vault withdrawal                  |
| `Unknown`                      | Unknown transaction type          |
