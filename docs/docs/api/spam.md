---
id: spam
title: Spam
sidebar_position: 10
---

# Spam

The assets a workspace has flagged as spam. Airdropped scam tokens are the usual case — flagging keeps
them out of balances, totals and transaction lists.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `transactions:read`

| | Endpoint |
| --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/spam` |

## Request

```bash
curl -X GET "https://api-v2.kryptos.io/v1/spam?limit=20" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Query Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `limit` | integer | `20` | 1–200. Note the default differs from other list endpoints |
| `offset` | integer | `0` | Rows to skip |
| `includeNonSpam` | boolean | `false` | Also return entries explicitly marked *not* spam |
| `search` | string | — | Match on symbol or name, max 100 characters |

An asset can carry an explicit "not spam" decision, which is how a user overrides automatic detection.
`includeNonSpam=true` returns those too, so you can show the full decision history rather than only the
exclusions.

## Response

Wrapped as `{ success, data }`, with the collection and its pagination together inside `data`:

```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "usp_31c9",
        "workspaceId": "ws_12ab",
        "assetId": "a3f1c8e0-9d42-4b17-8c55-6e0b2f7a1d34",
        "symbol": "SCAM",
        "chainId": "ethereum",
        "isSpam": true,
        "name": "Airdropped Token",
        "logoUrl": "https://...",
        "contractAddress": "0x...",
        "createdAt": "2026-08-01T09:30:00.000Z",
        "updatedAt": "2026-08-01T09:30:00.000Z"
      }
    ],
    "totalCount": 37,
    "limit": 20,
    "offset": 0,
    "hasMore": true,
    "totalPages": 2
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Entry id |
| `assetId` | string | The flagged asset |
| `symbol` | string | Ticker as recorded when flagged |
| `chainId` | string | Chain the flag applies to, or a sentinel meaning every chain |
| `isSpam` | boolean | `true` is a spam flag; `false` is an explicit "not spam" override |
| `name`, `logoUrl` | string \| null | Asset display data, joined from the catalogue |
| `contractAddress` | string \| null | Contract on `chainId`; `null` when that chain has no matching deployment |
| `createdAt`, `updatedAt` | string | ISO 8601 |

`chainId` is scoped: an entry flags the asset on that chain, not everywhere. `contractAddress` does
not fall back across chains — a chain-scoped entry whose chain has no deployment stays `null` rather
than showing another chain's address.

## Effect of flagging

Once an asset is flagged, it is excluded **by default** from:

- [Holdings](/docs/api/holdings), [DeFi](/docs/api/defi) and [NFTs](/docs/api/nfts)
- [Transactions](/docs/api/transactions)

Pass `includeSpam=true` on any of those to see it. This is the most common cause of a total that
doesn't match a user's own arithmetic — spam is silently excluded unless you ask for it.

Two spam lists apply, and this endpoint reports the workspace's own. A platform-wide list maintained by
Kryptos also suppresses known scam assets, and is reflected in the filtered results above.
