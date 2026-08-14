---
id: contacts
title: Contacts
sidebar_position: 15
---

# Contacts

Named people and companies, with the on-chain addresses attached to them. Naming an address makes it
appear as that name wherever it shows up in transactions.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `contacts:read`

| | Endpoint | Returns |
| --- | --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/contacts` | List, paginated |
| <span className="badge badge--get">GET</span> | `/v1/contacts/{id}` | One contact |

:::caution `contacts:read` is not granted by default
It is **not** in the default client scope set, so you must request it explicitly at authorization time.
Without it these endpoints return `403 insufficient_scope`. See
[Scopes](/docs/authentication/oauth#available-scopes).
:::

## List

```bash
curl -X GET "https://api-v2.kryptos.io/v1/contacts?search=acme&page=1&limit=20" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `search` | string | — | Match on name |
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Max 100. Note the default differs from other list endpoints |

The response spreads the result beside `success` — `{ success: true, data: [...], ...pagination }` —
rather than nesting it under `data`.

## Contact fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Contact id |
| `name` | string | Display name; unique per workspace, case-insensitively |
| `type` | string | `individual` or `company` |
| `socials` | object | `email`, `telegram` |
| `residentialAddress` | object | `country`, `state`, `city`, `postcode`, `address1`, `address2` |
| `mobileNumber` | string | Phone number |
| `vat` | string | VAT or tax number |
| `terms` | object | `payment` (e.g. `net30`), `overduesInterest` (number) |

## One contact

`GET /v1/contacts/{id}` returns `{ success, data }` with a single contact, or
`404 { "success": false, "error": "Contact not found" }`.

## Contacts and counterparties

An on-chain address can be named two ways, and they interact:

1. **Automatically**, when Kryptos recognises it as a known exchange or protocol — a *resolved*
   [counterparty](/docs/api/counterparties).
2. **Manually**, by attaching it to a contact. A manual name takes precedence.

Attaching an address renames it across existing transactions, so a contact's name is what you will see
on the `fromAccount` and `toAccount` of any [ledger leg](/docs/api/ledgers) that touches it. Detaching
restores the automatically-detected name if one was known.
