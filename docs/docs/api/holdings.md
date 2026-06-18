---
id: holdings
title: Holdings
sidebar_position: 3
---

# Holdings

<span className="badge badge--get">GET</span> `/v1/holdings`

**Base URL:** `https://connect.kryptos.io/api`

Get comprehensive cryptocurrency holdings with asset distribution across wallets, cost basis, and performance metrics.

**Required Permission:** `portfolios:read`

## Request

```bash
curl -X GET "https://connect.kryptos.io/api/v1/holdings" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Query Parameters

| Parameter                 | Type   | Default | Description                                                                                                                                                            |
| ------------------------- | ------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isSpam`                  | string | `false` | Set to `true` to include assets flagged as spam. Omitted or any other value excludes them.                                                                            |
| `calculatedBalanceFilter` | string | `all`   | Filter holdings by balance source. `all`: live and calculated balances. `only`: calculated balances only (CSV/custom wallets). `exclude`: live balances only. Unknown values fall back to `all`. |

> Calculated balances are quantities derived from manually-imported transactions (CSV uploads, custom wallets) rather than fetched live from a connected exchange or on-chain address.

### Example

```bash
curl -X GET "https://connect.kryptos.io/api/v1/holdings?calculatedBalanceFilter=exclude" \
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
      "roi": 25,
      "baseCurrency": "USD",
      "24hrChange": 3.5,
      "marketLinks": {
        "coinmarketcap": "https://..."
      },
      "hasCalculatedBalance": false,
      "assetDistribution": [
        {
          "quantity": 1.5,
          "account": {
            "provider": "Ledger",
            "walletId": "wallet_123"
          },
          "allocationPercentage": 60,
          "isCalculatedBalance": false
        },
        {
          "quantity": 1.0,
          "account": {
            "provider": "MetaMask",
            "walletId": "wallet_456"
          },
          "allocationPercentage": 40,
          "isCalculatedBalance": false
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
| `roi`               | number | Return on investment % for this asset (`unrealizedPnL / costbasis * 100`; `0` when cost basis is unknown) |
| `baseCurrency`      | string | Base currency (USD)         |
| `24hrChange`        | number | 24-hour price change %      |
| `hasCalculatedBalance` | boolean | `true` if any wallet contributing to this asset holds a calculated balance (CSV/custom wallet) |
| `assetDistribution` | array  | Distribution across wallets |

### Asset Distribution Object

| Field                  | Type    | Description                                                              |
| ---------------------- | ------- | ------------------------------------------------------------------------ |
| `quantity`             | number  | Quantity held in this wallet                                             |
| `account`              | object  | Account details (`provider`, `walletId`)                                 |
| `allocationPercentage` | number  | Share of the asset's total value held in this wallet                     |
| `isCalculatedBalance`  | boolean | `true` if this wallet's balance is calculated (CSV/custom wallet) rather than live |

### Summary Object

| Field                | Type   | Description             |
| -------------------- | ------ | ----------------------- |
| `totalValue`         | number | Total portfolio value   |
| `totalCostBasis`     | number | Total cost basis        |
| `totalUnrealizedPnL` | number | Total unrealized P&L    |
| `roiPercentage`      | number | Return on investment %  |
| `total24hrChange`    | number | Portfolio 24hr change % |
