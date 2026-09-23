---
id: counterparties
title: Counterparties
sidebar_position: 16
---

# Counterparties

Addresses your workspace has transacted with, automatically classified where Kryptos recognises them —
as an exchange or a DeFi protocol.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `contacts:read`

| | Endpoint |
| --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/counter-parties` |

Note the **hyphen**: the path is `/v1/counter-parties`, not `/v1/counterparties`.

:::caution `contacts:read` is not in the default client scope set
Your client has to be **registered** with it — see [Contacts](/docs/api/contacts). Without it this
endpoint returns `403 insufficient_scope`.
:::

## Request

```bash
curl -X GET "https://api-v2.kryptos.io/v1/counter-parties?resolved=false&ignored=false" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Query Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `resolved` | string | — | `true` or `false` — whether Kryptos identified the address |
| `ignored` | string | — | `true` or `false` — whether it has been dismissed |
| `type` | string | — | `exchange` or `protocol` |
| `search` | string | — | Match on address and name |
| `page` | integer | `1` | Page number |
| `limit` | integer | `50` | Max 200 |

`resolved` and `ignored` are **string enums, not booleans** — send `?resolved=false`, not `?resolved=0`.

`?resolved=false&ignored=false` is the useful default for a review queue: unidentified addresses nobody
has dismissed yet.

## Response

The collection sits beside `success`, the pagination under `meta`:

```json
{
  "success": true,
  "data": [
    {
      "id": "cp_31c9",
      "address": "0x28C6c06298d514Db089934071355E5743bf21d60",
      "addressNormalized": "0x28c6c06298d514db089934071355e5743bf21d60",
      "chainName": "ethereum",
      "chainPublicName": "Ethereum",
      "chainLogo": "https://...",
      "name": "Binance 14",
      "logo": "https://...",
      "isExchangeAddress": true,
      "platformExchangeId": "binance",
      "isSmartContract": false,
      "platformSmartContractId": null,
      "identified": true,
      "ignored": false,
      "isLinkedToContact": false,
      "contactId": null,
      "transactionCount": 42,
      "firstSeenAt": "2026-01-04T11:02:00.000Z",
      "lastSeenAt": "2026-08-13T09:14:22.000Z",
      "createdAt": "2026-01-04T11:02:00.000Z",
      "updatedAt": "2026-08-13T09:14:22.000Z"
    }
  ],
  "meta": { "total": 216, "page": 1, "limit": 50 }
}
```

`meta` carries only `total`, `page` and `limit` — no `totalPages` or `hasMore`.

### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Counterparty id |
| `address` | string | The address as seen on-chain |
| `addressNormalized` | string | Lowercased form — use it to compare addresses |
| `chainName`, `chainPublicName`, `chainLogo` | string | Chain the address lives on |
| `name` | string \| null | Display name, when identified or linked to a contact |
| `logo` | string \| null | Logo of the matched exchange or protocol |
| `isExchangeAddress` | boolean | Matched to a centralized venue |
| `platformExchangeId` | string \| null | Which venue, e.g. `binance` |
| `isSmartContract` | boolean | Matched to a DeFi contract |
| `platformSmartContractId` | string \| null | Which protocol |
| `identified` | boolean | Kryptos recognised the address |
| `ignored` | boolean | Dismissed from the review queue |
| `isLinkedToContact` | boolean | A contact supplies the name |
| `contactId` | string \| null | That contact |
| `transactionCount` | number | Transactions involving this address |
| `firstSeenAt`, `lastSeenAt` | string | ISO 8601 |
| `createdAt`, `updatedAt` | string | ISO 8601 |

A **resolved** counterparty is one Kryptos matched to a known exchange or protocol, so it carries a name
you can display. An **unresolved** one is just an address. `type` distinguishes the two kinds of match:
`exchange` for a centralized venue, `protocol` for a DeFi contract.

Naming an unresolved address is done by attaching it to a [contact](/docs/api/contacts), where a manual
name takes precedence over any automatic one.
