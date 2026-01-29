---
id: defi-holdings
title: DeFi Holdings
sidebar_position: 4
---

# DeFi Holdings (Legacy)

<span className="badge badge--get">GET</span> `/v0/defi-holdings`

**Base URL:** `https://connect.kryptos.io/api`

:::warning Legacy Endpoint
This endpoint will be deprecated. Use `/v1/defi-holdings` for new integrations. Migrate to V1 when made live.
:::

Retrieve user's DeFi positions in legacy format.

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `docId` | string | Specific DeFi holding by document ID |
| `limit` | number | Max results (1-1000) |
| `sortByHighestValue` | boolean | Sort by highest net value (default: true) |

## Response

```json
{
  "holdings": [
    {
      "id": "defi_123",
      "name": "Aave",
      "chain": "ethereum",
      "type": "lending",
      "stats": {
        "net_usd_value": 50000,
        "asset_usd_value": 52000,
        "debt_usd_value": 2000,
        "converted_net_value": 50000,
        "converted_currency": "USD"
      },
      "portfolio_entry": {
        "supply_token_list": [
          {
            "currency": "USDC",
            "amount": 50000
          }
        ]
      },
      "source": {
        "walletId": "wallet_123",
        "address": "0x742d35..."
      }
    }
  ],
  "user_id": "user_123",
  "base_currency": "USD",
  "total_defi_value": 50000,
  "total_count": 3,
  "sorted_by_highest_value": true
}
```

