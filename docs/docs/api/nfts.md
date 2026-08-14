---
id: nfts
title: NFTs
sidebar_position: 8
---

# NFTs

NFT holdings across chains, individually or grouped by collection.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `portfolios:read`

| | Endpoint | Returns |
| --- | --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/nfts` | Individual NFTs |
| <span className="badge badge--get">GET</span> | `/v1/nfts/collections` | Grouped by collection |
| <span className="badge badge--get">GET</span> | `/v1/nfts/{contractAddress}/{tokenId}` | One NFT |
| <span className="badge badge--get">GET</span> | `/v1/nfts/portfolio/{portfolioId}` | Individual NFTs, one portfolio |
| <span className="badge badge--get">GET</span> | `/v1/nfts/portfolio/{portfolioId}/{contractAddress}/{tokenId}` | One NFT, one portfolio |

## Request

```bash
curl -X GET "https://api-v2.kryptos.io/v1/nfts?chain=ethereum&limit=50" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Query Parameters

Shared by `/v1/nfts`, `/v1/nfts/collections` and the portfolio-scoped list.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `chain` | string | — | Chain to filter by, e.g. `ethereum` |
| `collectionId` | string | — | Filter to one collection. On `/collections`, returns that single row |
| `integrationId` | string | — | Scope to one connected account |
| `search` | string | — | Free-text match on NFT and collection name |
| `includeSpam` | boolean | `false` | Include NFTs flagged as spam. Accepts `true` or `1` |
| `offset` | integer | `0` | Rows to skip |
| `limit` | integer | `50` | Rows to return, 1–1000 |

## Response — NFT list

```json
{
  "success": true,
  "data": [
    {
      "id": "nft_31f9c2",
      "contractAddress": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
      "tokenId": "1234",
      "chain": "ethereum",
      "assetRaw": {},
      "price": { "price": 18400, "baseCurrency": "USD", "timestamp": 1721088000000, "source": "opensea" },
      "collection": {},
      "lastSale": {},
      "source": {
        "provider": "ethereum",
        "providerPublicName": "Ethereum",
        "publicAddress": "0xab...",
        "walletId": "int_44de",
        "logoUrl": "https://...",
        "alias": "Main EVM"
      },
      "isSpam": false
    }
  ],
  "totalCount": 15,
  "totalEstimatedValueUsd": 120500
}
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Holding id |
| `contractAddress` | string | NFT contract |
| `tokenId` | string | Token id within the contract |
| `chain` | string | Chain |
| `assetRaw` | object | Provider-supplied metadata — name, description, media URLs, traits |
| `price` | object | Estimated value as `{ price, baseCurrency, timestamp, source }` |
| `collection` | object | Collection metadata, including floor price where known |
| `lastSale` | object | Most recent observed sale |
| `source` | object | The account holding it |
| `isSpam` | boolean | Flagged as spam |

Two things to note. The NFT list envelope has **no `offset`, `limit` or `hasMore`** — only
`totalCount` and `totalEstimatedValueUsd`. Page by tracking your own `offset` against `totalCount`.
And `assetRaw`, `collection` and `lastSale` are passed through from the upstream provider, so their
keys vary by chain and marketplace; probe rather than assume.

## Response — collections

```json
{
  "success": true,
  "data": [
    {
      "collectionId": "bored-ape-yacht-club",
      "name": "Bored Ape Yacht Club",
      "imageUrl": "https://...",
      "itemCount": 3,
      "totalValueUsd": 55200
    }
  ],
  "totalCount": 6,
  "totalEstimatedValueUsd": 120500
}
```

| Field | Type | Description |
| --- | --- | --- |
| `collectionId` | string | Collection identifier — use as the `collectionId` filter |
| `name` | string \| null | Collection name, `null` when the provider reports none |
| `imageUrl` | string \| null | Collection image |
| `itemCount` | number | NFTs held from this collection |
| `totalValueUsd` | number | Summed value of the held items |

`totalCount` is the number of distinct **collections**; `totalEstimatedValueUsd` is the whole
workspace's (or portfolio's) NFT value, not just this page.

## Response — single NFT

`{ success, data }` with one NFT object, or `404 { "success": false, "error": "Not found" }`.
