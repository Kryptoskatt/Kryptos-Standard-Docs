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

Wrapped as `{ success, data }`.

## Effect of flagging

Once an asset is flagged, it is excluded **by default** from:

- [Holdings](/docs/api/holdings), [DeFi](/docs/api/defi) and [NFTs](/docs/api/nfts)
- [Transactions](/docs/api/transactions)

Pass `includeSpam=true` on any of those to see it. This is the most common cause of a total that
doesn't match a user's own arithmetic — spam is silently excluded unless you ask for it.

Two spam lists apply, and this endpoint reports the workspace's own. A platform-wide list maintained by
Kryptos also suppresses known scam assets, and is reflected in the filtered results above.
