---
id: assets
title: Assets
sidebar_position: 17
---

# Assets

Search the Kryptos asset catalogue to resolve a symbol or contract address into the `assetId` that the
rest of the API uses.

**Base URL:** `https://api-v2.kryptos.io`

| | Endpoint |
| --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/assets/search` |

Shared reference data, not workspace-specific — it needs a valid token, but no workspace parameter.

## Request

```bash
curl -X GET "https://api-v2.kryptos.io/v1/assets/search?q=ethereum&limit=10" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Query Parameters

Every parameter is optional.

| Parameter | Type | Description |
| --- | --- | --- |
| `q` | string | Free-text query, 1–100 characters. Enables fuzzy matching |
| `contractAddress` | string | Exact contract address, 1–255 characters |
| `type` | string | `crypto`, `fiat`, `nft` or `stablecoin` |
| `category` | string | Asset category, 1–100 characters |
| `chainId` | string | Chain to restrict to, 1–100 characters |
| `limit` | integer | 1–100 |
| `offset` | integer | Rows to skip |

**Omitting `q` is valid** and returns the top assets by market-cap rank — a good default list for a
picker before the user has typed anything.

## Response

```json
{
  "success": true,
  "data": [
    {
      "id": "a3f1c8e0-9d42-4b17-8c55-6e0b2f7a1d34",
      "symbol": "ETH",
      "name": "Ethereum",
      "logoUrl": "https://...",
      "type": "crypto",
      "category": "layer-1",
      "cmcRank": 2,
      "chains": [
        { "chainId": "ethereum", "contractAddress": "0x0000000000000000000000000000000000000000" }
      ],
      "score": 0.98
    }
  ],
  "total": 14,
  "limit": 10,
  "offset": 0
}
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | **The `assetId`** to use in `assetIds` filters and transaction legs |
| `symbol` | string | Ticker |
| `name` | string | Display name |
| `logoUrl` | string \| null | Icon URL |
| `type` | string | `crypto`, `fiat`, `nft` or `stablecoin` |
| `category` | string \| null | Asset category |
| `cmcRank` | number \| null | Market-cap rank; `null` for unranked assets |
| `chains` | array | Every chain the asset exists on, with its contract address |
| `score` | number | Relevance 0–1 — **present only when `q` is supplied** |

Results are ranked by `cmcRank` when browsing and by `score` when searching, so don't re-sort a
`q` result by rank — you would push the best textual match down the list.

## Resolving an asset

Many tickers are reused by unrelated tokens, and scam tokens deliberately clone popular symbols. To
resolve reliably:

1. **If you have a contract address, search by it.** `?contractAddress=0x…` is exact and unambiguous.
2. **Otherwise search by `q` and disambiguate on `chains` and `cmcRank`.** A legitimate token normally
   has a rank; a clone usually does not.

Then use the returned `id` — writing a transaction with a symbol alone leaves the asset to be resolved
server-side, which can match the wrong token.
