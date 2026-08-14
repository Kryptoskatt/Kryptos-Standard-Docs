---
id: labels
title: Labels
sidebar_position: 9
---

# Labels

The canonical transaction labels, each with its transaction type and tax treatment. Fetch this rather
than hard-coding a label list — the set grows over time.

**Base URL:** `https://api-v2.kryptos.io`

| | Endpoint |
| --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/labels` |

Shared reference data, not workspace-specific — it needs a valid token, but no workspace parameter.

## Request

```bash
curl -X GET "https://api-v2.kryptos.io/v1/labels" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `type` | string | Return only labels valid for this transaction type: `deposit`, `withdrawal`, `trade`, `transfer` or `payment` |

Filtering by `type` also **prepends the common labels** — `Ignore`, `Failed`, `Unknown` and `Spam` —
because those apply to every type. The filtered lists therefore overlap, and concatenating all five will
duplicate them.

## Response

```json
{
  "success": true,
  "data": [
    { "label": "Buy", "type": "trade", "taxEvent": "CAPITAL_GAIN", "description": "Purchase of an asset" },
    { "label": "Airdrop", "type": "deposit", "taxEvent": "INCOME", "description": "Tokens received from an airdrop" },
    { "label": "Ignore", "type": null, "taxEvent": null, "description": "Exclude from all calculations" }
  ]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `label` | string | The value that appears as a transaction's `label` |
| `type` | string \| null | Canonical transaction type. **`null` for the common labels** that apply to every type |
| `taxEvent` | string \| null | `CAPITAL_GAIN`, `INCOME`, `LOST`, `VAULT`, or `null` when the label triggers no tax event |
| `description` | string \| null | Human-readable explanation |

## How labels work

A transaction's `type` is **derived from its label**, not stored independently — so the label is what
classifies the transaction. `Buy` makes it a trade; `Airdrop` makes it an income deposit. That is why
[`GET /v1/transactions`](/docs/api/transactions) lets you filter on either: `?labels=Buy` is specific,
`?types=trade` is the whole category.

Two labels change whether a transaction is counted at all:

- **`Ignore`** excludes it from every calculation — balances, gains, reports.
- **`Spam`** marks it as unwanted.

Both are **filtered out by default** from `GET /v1/transactions`; pass `includeIgnored=true` or
`includeSpam=true` to see them. See [Spam](/docs/api/spam).
