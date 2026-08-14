---
id: holdings
title: Holdings
sidebar_position: 3
---

# Holdings

Token balances across every connected account, with cost basis, live valuation and per-wallet
allocation.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `portfolios:read`

| | Endpoint |
| --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/holdings` |
| <span className="badge badge--get">GET</span> | `/v1/holdings/{assetId}` |
| <span className="badge badge--get">GET</span> | `/v1/holdings/portfolio/{portfolioId}` |
| <span className="badge badge--get">GET</span> | `/v1/holdings/portfolio/{portfolioId}/holdings/{assetId}` |
| <span className="badge badge--get">GET</span> | `/v1/calculated-balances` |
| <span className="badge badge--get">GET</span> | `/v1/calculated-balances/portfolio/{portfolioId}` |

## Request

```bash
curl -X GET "https://api-v2.kryptos.io/v1/holdings" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Query Parameters

Shared by `/v1/holdings`, `/v1/holdings/portfolio/{portfolioId}` and both `/v1/calculated-balances`
endpoints.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `portfolioId` | string | — | Scope to one portfolio. Prefer the `/portfolio/{portfolioId}` path form. |
| `integrationId` | string | — | Scope to a single connected account. |
| `assetIds` | string | — | Comma-separated asset ids. |
| `search` | string | — | Free-text match on asset symbol and name. |
| `minValue` | number | — | Drop holdings worth less than this. Minimum `0`. |
| `includeSpam` | boolean | `false` | Include assets flagged as spam. Accepts `true` or `1`. |
| `type` | string | `all` | Ecosystem filter. `all` or `xstocks`. |
| `sortBy` | string | `value` | `value`, `quantity`, `name`, `24hrChange` or `txnCount`. |
| `sortOrder` | string | `desc` | `asc` or `desc`. |
| `offset` | integer | `0` | Rows to skip. |
| `limit` | integer | `50` | Rows to return, 1–1000. |
| `rates` | string | `true` | `false` skips the live price fetch — much faster, and omits every market field. See below. |
| `calculatedBalances` | boolean | `false` | Return ledger-derived balances instead of provider-reported ones. |
| `excludeCalculatedBalances` | boolean | `false` | Return only provider-reported balances, dropping ledger-derived rows. |

### Provider-reported vs. calculated balances

Two kinds of balance exist side by side, and three parameters select between them:

- A **provider-reported** balance is what the exchange API or the chain says you hold right now.
- A **calculated** balance is reconstructed by replaying the transaction ledger. Accounts fed only by
  CSV, and custom wallets, have no provider to ask — so their balances are always calculated.

By default `/v1/holdings` returns both, which is the number a user expects to see. Then:

| You want | Use |
| --- | --- |
| Only what providers report | `?excludeCalculatedBalances=true` |
| Only ledger-derived balances, for every account | `?calculatedBalances=true`, or `/v1/calculated-balances` |

`/v1/calculated-balances` is the dedicated form and returns two extra fields per row —
`isMissingTransactionHistory` and `lastLedgerTimestamp` — which is what makes it useful for
reconciliation. A `true` on the first means the running balance went negative, so acquisition history is
missing: the ledger records a disposal with no matching purchase, which overstates gains. The
transaction behind it is findable with
[`GET /v1/transactions?isMissingTransaction=true`](/docs/api/transactions).

### Skipping prices with `rates=false`

`rates=false` returns quantities and cost basis without contacting the price service. The response
then omits `marketPrice`, `marketValue`, `costPerUnit`, `unrealizedPnL`, `roiPercentage`, `change24h`,
`change24hPercentage` and the top-level `totalValue`. Use it when you only need positions.

## Response

```json
{
  "success": true,
  "data": [
    {
      "assetId": "a3f1c8e0-9d42-4b17-8c55-6e0b2f7a1d34",
      "asset": {
        "tokenId": "bitcoin",
        "symbol": "BTC",
        "publicName": "Bitcoin",
        "logoUrl": "https://...",
        "type": "crypto",
        "chainId": "bitcoin"
      },
      "totalQuantity": 2.5,
      "costBasis": 100000,
      "costPerUnit": 40000,
      "marketPrice": 50000,
      "marketValue": 125000,
      "unrealizedPnL": 25000,
      "roiPercentage": 25,
      "change24h": 4200,
      "change24hPercentage": 3.5,
      "baseCurrency": "USD",
      "isSpam": false,
      "transactionCount": 18,
      "assetDistribution": [
        {
          "integrationId": "int_9f2c",
          "quantity": 1.5,
          "account": {
            "provider": "ledger",
            "providerPublicName": "Ledger",
            "walletId": "int_9f2c",
            "publicAddress": "bc1q...",
            "logoUrl": "https://...",
            "alias": "Hardware wallet"
          },
          "allocationPercentage": 60,
          "transactionCount": 11,
          "portfolioId": "pf_main",
          "portfolioName": "Main"
        }
      ]
    }
  ],
  "totalCount": 42,
  "offset": 0,
  "limit": 50,
  "hasMore": false,
  "totalValue": 250000
}
```

Note the shape: pagination and `totalValue` sit at the **top level**, beside `success`, not inside
`data`. See [API Overview](/docs/api/overview#response-shapes).

The single-asset endpoints (`/v1/holdings/{assetId}` and its portfolio form) return one object as
`{ success, data }`, or `404 { success: false, error: "Not found" }`.

## Response Fields

### Holding

| Field | Type | Description |
| --- | --- | --- |
| `assetId` | string | Kryptos asset id — use this for `assetIds` filters and transaction writes |
| `asset` | object | Asset descriptor, see below |
| `totalQuantity` | number | Quantity held across all accounts |
| `costBasis` | number | Total acquisition cost |
| `costPerUnit` | number | Average cost per unit (`costBasis / totalQuantity`); `0` when there is no cost basis |
| `marketPrice` | number | Current unit price |
| `marketValue` | number | `totalQuantity × marketPrice` |
| `unrealizedPnL` | number | `marketValue − costBasis` |
| `roiPercentage` | number \| null | Return as a percentage of cost basis. **`null` when cost basis is 0** — that means "no basis recorded", not "0% return" |
| `change24h` | number | Absolute value change over 24h, in `baseCurrency` |
| `change24hPercentage` | number | Percentage price change over 24h |
| `baseCurrency` | string | Currency all monetary fields are denominated in |
| `isSpam` | boolean | Flagged as a spam or scam asset |
| `transactionCount` | number | Transactions touching this asset |
| `assetDistribution` | array | Per-account breakdown, see below |

Treat `roiPercentage: null` explicitly. Coercing it to `0` reports a break-even position for an asset
whose basis is simply unknown.

### Asset

| Field | Type | Description |
| --- | --- | --- |
| `tokenId` | string | Canonical token identifier, e.g. `bitcoin` |
| `symbol` | string | Ticker, e.g. `BTC` |
| `publicName` | string | Display name |
| `logoUrl` | string | Icon URL |
| `type` | string | `crypto`, `nft` or `fiat` |
| `chainId` | string | Chain the asset lives on, when applicable |
| `contractAddress` | string | Token contract, for on-chain tokens |

### Asset Distribution

| Field | Type | Description |
| --- | --- | --- |
| `integrationId` | string | The connected account holding this slice |
| `quantity` | number | Quantity in this account |
| `account` | object | `provider`, `providerPublicName`, `publicAddress`, `walletId`, `logoUrl`, `alias` |
| `allocationPercentage` | number | Share of this asset's total value held here |
| `transactionCount` | number | Transactions for this asset in this account |
| `portfolioId` | string | Portfolio the account belongs to |
| `portfolioName` | string | Portfolio display name |

### Calculated balances — extra fields

`/v1/calculated-balances` and `?calculatedBalances=true` add:

| Field | Type | Description |
| --- | --- | --- |
| `isMissingTransactionHistory` | boolean | The replayed balance went negative — acquisitions are missing from the ledger |
| `lastLedgerTimestamp` | number \| null | Unix ms of the most recent ledger entry feeding this balance |

## Portfolio totals

`totalValue` is the summed value of the **whole filtered set**, not just the returned page — so it stays
correct as you page, and you should not add up `marketValue` yourself.

It covers token holdings only. NFT and DeFi value are separate: see [NFTs](/docs/api/nfts) for
`totalEstimatedValueUsd` and [DeFi](/docs/api/defi) for `/v1/defi/totals`.
