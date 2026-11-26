---
id: quickstart
title: Quickstart
sidebar_position: 2
---

# White-label quickstart

Create a workspace for a customer, connect a wallet, and read its transactions. Four requests.

**Before you start:** a **production** client from the [Developer Portal](/docs/developer-portal), with
white-label workspaces [enabled](/docs/developer-portal#white-label-workspaces). Call everything below
from your **server**: the client secret and the workspace tokens must never reach a browser or app.

| Base URL | Used for |
| --- | --- |
| `https://connect-api.kryptos.io` | Creating workspaces and managing their grants (client ID + secret) |
| `https://api-v2.kryptos.io/v1` | Everything else (workspace token) |

## 1. Create a workspace

```bash
curl -X POST "https://connect-api.kryptos.io/developer/workspaces" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer 42",
    "country_code": "US",
    "base_currency_code": "USD",
    "timezone": "UTC"
  }'
```

Every body field is optional (defaults: `"API Workspace"`, `US`, `USD`, `UTC`). `country_code` is ISO
3166-1 alpha-2 in capitals, `base_currency_code` is ISO 4217, `timezone` is an IANA name. The base currency
and time zone decide how transactions are priced and dated. Unknown fields return `400`.

The workspace gets the [Balances and Accounting](/docs/integrations-api/white-label) features Kryptos
enabled for your client, shown as `features` in the response. Without them it is
[Integrations only](/docs/integrations-api/integrations-only).

**Response `201`:**

```json
{
  "success": true,
  "data": {
    "workspace_id": "ws_3e2184db55384325902258a0573a2324",
    "grant_id": "cgrant_f22fbc24…",
    "access_token": "cat_…",
    "token_type": "Bearer",
    "expires_in": 86400,
    "scope": "integrations:read integrations:write portfolios:read transactions:read transactions:write connect:api",
    "transaction_limit": 100000,
    "features": { "balances": true, "accounting": true }
  }
}
```

:::tip The token lasts 24 hours
Store `workspace_id` and `grant_id` against your customer. The `access_token` lasts 24 hours: when it
expires, or whenever you like, [get a fresh one](#get-a-fresh-token) with your client ID and secret. Your
client secret is the long-lived credential, so keep it in your secrets manager; you don't need to store
workspace tokens at all.
:::

## 2. Connect a wallet or exchange

A wallet address (find provider ids with [`GET /v1/providers`](/docs/api/providers)):

```bash
curl -X POST "https://api-v2.kryptos.io/v1/integrations" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "WORKSPACE_ID",
    "providerId": "ethereum",
    "alias": "Main wallet",
    "credentialKind": "address",
    "credentialData": { "address": "0x1234567890abcdef1234567890abcdef12345678" }
  }'
```

An exchange uses its read-only API key instead:

```json
{
  "workspaceId": "WORKSPACE_ID",
  "providerId": "binance",
  "alias": "Binance",
  "credentialKind": "api_key",
  "credentialData": { "apiKey": "…", "secretKey": "…" }
}
```

The create response `201` returns the integration (`"id": "int_c1e9fd337565"`,
`"accountStatus": "pending"`). **The first sync starts on its own.** To check exchange keys before saving
them, call `POST /v1/integrations/test-credentials` with
`{ "providerId": "binance", "credential": { "apiKey": "…", "secretKey": "…" } }`.

Integration, sync, CSV and credential endpoints take `workspaceId` (in the body or query): always send
your token's workspace. A different workspace returns `403`. Transaction and holdings endpoints take the
workspace from the token.

## 3. Wait for the sync

Poll the integration until `lastSyncStatus` is `completed`, `partially_synced`, `failed` or `cancelled`:

```bash
curl "https://api-v2.kryptos.io/v1/integrations/int_c1e9fd337565?workspaceId=WORKSPACE_ID" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

```json
{ "success": true, "data": { "id": "int_c1e9fd337565", "accountStatus": "active", "lastSyncStatus": "completed", "lastSyncedAt": "2026-11-25T15:37:10.013Z" } }
```

A wallet with a few hundred transactions usually finishes within a minute or two; large exchange
accounts take longer. `GET /v1/sync?workspaceId=…` lists every sync in the workspace. Kryptos keeps
the integration in sync afterwards; call `POST /v1/integrations/{id}/sync` to sync now.

## 4. Read the transactions

```bash
curl "https://api-v2.kryptos.io/v1/transactions?limit=50" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

```json
{
  "data": [
    {
      "id": "f1a37d07-5207-476d-9…",
      "timestamp": 1795006463000,
      "type": "deposit",
      "label": "Deposit",
      "incomingAssets": [ { "…": "…" } ],
      "outgoingAssets": [],
      "fee": [],
      "explorerLink": "https://etherscan.io/tx/…"
    }
  ],
  "meta": { "limit": 50, "offset": 0, "hasMore": true, "total": 121 }
}
```

Each transaction's legs, with quantity, price and value, are at
`GET /v1/transactions/{id}/ledgers`, or for the whole workspace at `GET /v1/ledgers`. Field details:
[Transactions](/docs/api/transactions), [Ledgers](/docs/api/ledgers).

## Manage your workspaces

### Get a fresh token

```bash
curl -X POST "https://connect-api.kryptos.io/developer/workspaces/WORKSPACE_ID/token" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET" \
  -H "Content-Type: application/json" \
  -d '{}'
```

```json
{
  "success": true,
  "data": {
    "workspace_id": "ws_3e2184db55384325902258a0573a2324",
    "grant_id": "cgrant_f22fbc24…",
    "access_token": "cat_…",
    "token_type": "Bearer",
    "expires_in": 86400,
    "scope": "integrations:read integrations:write portfolios:read transactions:read transactions:write connect:api",
    "revoked_tokens": 0
  }
}
```

- Works for any workspace your client created and hasn't revoked; any other id returns `404 WORKSPACE_NOT_FOUND`.
- Earlier tokens keep working until they expire. **If a token may have leaked**, send
  `{ "revoke_existing": true }`: every other token of that workspace stops at once, and the data stays.
- At most 120 tokens per client per minute (`429 RATE_LIMITED`).

### Revoke a workspace

```bash
curl -X POST "https://connect-api.kryptos.io/token/revoke" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET" \
  -H "Content-Type: application/json" \
  -d '{ "grant_id": "cgrant_f22fbc24…" }'
```

Every token of the workspace stops working at once, you can't get new ones for it, and it no longer
counts towards your limit. Revoking is permanent: to stop one token, use `revoke_existing` instead. The
workspace's data is not deleted by a revoke.

### Lower a workspace's transaction limit

```bash
curl -X PATCH "https://connect-api.kryptos.io/developer/grants/GRANT_ID/transaction-limit" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET" \
  -H "Content-Type: application/json" \
  -d '{ "transactionLimit": 5000 }'
```

The limit can't go above the one Kryptos set for you, and the limiter can't be switched off; both
return `403 LIMIT_ABOVE_CEILING`.

### List your workspaces

`GET https://connect-api.kryptos.io/token/grants` (client ID + secret) lists your active grants, with
their workspace ids. It also lists your Connect users' grants: white-label workspaces are the ones whose
`scopes` include `connect:api`. The [Developer Portal](/docs/developer-portal) shows them too, with a
**White-label** badge.

## Errors when creating a workspace

| Status | Code | What to do |
| --- | --- | --- |
| `400` | (validation) | An unknown field or invalid value. Fix the body. |
| `400` | `INVALID_CURRENCY` | Unsupported `base_currency_code`. |
| `401` | — | Wrong client ID or secret, or the client is switched off. |
| `403` | `SANDBOX_CLIENT` | Use a production client. |
| `403` | `API_WORKSPACES_NOT_ENABLED` | Request access for your developer workspace. |
| `403` | `WORKSPACE_LIMIT_REACHED` | Revoke workspaces you no longer need, or ask for a higher limit. |
| `409` | `CREATE_IN_PROGRESS` | Another create for this client is running. Retry after `Retry-After`. |
| `429` | `RATE_LIMITED` | Over 30 creates this minute. Retry after `Retry-After`. |
| `503` | `TEMPORARILY_UNAVAILABLE` | Retry. |

Calls with the workspace token follow the usual [error codes](/docs/reference/errors). An endpoint that
a workspace token can't call returns `403 MACHINE_ROUTE_NOT_ALLOWED`; the [API Reference](/docs/api-reference/kryptos-api) marks which ones it can.
