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
  "grant_id": "cgrant_<id>",
  "workspace_id": "ws_<id>",
  "data": { ... }
}
```

| Field          | Type           | Description                                                                     |
| -------------- | -------------- | ------------------------------------------------------------------------------- |
| `id`           | string         | Unique delivery ID (format: `whd_*`). Retries of the same delivery reuse it      |
| `event`        | string         | Event type in `<category>.<action>` format                                      |
| `timestamp`    | string         | ISO 8601 timestamp of the delivery                                              |
| `grant_id`     | string         | The Connect grant this delivery is attributed to — see below                     |
| `workspace_id` | string \| null | The end user's workspace that the grant is bound to                             |
| `data`         | object         | Event-specific payload; its fields depend on the event category                 |

### Identifying the user

`grant_id` and `workspace_id` are how you map a delivery back to one of your own customers. They are
the same two ids you received from
[token exchange](/docs/kryptos-connect/backend#step-2-exchange-public-token), so store the `grant_id` when a
user connects and key your webhook handler on it.

Both live on the **envelope, not inside `data`** — and they are not sent as headers either. Read them
off the parsed body alongside `id` and `event`.

:::warning There is no `uid` in `data`
The `data` object carries no user identifier. `walletId` cannot stand in for one either: the first
`integration.created` for a new connection arrives *before* you have stored any wallet id, and the
`transfer_detection.*` / `costbasis.*` payloads carry no wallet id at all. Use `grant_id`.
:::

`workspace_id` is `null` only for grants issued before the v1 → v2 migration.

---

## Integration Events

Triggered when a user's wallet or exchange connection changes. The `data` fields match the response format of the [Integrations API](/docs/api/integrations).

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
  "timestamp": "2026-02-19T12:00:00.000Z",
  "grant_id": "cgrant_abc123xyz789",
  "workspace_id": "ws_12ab",
  "data": {
    "provider": "binance",
    "providerPublicName": "Binance",
    "publicAddress": "",
    "walletId": "wallet_abc123",
    "logoUrl": "https://storage.googleapis.com/kryptos-public/logos/binance.png",
    "isContract": false,
    "alias": "Main Trading Account",
    "status": "QUEUED",
    "addedOn": 1640995200000,
    "lastSyncedAt": 1672531200000,
    "category": "exchange",
    "type": "api",
    "totalTransactions": 0
  }
}
```

### Data Fields

| Field                | Type    | Description                                                                             |
| -------------------- | ------- | --------------------------------------------------------------------------------------- |
| `provider`           | string  | Provider identifier (e.g., `binance`, `ethereum`)                                       |
| `providerPublicName` | string  | Human-readable provider name                                                            |
| `publicAddress`      | string  | Wallet address, for address-based connections. **Empty string** — never `null` — for exchanges, OAuth and CSV integrations, which have no address |
| `walletId`           | string  | Unique wallet/integration identifier — the `id` used by the [Integrations API](/docs/api/integrations) |
| `logoUrl`            | string  | Provider logo URL; `""` if the provider record has none                                 |
| `isContract`         | boolean | **Always `false`.** v2 does not perform contract detection, so this is reported rather than inferred |
| `alias`              | string  | User-defined alias for the integration; `""` if unset                                   |
| `status`             | string  | Integration status — see below                                                          |
| `errorMessage`       | string  | Why the sync failed. **Omitted entirely** unless `status` is `FAILED` and a message exists — not `null` |
| `addedOn`            | number  | Timestamp when integration was added (ms); `0` if unknown                               |
| `lastSyncedAt`       | number  | Timestamp of last successful sync (ms); `0` if never synced                              |
| `category`           | string  | Category: `exchange`, `wallet`, `blockchain`, `unknown`                                 |
| `type`               | string  | Integration type: `api` or `csv`                                                        |
| `totalTransactions`  | number  | Total number of transactions from this integration                                      |

### Status values

| Status | Terminal | Meaning |
| --- | --- | --- |
| `QUEUED` | no | Waiting to sync |
| `SYNCING` | no | Sync running |
| `COMPLETED` | **yes** | Sync finished |
| `FAILED` | **yes** | Sync failed or was cancelled — read `errorMessage` |
| `DELETING` | no | Removal has started; a `DELETED` or `FAILED` event follows once the wipe settles |
| `DELETED` | **yes** | Removal finished. Only sent on `integration.deleted` |
| `INACTIVE` | **yes** | Syncing is disabled or the integration is suspended |

A sync that finished with some rows dropped reports **`COMPLETED`**, not a separate partial state. To
find out *why* it was partial, read the sync itself with `GET /v1/sync/{syncId}`: it exposes the
underlying `partially_synced` status, `recordsFailed`, and `limitReached` — the last of which tells you
the run was cut short by the workspace's transaction limit rather than by a connector failure.

This vocabulary is the webhook's own and does not line up with the sync status on the API: it folds
the seven sync states into these tokens (`partially_synced` → `COMPLETED`, `cancelled` → `FAILED`)
and mixes in account-level states the sync has no equivalent for. Don't compare the two strings
directly.

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
  "grant_id": "cgrant_abc123xyz789",
  "workspace_id": "ws_12ab",
  "data": {
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
| `action`    | string         | Always `DETECT_TRANSFER` for this event category                            |
| `status`    | string         | Current status: `started`, `completed`, or `failed`                         |
| `reason`    | string \| null | Error reason if the status is `failed`, otherwise `null`                    |
| `timestamp` | number         | Unix timestamp (ms) of when the status changed                              |

These events are workspace-wide, so `data` identifies neither a user nor an integration. Use the
envelope's `grant_id` to attribute them.

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
  "grant_id": "cgrant_abc123xyz789",
  "workspace_id": "ws_12ab",
  "data": {
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
| `action`    | string         | Always `ACCOUNT_MANAGER` for this event category                            |
| `status`    | string         | Current status: `started`, `completed`, or `failed`                         |
| `reason`    | string \| null | Error reason if the status is `failed`, otherwise `null`                    |
| `timestamp` | number         | Unix timestamp (ms) of when the status changed                              |

As with transfer detection, `data` carries no user or integration identity — attribute these with the
envelope's `grant_id`.

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

