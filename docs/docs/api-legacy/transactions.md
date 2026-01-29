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

### Request Body

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
        "amount": 50000
      },
      "receivedCurrency": {
        "currency": "BTC",
        "amount": 1.0
      },
      "label": "Purchase"
    }
  ]
}
```

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

