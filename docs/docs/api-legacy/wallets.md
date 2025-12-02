---
id: wallets
title: Wallets
sidebar_position: 1
---

# Wallets (Legacy)

<span className="badge badge--get">GET</span> `/v0/wallets`

:::warning Legacy Endpoint
This endpoint will be deprecated. Use V1 endpoints for new integrations. Migrate to V1 when made live.
:::

Retrieve user's cryptocurrency wallets with pagination.

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `portfolioId` | string | Filter by portfolio ID |
| `limit` | number | Results per page (1-1000, default: 100) |
| `offset` | number | Pagination offset |
| `includeCount` | boolean | Include total count |

## Response

```json
{
  "wallets": [
    {
      "walletId": "wallet_123",
      "name": "ethereum_wallet",
      "public_name": "My Ethereum Wallet",
      "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "logo_url": "https://example.com/logo.png",
      "portfolioId": "portfolio_1",
      "portfolioName": "Main Portfolio",
      "chain": "ethereum",
      "type": "metamask"
    }
  ],
  "user_id": "user_123",
  "pagination": {
    "limit": 20,
    "offset": 0,
    "returned_count": 15,
    "total_count": 42,
    "has_more": true
  }
}
```

