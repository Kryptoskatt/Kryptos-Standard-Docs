---
id: events
title: Webhook Events
sidebar_position: 2
---

# Webhook Events

Every webhook delivery follows a generic structure. The `data` field changes depending on the event category.

:::tip 10 Event Types Available
Kryptos supports **Integration**, **Transfer Detection**, and **Cost Basis** webhook events.
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

---

## Transfer Detection Events

Triggered during the transfer detection process. Transfer detection identifies movements of assets between a user's own wallets/exchanges (internal transfers) so they are not incorrectly treated as taxable disposals.

### Events

| Event                            | Description                                          |
| -------------------------------- | ---------------------------------------------------- |
| `transfer_detection.started`     | Transfer detection analysis has begun for a user     |
| `transfer_detection.completed`   | Transfer detection analysis finished successfully    |
| `transfer_detection.failed`      | Transfer detection encountered an error              |

### Example Payload

```json
{
  "id": "whd_8cbe199e6ae5fe275320c2b0",
  "event": "transfer_detection.started",
  "timestamp": "2026-02-20T18:09:07.962Z",
  "data": {
    "uid": "8efe14a679fa4fe390b03dfa",
    "action": "DETECT_TRANSFER",
    "status": "started",
    "reason": null,
    "timestamp": 1771610947808
  }
}
```

### Data Fields

| Field       | Type           | Description                                                                 |
| ----------- | -------------- | --------------------------------------------------------------------------- |
| `uid`       | string         | The user ID associated with the operation                                   |
| `action`    | string         | Always `DETECT_TRANSFER` for this event category                            |
| `status`    | string         | Current status: `started`, `completed`, or `failed`                         |
| `reason`    | string \| null | Error reason if the status is `failed`, otherwise `null`                    |
| `timestamp` | number         | Unix timestamp (ms) of when the status changed                              |

---

## Cost Basis Events

Triggered during the cost basis calculation process. Cost basis (also known as Account Manager) computes acquisition costs, gains, and losses across a user's portfolio for tax reporting.

### Events

| Event                 | Description                                        |
| --------------------- | -------------------------------------------------- |
| `costbasis.started`   | Cost basis calculation has begun for a user        |
| `costbasis.completed` | Cost basis calculation finished successfully       |
| `costbasis.failed`    | Cost basis calculation encountered an error        |

### Example Payload

```json
{
  "id": "whd_4e1f0937c274e70d738f65f7",
  "event": "costbasis.started",
  "timestamp": "2026-02-20T18:09:39.628Z",
  "data": {
    "uid": "8efe14a679fa4fe390b03dfa",
    "action": "ACCOUNT_MANAGER",
    "status": "started",
    "reason": null,
    "timestamp": 1771610979502
  }
}
```

### Data Fields

| Field       | Type           | Description                                                                 |
| ----------- | -------------- | --------------------------------------------------------------------------- |
| `uid`       | string         | The user ID associated with the operation                                   |
| `action`    | string         | Always `ACCOUNT_MANAGER` for this event category                            |
| `status`    | string         | Current status: `started`, `completed`, or `failed`                         |
| `reason`    | string \| null | Error reason if the status is `failed`, otherwise `null`                    |
| `timestamp` | number         | Unix timestamp (ms) of when the status changed                              |

---

## Event Lifecycle

Transfer Detection and Cost Basis events follow a predictable lifecycle. You can use these events to track progress and notify users in your application.

```
┌─────────────┐     ┌─────────────┐
│   started    │────▶│  completed   │   (success path)
└─────────────┘     └─────────────┘
       │
       │            ┌─────────────┐
       └───────────▶│   failed     │   (error path)
                    └─────────────┘
```

:::tip Processing Order
When a full portfolio recalculation is triggered, events typically fire in this order:
1. `transfer_detection.started` — Identify internal transfers
2. `transfer_detection.completed` — Transfers matched
3. `costbasis.started` — Calculate gains/losses
4. `costbasis.completed` — Calculation finished
:::

