---
id: integrations
title: Integrations
sidebar_position: 11
---

# Integrations

A connected exchange, wallet or blockchain address, with its sync state and per-asset holdings.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `integrations:read`

| | Endpoint | Returns |
| --- | --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/integrations` | List, filter, paginate |
| <span className="badge badge--get">GET</span> | `/v1/integrations/{id}` | One integration, with sync and CSV history |
| <span className="badge badge--get">GET</span> | `/v1/integrations/search` | Typeahead search |
| <span className="badge badge--get">GET</span> | `/v1/integrations/sync-status` | Most recent sync time |
| <span className="badge badge--get">GET</span> | `/v1/integrations/{id}/assets` | Per-asset holdings breakdown |

Users connect accounts through the [Kryptos Connect widget](/docs/kryptos-connect/overview), which
handles credentials, OAuth and CSV upload for you.

## List integrations

```bash
curl -X GET "https://api-v2.kryptos.io/v1/integrations?workspaceId=WORKSPACE_ID&page=1&limit=50" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Query Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `workspaceId` | string | — | Required unless your token is workspace-bound |
| `primaryPortfolioId` | string | — | Scope to one portfolio |
| `providerId` | string | — | Filter by provider |
| `providerType` | string | — | `exchange`, `blockchain`, `wallet`, `service`, `aggregator`, `custom` |
| `status` | string | — | `pending`, `active`, `inactive`, `suspended`, `error` |
| `search` | string | — | Match on alias, address and account name |
| `hasMissingBalance` | boolean | — | Only accounts whose calculated balance disagrees with the provider's |
| `fields` | string | — | `summary` returns a lighter payload |
| `sortBy` | string | `createdAt` | `alias`, `addedOn`, `createdAt`, `updatedAt`, `lastSyncedAt`, `netValue`, `txnCount` |
| `sortOrder` | string | `desc` | `asc` or `desc` |
| `page` | integer | `1` | Page number |
| `limit` | integer | `50` | 1–100, silently clamped |

### Response

```json
{
  "success": true,
  "data": {
    "integrations": [
      {
        "id": "int_9f2c",
        "workspaceId": "ws_12ab",
        "providerId": "binance",
        "primaryPortfolioId": "pf_main",
        "alias": "Main exchange",
        "accountStatus": "active",
        "credentialKind": "api_key",
        "credentialValidationStatus": "valid",
        "importMethod": "api",
        "syncEnabled": true,
        "isCustomWallet": false,
        "lastSyncId": "sync_7712",
        "lastSyncedAt": "2026-08-13T09:14:22.000Z",
        "latestSync": {
          "id": "sync_7712",
          "status": "completed",
          "syncKind": "api",
          "mode": "incremental",
          "progressPercent": 100,
          "recordsProcessed": 412,
          "recordsFailed": 0,
          "limitReached": false,
          "completedAt": "2026-08-13T09:16:02.000Z"
        },
        "txnCounts": { "total": 1284, "byType": { "trade": 900, "deposit": 220 } },
        "netValue": 150000,
        "baseCurrency": "USD",
        "metadataUpdatedAt": "2026-08-13T09:16:30.000Z",
        "hasMissingBalance": false,
        "assetLogos": ["https://...", "https://..."],
        "createdAt": "2026-01-04T11:02:00.000Z",
        "updatedAt": "2026-08-13T09:16:30.000Z",
        "deletedAt": null
      }
    ],
    "pagination": { "page": 1, "limit": 50, "total": 7, "totalPages": 1, "hasMore": false },
    "providerCounts": { "binance": 1, "ethereum": 3 }
  }
}
```

### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Integration id — the `walletId` other endpoints refer to |
| `providerId` | string | Provider slug. See [Providers](/docs/api/providers) |
| `primaryPortfolioId` | string \| null | Portfolio it belongs to |
| `alias` | string \| null | User-facing name |
| `accountStatus` | string | `pending`, `active`, `inactive`, `suspended`, `deleting`, `deleted`, `error` |
| `credentialKind` | string | `api_key`, `oauth`, `address`, `account_name`, `wallet_connect`, `csv`, `none` |
| `credentialValidationStatus` | string \| null | `valid`, `invalid`, `expired`, `pending` |
| `importMethod` | string \| null | `api`, `csv` or `oauth` |
| `syncEnabled` | boolean | Automatic syncing is on |
| `isCustomWallet` | boolean | A manual wallet with no provider connection |
| `lastSyncId`, `lastSyncedAt` | string | Most recent sync |
| `latestSync` | object \| null | Most recent sync of any status; `null` if never synced |
| `txnCounts` | object \| null | `{ total, byType }`; `null` until first computed |
| `netValue` | number \| null | Holdings value in the workspace base currency |
| `metadataUpdatedAt` | string \| null | When `txnCounts` and `netValue` were last refreshed |
| `hasMissingBalance` | boolean | See below |
| `assetLogos` | array | Up to 5 asset logos, for list rendering |
| `createdAt`, `updatedAt`, `deletedAt` | string | ISO 8601 timestamps |

`txnCounts` and `netValue` come from cached metadata refreshed by the recompute pipeline, so
`metadataUpdatedAt` may lag `lastSyncedAt` by a few seconds after a sync. Compare the two before
presenting the numbers as current. **`txnCounts.total` is not additive across integrations** — an
internal transfer is counted for both wallets it touches. `netValue` *is* additive.

`hasMissingBalance` is `true` when any asset's ledger-derived balance differs from the
provider-reported one by more than 0.01. It is evaluated live per request, so it always agrees with the
`hasMissingBalance` filter. CSV and manual integrations have no provider-reported balance to compare, so
they are `false` — unverifiable, not verified.

### Sync status values

`latestSync.status` is one of `pending`, `queued`, `in_progress`, `completed`, `partially_synced`,
`failed`, `cancelled`. The last four are terminal.

`partially_synced` is a **success with losses**, not a failure — treating it as one will make users
re-run syncs that already imported most of their data. Two different things produce it, and
`latestSync.limitReached` tells them apart:

- **`limitReached: true`** — the workspace hit its transaction limit mid-run. Rows before the cut are
  saved; the rest were never fetched. The wallet's history is incomplete until the cap is raised **and**
  the integration is re-synced from the start — raising the cap alone backfills nothing.
- **`limitReached: false`** — one or more provider functions failed while the others succeeded. Read
  `recordsFailed`.

`limitReached` is the v2 replacement for v1's `limitExceeded`.

## One integration

`GET /v1/integrations/{id}` returns the same object as `{ success, data }`, plus two fields the list
omits:

| Field | Type | Description |
| --- | --- | --- |
| `credentials` | object \| null | For `address` and `account_name` kinds only, with secrets masked; `null` for secret-bearing kinds |
| `csvUploads` | array | Upload history, newest first: `uploadId`, `fileName`, `fileSize`, `fileType`, `status`, `rowCount`, `summary`, `uploadedAt` |

Secrets are never returned for `api_key`, `oauth` or `wallet_connect` credentials.

## Per-asset breakdown

```bash
curl -X GET "https://api-v2.kryptos.io/v1/integrations/int_9f2c/assets?workspaceId=WORKSPACE_ID" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `workspaceId` | string | — | Required unless your token is workspace-bound |
| `q` | string | — | Match on asset symbol or name, max 100 characters |
| `includeSpam` | boolean | `false` | Include assets flagged as spam |
| `minValue` | number | — | Drop assets worth less than this |
| `page` | integer | `1` | Page number |
| `limit` | integer | `50` | 1–100 |

Returns `{ success, data: { assets, pagination } }` — the per-asset detail behind this integration's
`netValue`.

## Helpers

**`GET /v1/integrations/search`** — typeahead. Both `workspaceId` and `q` are required; omitting either
returns `400`. Returns `{ success, data: { integrations } }`.

**`GET /v1/integrations/sync-status`** — returns `{ success, data: { lastSyncedAt } }`, the most recent
sync across the workspace. It takes only an optional `portfolioId`; the workspace comes from your token
rather than a query parameter.
