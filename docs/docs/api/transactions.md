---
id: transactions
title: Transactions
sidebar_position: 7
---

# Transactions

**Available to:** Workspace token ([White-label](/docs/integrations-api/overview)) · OAuth · Connect (read) · API key. See [Access by credential](/docs/api/access-matrix).

The transaction record, with filtering across labels, types, accounts, assets, addresses and time.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `transactions:read`

| | Endpoint | Returns |
| --- | --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/transactions` | Filtered, paginated list |
| <span className="badge badge--get">GET</span> | `/v1/transactions/{id}` | One transaction |
| <span className="badge badge--get">GET</span> | `/v1/transactions/{id}/ledgers` | Its ledger legs |

Writes (`POST /v1/transactions`, `POST /v1/transactions/batch`, `PATCH`/`DELETE` one or in bulk) are in
the [API Reference](/docs/api-reference/kryptos-api). See
[Creating transactions](#creating-transactions) for what to know before writing.

Transactions and [ledgers](/docs/api/ledgers) use a different response envelope from the rest of the
API — **`{ data, meta }` with no `success` field**, and handler errors nested as
`{ error: { code, message } }`. See [API Overview](/docs/api/overview#response-shapes) and
[Errors](#errors).

:::info Tax fields for API callers
`totalCostbasis` and `totalGains` (and each leg's `costbasis`, `proceeds`, `profit`) are **`null` for
API callers** — OAuth, Connect, API keys and white-label workspace tokens — except a white-label
workspace token whose workspace has [Accounting](/docs/integrations-api/white-label) switched on. The
same callers can't sort or filter by gains: `sortBy=totalGains` and `minTotalGains` return
`403 GAINS_FILTER_NOT_AVAILABLE` (except `minTotalGains` at the high-P&L threshold reported by the
reconciliation summary).
:::

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
| `syncIds` | Sync runs that produced the legs (`syncId` from a sync), e.g. to read what one sync imported |
| `assetIds` | Kryptos asset ids |
| `providers` | Provider ids, e.g. `binance` |
| `importSourceTypes` | `API`, `CSV`, `Manual` |
| `ledgerTypes` | `incoming`, `outgoing`, `fee` |
| `tags` | User tags |
| `fromAddresses`, `toAddresses`, `addresses` | On-chain addresses |

Every one of those has an exclusion twin — `notLabels`, `notTypes`, `notWalletIds`, `notAssetIds`,
`notProviders`, `notImportSourceTypes`, `notLedgerTypes`, `notTags`, `notFromAddresses`,
`notToAddresses`, `notSyncIds` — so you can filter a category out rather than in.

Exact lookups: `trxId` (the transaction's own `id`) and `trxHash` (the on-chain hash or exchange
order id, `transactionPlatformId`).

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
| `isMissingTransaction` | — | Running balance went negative here — missing acquisition history ¹ |
| `hasComments` | — | `true`: has at least one comment; `false`: none |
| `isHighPnLReviewed` | — | Already reviewed for unusually high P&L |
| `isUncategorisedIgnored` | — | Dismissed from the uncategorised queue |
| `isMissingPriceIgnored` | — | Dismissed from the missing-price queue |

Spam- and Ignore-labelled transactions are **excluded by default**. Totals computed from an
unfiltered list will not match a UI that shows them.

¹ Set by the balance calculation. Not computed for white-label workspaces unless Balances is switched on.

Ranges, sorting and paging:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `startTime`, `endTime` | number | — | Unix **milliseconds** |
| `minValue`, `maxValue` | number | — | Transaction fiat value bounds |
| `minTotalGains` | number | — | Minimum realized gain — use to find high-P&L transactions (restricted for API callers, see above) |
| `search` | string | — | Free text |
| `coaTagStatus` | string | — | `tagged`, `partial`, `untagged` (enterprise) |
| `coaSyncStatus` | string | — | `synced`, `unsynced` (enterprise) |
| `sortBy` | string | `timestamp` | `timestamp`, `netValue`, `totalGains` (restricted for API callers), `createdAt` |
| `sortOrder` | string | `desc` | `asc` or `desc` |
| `limit` | integer | `50` | 1–200; larger values return 400 |
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
| `isMissingTransaction` | boolean | Set by the balance stage — the running balance went negative here. Not computed for white-label workspaces unless Balances is switched on |
| `protocol` | object | DeFi protocol context, when applicable |
| `tags` | array | User tags |
| `comments` | array | `{ id, text, timestamp, author }` |
| `netValue` | object | `{ fiatValue, currency }`; `fiatValue` is `null` when unpriced |
| `totalCostbasis` | number \| null | Cost basis consumed; `null` for API callers (see above) and until accounting has run |
| `totalGains` | number \| null | Realized gain or loss; same rule |
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

## Creating transactions

- `POST /v1/transactions` returns `201 { data: { savedCount } }` — no ids. Read the new row back with
  the list filters (for example `isManual=true` and a time range).
- **Manual transactions are not de-duplicated**, so retrying a create that timed out creates a second
  copy. Check before retrying.
- `POST /v1/transactions/batch` returns `201 { data: { savedCount, errorCount } }` even when some rows
  failed: check `errorCount`.

## Errors

| Status | Shape | Meaning |
| --- | --- | --- |
| 400 | `{ success: false, error: "Validation failed", details }` | A query or body parameter is invalid |
| 400 | `{ error: { code: "INVALID_LEG", message } }` | A leg on a create or edit could not be resolved |
| 403 | `{ error: { code: "GAINS_FILTER_NOT_AVAILABLE", message } }` | A gains sort or filter you may not use (see above) |
| 403 | `{ error: "insufficient_scope" }` · `{ error: "forbidden", code: "MACHINE_ROUTE_NOT_ALLOWED" }` | Your credential can't call this; see [Errors](/docs/reference/errors) |
| 404 | `{ error: { code: "NOT_FOUND", message } }` | No such transaction in this workspace |
| 500 | `{ error: { code: "INTERNAL_ERROR", message } }` | Unexpected server error |
