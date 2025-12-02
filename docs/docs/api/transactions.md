---
id: transactions
title: Transactions
sidebar_position: 4
---

# Transactions

<span className="badge badge--get">GET</span> `/v1/transactions`

Retrieve user's transaction history with advanced filtering options.

**Required Permission:** `read:transactions`

## Request

```bash
curl -X GET "https://connect.kryptos.io/api/v1/transactions?limit=10&order=desc" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `walletId` | string | Filter by wallet IDs (comma-separated) |
| `currencyId` | string | Filter by currency IDs (comma-separated) |
| `trxId` | string | Specific transaction ID |
| `isNft` | boolean | Filter NFT transactions |
| `isMissingPrice` | boolean | Transactions missing price data |
| `isMissingPurchase` | boolean | Transactions missing purchase data |
| `isEdited` | boolean | Manually edited transactions |
| `isManual` | boolean | Manually created transactions |
| `transactionType` | string | Types: `swap`, `deposit`, `withdraw` |
| `label` | string | Labels (comma-separated) |
| `order` | string | Sort order: `asc`, `desc` |
| `timeStart` | number | Start timestamp (Unix ms) |
| `timeEnd` | number | End timestamp (Unix ms) |
| `limit` | number | Max results (1-1000, default: 100) |

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
  "user_id": "user_123",
  "timestamp": 1640995200000
}
```

## Transaction Types

| Type | Description |
|------|-------------|
| `swap` | Token swap/trade |
| `deposit` | Deposit to wallet |
| `withdraw` | Withdrawal from wallet |
| `transfer` | Transfer between wallets |
| `stake` | Staking transaction |
| `unstake` | Unstaking transaction |
| `reward` | Reward claim |

