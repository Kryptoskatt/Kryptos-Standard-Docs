---
id: nft-holdings
title: NFT Holdings
sidebar_position: 3
---

# NFT Holdings (Legacy)

<span className="badge badge--get">GET</span> `/v0/nft-holdings`

**Base URL:** `https://connect-api.kryptos.io/api`

:::warning Legacy Endpoint
This endpoint will be deprecated. Use `/v1/nft-holdings` for new integrations. Migrate to V1 when made live.
:::

Retrieve user's NFT holdings in legacy format.

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number | Max results (1-1000) |
| `sortByHighestValue` | boolean | Sort by highest USD value (default: true) |

## Response

```json
{
  "holdings": [
    {
      "id": "nft_123",
      "name": "Bored Ape #1234",
      "contract_address": "0x...",
      "token_id": "1234",
      "usd_price": 150000,
      "converted_price": 150000,
      "converted_currency": "USD",
      "collection": {
        "name": "Bored Ape Yacht Club",
        "floor_price": [
          {
            "value": 50,
            "paymentToken": { "currency": "ETH" }
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
  "total_count": 5,
  "base_currency": "USD",
  "sorted_by_highest_value": true
}
```

