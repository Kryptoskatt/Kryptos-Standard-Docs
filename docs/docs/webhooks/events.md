---
id: events
title: Webhook Events
sidebar_position: 2
---

# Webhook Events

Every webhook delivery follows a generic structure. The `data` field changes depending on the event category.

:::info More Events Coming Soon
We are actively adding new event categories. This page will be updated as they become available.
:::

## Generic Structure

```json
{
  "id": "whd_<unique_id>",
  "event": "<category>.<action>",
  "timestamp": "ISO 8601 timestamp",
  "data": {
    "uid": "user_<id>",
    ...
  }
}
```

| Field       | Type   | Description                                             |
| ----------- | ------ | ------------------------------------------------------- |
| `id`        | string | Unique delivery ID (format: `whd_*`)                    |
| `event`     | string | Event type in `<category>.<action>` format              |
| `timestamp` | string | ISO 8601 timestamp of when the event occurred           |
| `data`      | object | Event-specific payload; always includes `uid`           |

The `data` object always contains a `uid` field identifying the user. The remaining fields depend on the event category — see below.

---

## Integration Events

Triggered when a user's wallet or exchange connection changes. The `data` fields match the response format of the [Integrations API](/api/integrations).

### Events

| Event                  | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `integration.created`  | A user connected a new wallet or exchange          |
| `integration.updated`  | An existing integration was updated or synced      |
| `integration.deleted`  | A user removed a wallet or exchange connection     |
| `integration.failed`   | An integration sync encountered an error           |

### Example Payload

```json
{
  "id": "whd_abc123def456",
  "event": "integration.created",
  "timestamp": "2025-02-19T12:00:00.000Z",
  "data": {
    "uid": "user_123",
    "provider": "binance",
    "providerPublicName": "Binance",
    "publicAddress": null,
    "walletId": "wallet_abc123",
    "logoUrl": "https://storage.googleapis.com/kryptos-public/logos/binance.png",
    "isContract": false,
    "alias": "Main Trading Account",
    "status": "active",
    "addedOn": 1640995200000,
    "lastSyncedAt": 1672531200000,
    "category": "exchange",
    "type": "api",
    "totalTransactions": 0
  }
}
```

### Data Fields

| Field                | Type    | Description                                                  |
| -------------------- | ------- | ------------------------------------------------------------ |
| `uid`                | string  | The user ID associated with the integration                  |
| `provider`           | string  | Provider identifier (e.g., `binance`, `ethereum`)            |
| `providerPublicName` | string  | Human-readable provider name                                 |
| `publicAddress`      | string  | Wallet address (for blockchain wallets), `null` otherwise    |
| `walletId`           | string  | Unique wallet/integration identifier                         |
| `logoUrl`            | string  | Provider logo URL                                            |
| `isContract`         | boolean | Whether the address is a smart contract                      |
| `alias`              | string  | User-defined alias for the integration                       |
| `status`             | string  | Integration status: `QUEUED`, `ONGOING`, `COMPLETED`, `FAILED` |
| `addedOn`            | number  | Timestamp when integration was added (ms)                    |
| `lastSyncedAt`       | number  | Timestamp of last successful sync (ms)                       |
| `category`           | string  | Category: `exchange`, `wallet`, `blockchain`, `unknown`      |
| `type`               | string  | Integration type: `api` or `csv`                             |
| `totalTransactions`  | number  | Total number of transactions from this integration           |

### Integration Categories

| Category     | Description                                        |
| ------------ | -------------------------------------------------- |
| `exchange`   | Centralized exchanges (Binance, Coinbase, Kraken)  |
| `wallet`     | Software/hardware wallets (MetaMask, Ledger)       |
| `blockchain` | Direct blockchain connections (Ethereum, Bitcoin)   |
| `unknown`    | Unclassified integrations                          |

### Integration Types

| Type  | Description                       |
| ----- | --------------------------------- |
| `api` | Connected via API keys or OAuth   |
| `csv` | Imported via CSV file upload      |
