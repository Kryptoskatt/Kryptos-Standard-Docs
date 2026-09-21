---
id: transactions
title: Transactions
sidebar_position: 7
---

# Transactions

The transaction record, with filtering across labels, types, accounts, assets, addresses and time.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `transactions:read`

| | Endpoint | Returns |
| --- | --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/transactions` | Filtered, paginated list |
| <span className="badge badge--get">GET</span> | `/v1/transactions/counts` | Counts by label and type |
| <span className="badge badge--get">GET</span> | `/v1/transactions/{id}` | One transaction |
| <span className="badge badge--get">GET</span> | `/v1/transactions/{id}/ledgers` | Its ledger legs |

Transactions and [ledgers](/docs/api/ledgers) use a different response envelope from the rest of the
API — **`{ data, meta }` with no `success` field**, and errors nested as
`{ error: { code, message } }`. See [API Overview](/docs/api/overview#response-shapes).

## List transactions

```bash
curl -X GET "https://api-v2.kryptos.io/v1/transactions?limit=50&types=trade" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Query Parameters

Comma-separated list parameters — pass `?labels=Buy,Sell`:

| Parameter | Description |
| --- | --- |
| `labels` | Transaction labels. See [Labels](/docs/api/labels) |
| `types` | Canonical types: `deposit`, `withdrawal`, `trade`, `transfer`, `payment` |
| `walletIds` | Connected account ids |
| `assetIds` | Kryptos asset ids |
| `providers` | Provider ids, e.g. `binance` |
| `importSourceTypes` | `API`, `CSV`, `Manual` |
| `ledgerTypes` | `incoming`, `outgoing`, `fee` |
| `tags` | User tags |
| `fromAddresses`, `toAddresses`, `addresses` | On-chain addresses |

Every one of those has an exclusion twin — `notLabels`, `notTypes`, `notWalletIds`, `notAssetIds`,
`notProviders`, `notImportSourceTypes`, `notLedgerTypes`, `notTags`, `notFromAddresses`,
`notToAddresses` — so you can filter a category out rather than in.

Boolean flags (pass `true`):

| Parameter | Default | Description |
| --- | --- | --- |
| `isDefiTrx` | — | DeFi transactions only |
| `isNFTTrx` | — | NFT transactions only |
| `isManual` | — | Manually created only |
| `isEdited` | — | Edited only |
| `includeSpam` | `false` | Include spam-labelled transactions |
| `includeIgnored` | `false` | Include Ignore-labelled transactions |
| `hasMissingPrice` | — | Missing a price on at least one leg |
| `hasMissingAsset` | — | An unresolved asset on at least one leg |
| `isMissingTransaction` | — | Running balance went negative here — missing acquisition history |
| `isHighPnLReviewed` | — | Already reviewed for unusually high P&L |
| `isUncategorisedIgnored` | — | Dismissed from the uncategorised queue |
| `isMissingPriceIgnored` | — | Dismissed from the missing-price queue |

Spam- and Ignore-labelled transactions are **excluded by default**. Totals computed from an
unfiltered list will not match a UI that shows them.

Ranges, sorting and paging:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `startTime`, `endTime` | number | — | Unix **milliseconds** |
| `minValue`, `maxValue` | number | — | Transaction fiat value bounds |
| `minTotalGains` | number | — | Minimum realized gain — use to find high-P&L transactions |
| `search` | string | — | Free text |
| `coaTagStatus` | string | — | `tagged`, `partial`, `untagged` (enterprise) |
| `coaSyncStatus` | string | — | `synced`, `unsynced` (enterprise) |
| `sortBy` | string | `timestamp` | `timestamp`, `netValue`, `totalGains`, `createdAt` |
| `sortOrder` | string | `desc` | `asc` or `desc` |
| `limit` | integer | `50` | 1–200 |
| `offset` | integer | `0` | Rows to skip |

### Response

```json
{
  "data": [
    {
      "id": "8f14e45f-ceea-467a-9a3b-1c2f0d7e5a91",
      "workspaceId": "ws_12ab",
      "transactionPlatformId": "0x9c2f...",
      "timestamp": 1721088000000,
      "type": "trade",
      "label": "Trade",
      "description": "Swap USDC for ETH",
      "notes": null,
      "importSource": { "type": "API", "importedAt": 1721088300000, "walletId": "int_9f2c", "syncId": "sync_7712", "functionName": "fetchTrades" },
      "isManual": false,
      "isEdited": false,
      "isDefiTrx": false,
      "isNFTTrx": false,
      "isMissingTransaction": false,
      "protocol": null,
      "tags": [],
      "comments": [],
      "netValue": { "fiatValue": 3200, "currency": "USD" },
      "totalCostbasis": 3100,
      "totalGains": 100,
      "explorerLink": "https://etherscan.io/tx/0x9c2f...",
      "incomingAssets": [
        {
          "id": "led_31c9",
          "assetId": "a3f1c8e0-9d42-4b17-8c55-6e0b2f7a1d34",
          "assetRaw": { "symbol": "ETH" },
          "quantity": "1.000000000000000000",
          "baseCurrency": "USD",
          "price": { "price": 3200, "baseCurrency": "USD", "timestamp": 1721088000000, "source": "cmc" },
          "value": 3200,
          "fromAccount": null,
          "toAccount": { "provider": "binance", "walletId": "int_9f2c" },
          "label": "Buy",
          "asset": { "symbol": "ETH", "name": "Ethereum", "logoUrl": "https://...", "type": "crypto" }
        }
      ],
      "outgoingAssets": [],
      "fee": []
    }
  ],
  "meta": { "limit": 50, "offset": 0, "hasMore": true, "total": 1284 }
}
```

### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Transaction UUID |
| `transactionPlatformId` | string | On-chain hash or exchange-side id |
| `timestamp` | number | Unix milliseconds |
| `type` | string \| null | Canonical type derived from the label; `null` when the label maps to none |
| `label` | string | Transaction label |
| `description`, `notes` | string | Free text |
| `importSource` | object | `type` (`API`/`CSV`/`Manual`), `importedAt`, `walletId`, `csvLink`, `syncId`, `functionName` |
| `isManual`, `isEdited`, `isDefiTrx`, `isNFTTrx` | boolean | Provenance and classification flags |
| `isMissingTransaction` | boolean | Set by the balance stage — the running balance went negative here |
| `protocol` | object | DeFi protocol context, when applicable |
| `tags` | array | User tags |
| `comments` | array | `{ id, text, timestamp, author }` |
| `netValue` | object | `{ fiatValue, currency }`; `fiatValue` is `null` when unpriced |
| `totalCostbasis` | number | Cost basis consumed |
| `totalGains` | number | Realized gain or loss |
| `explorerLink` | string \| null | Block-explorer URL; `null` for exchange transactions and unknown chains |
| `explorerLinkSrc` | string \| null | Which side of a transfer `explorerLink` was built from: `sender` or `receiver` |
| `isMergedTrx` | boolean | Produced by merging several source transactions |
| `trxsMerged` | array \| null | The source transactions a merge consumed |
| `isSplitted` | boolean | Produced by splitting a merged transaction back into legs |
| `incomingAssets`, `outgoingAssets`, `fee` | array | Ledger legs, see below |
| `coaJournal`, `coaStatus` | object | Chart-of-accounts state — **enterprise workspaces only**, absent otherwise |

### Ledger legs

Each entry in `incomingAssets`, `outgoingAssets` and `fee`:

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Ledger id |
| `assetId` | string \| null | Resolved Kryptos asset; `null` while unresolved |
| `assetRaw` | object | As reported by the source, before resolution |
| `quantity` | **string** | Decimal string, up to 18 places |
| `baseCurrency` | string | Fiat currency for `price` and `value` |
| `price` | object \| null | `{ price, baseCurrency, timestamp, source }`; `null` when unpriced |
| `value` | number \| null | `quantity × price`, derived on read; `null` when unpriced |
| `fromAccount`, `toAccount` | object \| null | Counterparty accounts |
| `label`, `description`, `internalLabel` | string | Per-leg annotations |
| `asset` | object \| null | Resolved display data: `symbol`, `name`, `logoUrl`, `type` |

`quantity` is a **string**, not a number, deliberately — crypto quantities carry up to 18 decimal
places and JSON numbers are IEEE-754 doubles. Parsing it into a float silently loses precision on
large or high-precision balances. Use a decimal library. `value` is a number because it is a rounded
fiat amount.

Which account field a leg populates follows the direction: incoming legs carry `toAccount`, outgoing
and fee legs carry `fromAccount`, and a transfer between two of the user's own accounts carries both.

## Counts

```bash
curl -X GET "https://api-v2.kryptos.io/v1/transactions/counts" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

Returns `{ data }` with per-label and per-type counts for the workspace — cheaper than paging the list
to build a summary.

## One transaction

`GET /v1/transactions/{id}` returns `{ data }` with a single transaction in the shape above, or
`404 { "error": { "code": "NOT_FOUND", "message": "…" } }`.

For enterprise workspaces the single-transaction fetch also includes `coaJournal.lines`, which the
list response omits.

## Its ledger legs

`GET /v1/transactions/{id}/ledgers` returns `{ data }` — an array of the transaction's legs. It is the
same data as the three leg arrays above, flattened, which is convenient when you want the legs without
re-parsing the transaction. To query legs across many transactions, use
[`GET /v1/ledgers`](/docs/api/ledgers).

## Errors

| Status | Code | Meaning |
| --- | --- | --- |
| 404 | `NOT_FOUND` | No such transaction in this workspace |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

```json
{ "error": { "code": "NOT_FOUND", "message": "Transaction not found" } }
```
