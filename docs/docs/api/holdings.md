---
id: holdings
title: Holdings
sidebar_position: 3
---

# Holdings

<span className="badge badge--get">GET</span> `/v1/holdings`

Get comprehensive cryptocurrency holdings with asset distribution across wallets, cost basis, and performance metrics.

**Required Permission:** `read:holdings`

## Request

```bash
curl -X GET "https://connect.kryptos.io/api/v1/holdings" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Response

```json
{
  "holdings": [
    {
      "asset": {
        "tokenId": "bitcoin",
        "symbol": "BTC",
        "publicName": "Bitcoin",
        "chainId": "bitcoin",
        "logoUrl": "https://...",
        "type": "crypto",
        "category": "crypto"
      },
      "totalQuantity": 2.5,
      "costbasis": 100000,
      "marketPrice": 50000,
      "marketValue": 125000,
      "unrealizedPnL": 25000,
      "baseCurrency": "USD",
      "24hrChange": 3.5,
      "marketLinks": {
        "coinmarketcap": "https://..."
      },
      "assetDistribution": [
        {
          "quantity": 1.5,
          "account": {
            "provider": "Ledger",
            "walletId": "wallet_123"
          },
          "allocationPercentage": 60
        },
        {
          "quantity": 1.0,
          "account": {
            "provider": "MetaMask",
            "walletId": "wallet_456"
          },
          "allocationPercentage": 40
        }
      ]
    }
  ],
  "summary": {
    "totalValue": 250000,
    "totalCostBasis": 200000,
    "totalUnrealizedPnL": 50000,
    "roiPercentage": 25,
    "total24hrChange": 2.8
  },
  "user_id": "user_123",
  "timestamp": 1640995200000
}
```

## Response Fields

### Holdings Object

| Field               | Type   | Description                 |
| ------------------- | ------ | --------------------------- |
| `asset`             | object | Asset details               |
| `totalQuantity`     | number | Total quantity held         |
| `costbasis`         | number | Total cost basis            |
| `marketPrice`       | number | Current market price        |
| `marketValue`       | number | Total market value          |
| `unrealizedPnL`     | number | Unrealized profit/loss      |
| `baseCurrency`      | string | Base currency (USD)         |
| `24hrChange`        | number | 24-hour price change %      |
| `assetDistribution` | array  | Distribution across wallets |

### Summary Object

| Field                | Type   | Description             |
| -------------------- | ------ | ----------------------- |
| `totalValue`         | number | Total portfolio value   |
| `totalCostBasis`     | number | Total cost basis        |
| `totalUnrealizedPnL` | number | Total unrealized P&L    |
| `roiPercentage`      | number | Return on investment %  |
| `total24hrChange`    | number | Portfolio 24hr change % |
