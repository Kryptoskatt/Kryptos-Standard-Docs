---
id: migrating-from-connect-apis
title: Migrating from the previous API
sidebar_position: 21
---

# Migrating from the previous API

If you built against `https://connect.kryptos.io/api`, this page is the complete list of what changes.
Endpoint paths, field names, response envelopes and authentication headers all move.

Nothing about the OAuth or Kryptos Connect **authorization** flow changes — the same client
credentials, the same link tokens, the same access tokens. Only the data endpoints move.

## 1. Base URL

```diff
- https://connect.kryptos.io/api/v1/holdings
+ https://api-v2.kryptos.io/v1/holdings
```

The `/api` prefix is gone. Paths are routed by resource, with no service name in the URL.

## 2. Authentication — drop the client credentials

```diff
  Authorization: Bearer ACCESS_TOKEN
- X-Client-Id: YOUR_CLIENT_ID
- X-Client-Secret: YOUR_CLIENT_SECRET
```

Access tokens are validated against the grant that issued them, so client credentials are redundant on
data calls. Removing them does not need to be atomic with the rest of your migration — drop them as you
touch each call site.

Keep sending them where they are genuinely the credential: the Connect
[link-token and token-exchange endpoints](/docs/kryptos-connect/backend), which authenticate your
application rather than a user.

## 3. Response envelopes

The old API added `user_id` and `timestamp` to nearly every response. **Both are gone.** If you used
`user_id` for correlation, take it from your own grant record or from
[`/v1/users/me`](/docs/api/userinfo).

Most endpoints now wrap the payload:

```diff
- { "holdings": [...], "summary": {...}, "user_id": "...", "timestamp": 1640995200000 }
+ { "success": true, "data": [...], "totalCount": 42, "offset": 0, "limit": 50, "hasMore": false, "totalValue": 250000 }
```

Transactions and ledgers are the exception — they return `{ data, meta }` with **no `success` field**.
Read [Response shapes](/docs/api/overview#response-shapes) before changing your parser; there are three
variants and picking the wrong one is the most common migration bug.

Pagination changed shape too, and differs per domain. The old `pagination: { limit, offset,
returned_count, totalCount, hasNextPage, hasPreviousPage }` no longer exists anywhere. See
[Pagination](/docs/api/overview#pagination).

## 4. Endpoint renames

| Previously | Now |
| --- | --- |
| `GET /v1/holdings` | [`GET /v1/holdings`](/docs/api/holdings) — same path, new fields |
| `GET /v1/holdings/graph` | **No equivalent** — portfolio value over time is not exposed |
| `GET /v1/defi-holdings` | [`GET /v1/defi`](/docs/api/defi) |
| `GET /v1/nft-holdings` | [`GET /v1/nfts`](/docs/api/nfts) |
| `GET /v1/userinfo` | [`GET /v1/users/me`](/docs/api/userinfo) |
| `GET /v1/transactions/label-types` | [`GET /v1/labels`](/docs/api/labels) |
| `GET /v1/integrations/providers` | [`GET /v1/providers`](/docs/api/providers) |
| `GET /integrations/public/list` | [`GET /v1/providers`](/docs/api/providers) |
| `GET /v1/counterparties` | [`GET /v1/counter-parties`](/docs/api/counterparties) — note the hyphen |

## 5. Endpoints whose replacement has a different shape

| Previously | Now | Why it differs |
| --- | --- | --- |
| `GET /v1/assets/lookup` | [`GET /v1/assets/search?contractAddress=…`](/docs/api/assets) | One search endpoint handles both exact and fuzzy resolution |
| `GET /v1/reconciliation/uncategorized` | `GET /v1/transactions?types=deposit,withdrawal&labels=Deposit,Withdrawal&isUncategorisedIgnored=false` | Now a transaction filter rather than its own endpoint |
| `GET /v1/reconciliation/high-pnl` | `GET /v1/transactions?minTotalGains=…&isHighPnLReviewed=false` | Now a transaction filter |
| `GET /v1/reconciliation/missing-purchases` | `GET /v1/transactions?isMissingTransaction=true` | Now a transaction filter |
| `GET /v1/reconciliation/missing-prices` | `GET /v1/transactions?hasMissingPrice=true` | Now a transaction filter |
| `GET /v1/counterparties/{id}` | [`GET /v1/counter-parties`](/docs/api/counterparties) + filter | No single-item endpoint |
| `GET /v0/wallets` | [`GET /v1/integrations`](/docs/api/integrations) | Same resource, renamed |

The reconciliation endpoints are the pattern worth internalising: what used to be four purpose-built
endpoints is now four filters on [`GET /v1/transactions`](/docs/api/transactions). That composes — you can
combine `isMissingTransaction=true` with a wallet or date filter, which the old endpoints could not do.

## 6. Field renames

Holdings:

| Previously | Now |
| --- | --- |
| `costbasis` | `costBasis` |
| `roi` | `roiPercentage` |
| `24hrChange` | `change24h` (absolute) and `change24hPercentage` (percentage) |
| `asset.tokenId` | still present, plus a top-level `assetId` |
| `summary` (inline) | Use the top-level `totalValue` on [`GET /v1/holdings`](/docs/api/holdings) |
| — | new: `costPerUnit`, `transactionCount`, `isSpam` |

Two behavioural changes hide in that table.

**`roiPercentage` can be `null`.** The old `roi` returned `0` when cost basis was unknown, which is
indistinguishable from a genuine break-even. The new field returns `null` for "no basis recorded".
Coercing it to `0` reintroduces the ambiguity.

**`24hrChange` split in two.** The old field was a percentage. `change24h` is an **absolute amount**;
`change24hPercentage` is the percentage. Mapping `24hrChange` to `change24h` without checking will show
a currency amount where you meant a percent.

The holdings `summary` block no longer ships inline. `GET /v1/holdings` returns a top-level `totalValue`
for the whole filtered set — token holdings only. NFT and DeFi value are reported separately, by
[`GET /v1/nfts`](/docs/api/nfts) (`totalEstimatedValueUsd`) and
[`GET /v1/defi/totals`](/docs/api/defi#response--v1defitotals). Summing all three gives the figure the old
`summary.totalValue` approximated.

Transactions keep `incomingAssets`, `outgoingAssets` and `fee`, but the **leg objects changed**: each is
now a ledger with an `id`, a `quantity` **string**, and a derived `value`. Quantities are strings to
preserve 18-decimal precision — see [the note on transactions](/docs/api/transactions#ledger-legs).
Parsing them as floats will corrupt large balances.

## 7. Removed with no replacement

- **`GET /v1/profiling`** — investor classification and portfolio-composition analytics. There is no
  equivalent, and no combination of the current endpoints reproduces the classification, size tier or
  activity level.
- **`GET /v1/holdings/graph`** — portfolio value over time.
- **The entire `/v0/*` surface** — `GET /v0/wallets`, `GET /v0/transactions`, `GET /v0/nft-holdings`,
  `GET /v0/defi-holdings`. The read endpoints map onto their v1 equivalents:

| Previously | Now |
| --- | --- |
| `GET /v0/wallets` | [`GET /v1/integrations`](/docs/api/integrations) |
| `GET /v0/transactions` | [`GET /v1/transactions`](/docs/api/transactions) |
| `GET /v0/nft-holdings` | [`GET /v1/nfts`](/docs/api/nfts) |
| `GET /v0/defi-holdings` | [`GET /v1/defi`](/docs/api/defi) |

The v0 responses were snake_case (`contract_address`, `usd_price`, `net_usd_value`); the v1 equivalents
are camelCase throughout.

### Write endpoints

The endpoints documented here are **read-only**. The previous API's write operations —
`POST /v0/transactions`, `POST /v0/integrations`, the transaction and label `PATCH` endpoints, and
`PATCH /v1/transactions/values` — have no documented replacement. If your integration writes data,
contact [support@kryptos.io](mailto:support@kryptos.io) before migrating.

Users connect accounts through the [Kryptos Connect widget](/docs/kryptos-connect/overview), which
replaces `POST /v0/integrations` for the common case.

## 8. What's new

Worth knowing about, because some of it replaces workarounds:

- [`GET /v1/ledgers`](/docs/api/ledgers) — query transaction legs directly, across transactions, with
  running balances and per-leg accounting figures
- [`GET /v1/calculated-balances`](/docs/api/holdings#provider-reported-vs-calculated-balances) — ledger-derived balances with reconciliation flags
- [`GET /v1/spam`](/docs/api/spam) — see which assets are being excluded from totals
- [`GET /v1/integrations/{id}/assets`](/docs/api/integrations#per-asset-breakdown) — per-asset breakdown for one account
- [Portfolios](/docs/api/portfolios) — group accounts, and scope any portfolio query to one
- Richer transaction filtering — exclusion filters (`notLabels`, `notWalletIds`, …) and data-quality
  flags that replace the old reconciliation endpoints

## Migration checklist

1. Change the base URL, and drop `/api` from every path.
2. Remove `X-Client-Id` and `X-Client-Secret` from data calls — keep them on Connect auth calls.
3. Rename the endpoints in §4, and rework the five in §5.
4. Update your response parsing for the three envelopes, and stop reading `user_id` / `timestamp`.
5. Rename the holdings fields, and handle `roiPercentage: null` and the `change24h` split explicitly.
6. Replace `summary` reads with the top-level `totalValue`, plus the NFT and DeFi totals if you need them.
7. Switch ledger quantities to a decimal type.
8. Replace `/v0` read calls with their v1 equivalents.
9. Decide what to do about `profiling` and `holdings/graph` if you used them.
10. If you write data, talk to support before migrating.
