---
id: integrations
title: Integrations
sidebar_position: 8
---

# Integrations

<span className="badge badge--get">GET</span> `/v1/integrations`

**Base URL:** `https://connect.kryptos.io/api`

Retrieve a paginated list of user-connected wallets and exchanges with metadata, sync status, and transaction counts.

**Required Permission:** `integrations:read`

## Request

```bash
curl -X GET "https://connect.kryptos.io/api/v1/integrations?page=1&pageSize=25" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Query Parameters

| Parameter     | Type   | Default | Description                           |
| ------------- | ------ | ------- | ------------------------------------- |
| `page`        | number | 1       | Page number for pagination            |
| `pageSize`    | number | 25      | Number of items per page (max: 200)   |
| `searchedKey` | string | -       | Optional search term for fuzzy search |

## Response

```json
{
  "data": [
    {
      "provider": "binance",
      "providerPublicName": "Binance",
      "publicAddress": null,
      "walletId": "wallet_abc123",
      "logoUrl": "https://...",
      "isContract": false,
      "alias": "Main Trading Account",
      "status": "active",
      "addedOn": 1640995200000,
      "lastSyncedAt": 1672531200000,
      "category": "exchange",
      "type": "api",
      "totalTransactions": 1542
    },
    {
      "provider": "ethereum",
      "providerPublicName": "Ethereum",
      "publicAddress": "0x1234...abcd",
      "walletId": "wallet_def456",
      "logoUrl": "https://...",
      "isContract": false,
      "alias": "DeFi Wallet",
      "status": "active",
      "addedOn": 1641081600000,
      "lastSyncedAt": 1672617600000,
      "category": "blockchain",
      "type": "api",
      "totalTransactions": 328
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "totalCount": 12,
    "hasNextPage": false,
    "hasPreviousPage": false
  },
  "user_id": "user_123",
  "timestamp": 1672531200000
}
```

## Response Fields

### Integration Object

| Field                | Type    | Description                                             |
| -------------------- | ------- | ------------------------------------------------------- |
| `provider`           | string  | Provider identifier (e.g., `binance`, `ethereum`)       |
| `providerPublicName` | string  | Human-readable provider name                            |
| `publicAddress`      | string  | Wallet address (for blockchain wallets)                 |
| `walletId`           | string  | Unique wallet/integration identifier                    |
| `logoUrl`            | string  | Provider logo URL                                       |
| `isContract`         | boolean | Whether the address is a smart contract                 |
| `alias`              | string  | User-defined alias for the integration                  |
| `status`             | string  | Integration status: `QUEUED`, `ONGOING`, `COMPLETED`, `FAILED` |
| `addedOn`            | number  | Timestamp when integration was added (ms)               |
| `lastSyncedAt`       | number  | Timestamp of last successful sync (ms)                  |
| `category`           | string  | Category: `exchange`, `wallet`, `blockchain`, `unknown` |
| `type`               | string  | Integration type: `api` or `csv`                        |
| `totalTransactions`  | number  | Total number of transactions from this integration      |

### Pagination Object

| Field             | Type    | Description                  |
| ----------------- | ------- | ---------------------------- |
| `page`            | number  | Current page number          |
| `pageSize`        | number  | Items per page               |
| `totalCount`      | number  | Total number of integrations |
| `hasNextPage`     | boolean | Whether more pages exist     |
| `hasPreviousPage` | boolean | Whether previous pages exist |

## Search

The `searchedKey` parameter enables fuzzy search across multiple fields:

- `alias` - User-defined integration name
- `address` - Wallet address
- `accountName` - Account name
- `walletId` - Wallet identifier
- `public_name` - Provider public name
- `exchange` - Exchange name

```bash
curl -X GET "https://connect.kryptos.io/api/v1/integrations?searchedKey=binance" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Integration Categories

| Category     | Description                                       |
| ------------ | ------------------------------------------------- |
| `exchange`   | Centralized exchanges (Binance, Coinbase)         |
| `wallet`     | Software/hardware wallets (MetaMask, Ledger)      |
| `blockchain` | Direct blockchain connections (Ethereum, Bitcoin) |
| `unknown`    | Unclassified integrations                         |

## Integration Types

| Type  | Description                     |
| ----- | ------------------------------- |
| `api` | Connected via API keys or OAuth |
| `csv` | Imported via CSV file upload    |
