---
id: providers
title: Providers
sidebar_position: 14
---

# Providers

The catalogue of supported exchanges, wallets, blockchains and services — what you can connect, which
credentials each one needs, and what data it can return.

**Base URL:** `https://api-v2.kryptos.io`

| | Endpoint | Returns |
| --- | --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/providers` | The catalogue, filtered and paginated |
| <span className="badge badge--get">GET</span> | `/v1/providers/{id}` | One provider in full |

**No authentication required.** This is a public catalogue, so you can render an integration picker
before a user has signed in.

## Request

```bash
curl -X GET "https://api-v2.kryptos.io/v1/providers?type=exchange&featured=true"
```

## Query Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | string | — | `exchange`, `blockchain`, `wallet`, `service` or `aggregator` |
| `featured` | boolean | — | Only providers Kryptos highlights |
| `isWorking` | boolean | — | Only providers currently operational |
| `search` | string | — | Match on name, public name and slug |
| `page` | integer | `1` | Page number |
| `limit` | integer | `50` | 1–100, silently clamped |

Results are ordered featured first, then working, then alphabetically — so an unfiltered first page is
already a sensible default list.

## Response

```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "id": "binance",
        "slug": "binance",
        "name": "Binance",
        "publicName": "Binance",
        "description": "Global cryptocurrency exchange",
        "type": "exchange",
        "logo": "https://...",
        "featured": true,
        "isWorking": true,
        "importMethods": ["api", "csv"],
        "credentialFields": {
          "apiKey": { "required": true, "type": "string", "label": "API Key", "placeholder": "Enter your API key" },
          "secretKey": { "required": true, "type": "password", "label": "Secret Key" }
        },
        "capabilities": { "trades": true, "deposits": true, "withdrawals": true, "holdings": true, "staking": true },
        "walletSupportedChains": null,
        "functions": [
          {
            "name": "fetchTrades",
            "public_name": "Trades",
            "is_base": true,
            "categories": ["trade"],
            "enabled": true,
            "operational": true
          }
        ],
        "integrationInfo": {},
        "walletLimitations": {
          "importOptions": [{ "name": "api", "status": true, "isRecommended": true }]
        },
        "metadata": {},
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-08-01T00:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 50, "total": 312, "totalPages": 7, "hasMore": true }
  }
}
```

## Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Provider id — matches an integration's `providerId` |
| `slug` | string | URL-safe identifier |
| `name` | string | Internal name |
| `publicName` | string | Display name |
| `description` | string \| null | Short description |
| `type` | string | `exchange`, `blockchain`, `wallet`, `service` or `aggregator` |
| `logo` | string \| null | Logo URL |
| `featured` | boolean | Highlighted by Kryptos |
| `isWorking` | boolean | Currently operational — see below |
| `importMethods` | array | How data can be imported: `api`, `csv`, `oauth`, `address`, `wallet_connect`, `manual` |
| `credentialFields` | object | Which credential inputs to render, see below |
| `capabilities` | object | Data this provider can return |
| `walletSupportedChains` | array \| null | For wallets: supported chains, each `{ id, onlyManual? }` |
| `functions` | array \| null | Connector functions available, see below; pass a subset as `config.userFunctions` |
| `integrationInfo` | object \| null | Setup hints and known API limitations |
| `walletLimitations` | object \| null | Import options, per-method feature lists, step-by-step instructions |
| `metadata` | object \| null | Provider-specific extras — DeBank id, WalletConnect id, native token |
| `createdAt`, `updatedAt` | string | ISO 8601 |

`isWorking: false` means Kryptos has detected the provider's API as degraded or broken. Connecting is
still allowed, but syncs will likely fail — grey the option out rather than hiding it, so users
understand why.

### Building a credential form

`credentialFields` is a map of field name to definition, so you can render the right inputs without
hard-coding per provider:

| Field | Type | Description |
| --- | --- | --- |
| `required` | boolean | Whether the field must be filled |
| `type` | string | `string`, `password` or `boolean` — drives the input type |
| `label` | string | Field label to display |
| `placeholder` | string | Optional placeholder |

Possible keys include `apiKey`, `secretKey`, `password`, `accountName`, `address` and `communityId`.
The map is open-ended, so iterate it rather than checking for known keys.

### Connector functions

Each entry in `functions` describes one thing the connector can fetch:

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Identifier — the value to pass in `config.userFunctions` |
| `public_name` | string | Display name |
| `is_base` | boolean | A core function; if it is down the provider is effectively unusable |
| `categories` | array | What the function returns, e.g. `trade`, `deposit` |
| `enabled` | boolean | Switched on for this provider |
| `operational` | boolean | Switched on **and** its last health probe was clean |

`enabled && !operational` means Kryptos has the function turned on but its last probe failed — the
provider is degraded. Combine it with `is_base` for an outage badge: any base function not
operational is a full outage, a non-base one is partial.

`operational` is `false` for a function that has never been probed. Absence of a failure is not
evidence of health, so treat it as unknown rather than working.

The connector's internal configuration — the upstream endpoint each function calls, its rate-limit
and batching parameters, and the raw error text from the last probe — is not part of this response.

### Capabilities

`trades`, `deposits`, `withdrawals`, `staking`, `nft`, `defi`, `holdings`, `margin`, `futures`, `swap`,
`bridge`. Absent means unsupported.

## One provider

`GET /v1/providers/{id}` returns the same object as `{ success, data }`, or `404 NOT_FOUND`.

## Not in the catalogue

The internal custom-wallet provider is always excluded — it exists only to satisfy a database constraint
and is never something a user should pick. A user's own manual wallets appear on
[`GET /v1/integrations`](/docs/api/integrations) with `isCustomWallet: true` and no meaningful provider.
