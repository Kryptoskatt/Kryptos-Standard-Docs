---
id: defi-holdings
title: DeFi Holdings
sidebar_position: 5
---

# DeFi Holdings

<span className="badge badge--get">GET</span> `/v1/defi-holdings`

**Base URL:** `https://connect.kryptos.io/api`

Retrieve user's DeFi positions with protocol details.

**Required Permission:** `portfolios:read`

## Request

```bash
curl -X GET "https://connect.kryptos.io/api/v1/defi-holdings?chain=ethereum&limit=10" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Query Parameters

| Parameter  | Type   | Description                                             |
| ---------- | ------ | ------------------------------------------------------- |
| `source`   | string | Filter by data sources (comma-separated, max 30)        |
| `protocol` | string | Filter by protocols: `aave`, `compound`, `uniswap`      |
| `chain`    | string | Filter by blockchain: `ethereum`, `polygon`, `arbitrum` |
| `limit`    | number | Max results (1-1000, default: 100)                      |
| `offset`   | number | Pagination offset (default: 0)                          |

## Response

```json
{
  "holdings": [
    {
      "holdingId": "defi_123",
      "owner": {
        "provider": "MetaMask",
        "walletId": "wallet_123",
        "publicAddress": "0x742d35..."
      },
      "protocolName": "Aave V3",
      "chain": "ethereum",
      "logoUrl": "https://...",
      "siteUrl": "https://aave.com",
      "category": "lending",
      "portfolio": {
        "category": "other",
        "positions": [
          {
            "asset": {
              "tokenId": "usd-coin",
              "symbol": "USDC",
              "publicName": "USD Coin"
            },
            "amount": "50000",
            "value": {
              "price": 50000,
              "baseCurrency": "USD",
              "timestamp": 1640995200000
            }
          }
        ],
        "rewardPositions": []
      },
      "totalValue": {
        "price": 52000,
        "baseCurrency": "USD"
      },
      "netValue": {
        "price": 50000,
        "baseCurrency": "USD"
      },
      "createdAt": 1640995200000,
      "updatedAt": 1640995200000,
      "isActive": true
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0
  },
  "user_id": "user_123"
}
```

## DeFi Categories

| Category      | Description                        |
| ------------- | ---------------------------------- |
| `lending`     | Lending protocols (Aave, Compound) |
| `staking`     | Staking positions                  |
| `farming`     | Yield farming                      |
| `liquidity`   | Liquidity pools                    |
| `derivatives` | Derivatives positions              |
