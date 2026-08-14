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

:::caution `contacts:read` is not granted by default
Request it explicitly at authorization time, or this endpoint returns `403 insufficient_scope`. See
[Scopes](/docs/authentication/oauth#available-scopes).
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

The response spreads the result beside `success` — `{ success: true, data: [...], ...pagination }`.

A **resolved** counterparty is one Kryptos matched to a known exchange or protocol, so it carries a name
you can display. An **unresolved** one is just an address. `type` distinguishes the two kinds of match:
`exchange` for a centralized venue, `protocol` for a DeFi contract.

Naming an unresolved address is done by attaching it to a [contact](/docs/api/contacts), where a manual
name takes precedence over any automatic one.
