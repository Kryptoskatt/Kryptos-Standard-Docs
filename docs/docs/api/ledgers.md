---
id: ledgers
title: Ledgers
sidebar_position: 8
---

# Ledgers

A ledger is one leg of a transaction — a single asset moving in, out, or paid as a fee. This endpoint
queries them directly, across transactions, which is what you want for balance reconciliation and
accounting exports.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `transactions:read`

| | Endpoint | Returns |
| --- | --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/ledgers` | Filtered, paginated list |
| <span className="badge badge--get">GET</span> | `/v1/ledgers/{id}` | One ledger entry |

To read the legs of one known transaction,
[`GET /v1/transactions/{id}/ledgers`](/docs/api/transactions#its-ledger-legs) is cheaper.

Like [transactions](/docs/api/transactions), this domain returns `{ data, meta }` with **no `success`
field**, and nests errors as `{ error: { code, message } }`.

## Request

```bash
curl -X GET "https://api-v2.kryptos.io/v1/ledgers?types=outgoing&limit=100" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Query Parameters

Comma-separated lists:

| Parameter | Description |
| --- | --- |
| `transactionIds` | Restrict to specific transactions |
| `assetIds` | Kryptos asset ids |
| `types` | `incoming`, `outgoing`, `fee` |
| `providers` | Provider ids, e.g. `binance` |

Filters and paging:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `hasMissingPrice` | boolean | — | Legs with no resolved price |
| `hasMissingAsset` | boolean | — | Legs whose asset is unresolved |
| `startTime`, `endTime` | number | — | Unix milliseconds |
| `ltAfterBalance` | string | — | Running balance strictly **less than** this |
| `gtAfterBalance` | string | — | Running balance strictly **greater than** this |
| `sortBy` | string | `timestamp` | `timestamp` or `createdAt` |
| `sortOrder` | string | `desc` | `asc` or `desc` |
| `limit` | integer | `50` | 1–200 |
| `offset` | integer | `0` | Rows to skip |

`ltAfterBalance` and `gtAfterBalance` are **decimal strings, not numbers** — `"0"`, `"-0.000001"`,
`"1e3"`. They are deliberately not coerced to floats so that 18-decimal balances compare exactly. Rows
with no running balance are excluded from either filter.

`ltAfterBalance=0` is the canonical way to find negative running balances — the signature of missing
purchase history.

## Response

```json
{
  "data": [
    {
      "id": "led_31c9",
      "transactionId": "8f14e45f-ceea-467a-9a3b-1c2f0d7e5a91",
      "workspaceId": "ws_12ab",
      "type": "outgoing",
      "assetId": "a3f1c8e0-9d42-4b17-8c55-6e0b2f7a1d34",
      "assetRaw": { "symbol": "USDC" },
      "quantity": "3200.000000",
      "baseCurrency": "USD",
      "price": { "price": 1, "baseCurrency": "USD", "timestamp": 1721088000000, "source": "cmc" },
      "value": 3200,
      "timestamp": 1721088000000,
      "walletId": "int_9f2c",
      "syncId": "sync_7712",
      "fromAccount": { "provider": "binance", "walletId": "int_9f2c" },
      "toAccount": null,
      "label": "Sell",
      "description": null,
      "internalLabel": null,
      "isEdited": false,
      "beforeBalance": "5000.000000",
      "afterBalance": "1800.000000",
      "costbasis": "3200.00",
      "proceeds": "3200.00",
      "profit": "0.00",
      "asset": { "symbol": "USDC", "name": "USD Coin", "logoUrl": "https://...", "type": "stablecoin" }
    }
  ],
  "meta": { "total": 4821, "limit": 50, "offset": 0 }
}
```

`meta` here has **no `hasMore`** — unlike `/v1/transactions`. Page by comparing
`offset + data.length` against `meta.total`.

## Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Ledger id |
| `transactionId` | string | Parent transaction |
| `type` | string | `incoming`, `outgoing` or `fee` |
| `assetId` | string \| null | Resolved asset; `null` while unresolved |
| `assetRaw` | object | Asset as reported by the source |
| `quantity` | **string** | Decimal string, up to 18 places |
| `baseCurrency` | string | Currency of `price` and `value` |
| `price` | object \| null | `{ price, baseCurrency, timestamp, source }` |
| `value` | number \| null | `quantity × price`, derived on read |
| `timestamp` | number | Unix milliseconds |
| `walletId` | string | Owning connected account — the authoritative source for this leg |
| `syncId` | string \| null | Sync run that produced it |
| `fromAccount`, `toAccount` | object \| null | Counterparty accounts |
| `label`, `description`, `internalLabel` | string | Annotations |
| `isEdited` | boolean | A user manually edited this leg |
| `beforeBalance`, `afterBalance` | **string** \| null | Running asset balance around this leg |
| `costbasis`, `proceeds`, `profit` | **string** \| null | Accounting figures; `null` until tax processing has run |
| `debitCoaCode`, `creditCoaCode` | string \| null | GL codes posted to — **enterprise only** |
| `isDebitCoaEdited`, `isCreditCoaEdited` | boolean | The code was set manually, so a COA re-run skips it — enterprise only |

Every numeric column here is serialized as a **decimal string**, not a JSON number: `quantity`,
`beforeBalance`, `afterBalance`, `costbasis`, `proceeds` and `profit`. That is deliberate — see the
[precision note on transactions](/docs/api/transactions#ledger-legs). Only `value` is a number,
because it is an already-rounded fiat amount. The accounting fields are `null` until the accounting
pipeline has run for that period.

## One ledger entry

`GET /v1/ledgers/{id}` returns `{ data }` with a single entry, or
`404 { "error": { "code": "NOT_FOUND", "message": "…" } }`.

## Errors

| Status | Code | Meaning |
| --- | --- | --- |
| 404 | `NOT_FOUND` | No such ledger in this workspace |
| 500 | `INTERNAL_ERROR` | Unexpected server error |
