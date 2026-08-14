---
id: overview
title: API Overview
sidebar_position: 1
---

# API Overview

Everything on the Kryptos API shares one base URL, one authentication model and one workspace model.
Response and pagination shapes vary by domain — those variations are documented here once, so the
endpoint pages can stay focused on parameters and fields.

**Base URL:** `https://api-v2.kryptos.io`

Every endpoint lives under `/v1`, and the path you call is the path the resource lives at — there is no
service name in the URL:

```
https://api-v2.kryptos.io/v1/holdings
https://api-v2.kryptos.io/v1/transactions
https://api-v2.kryptos.io/v1/integrations
```

## Authentication

Send an OAuth 2.0 access token as a bearer token:

```bash
curl -X GET "https://api-v2.kryptos.io/v1/holdings" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

That single header is all you need. Earlier versions of this API also required `X-Client-Id` and
`X-Client-Secret` on every data call; **they are no longer part of the data-call contract.** Access
tokens are validated against the grant that issued them, so nothing else is required.

Client credentials remain the credential where they belong: the Kryptos Connect
[link-token and token-exchange endpoints](/docs/kryptos-connect/backend), which authenticate your
application rather than a user. Keep those server-side.

Get an access token by either route:

| Route | Use when | Guide |
| --- | --- | --- |
| Authorization Code + PKCE | Your users sign in with their own Kryptos accounts | [OAuth 2.0](/docs/authentication/oauth) |
| Kryptos Connect | You embed the widget and your users link accounts through it | [Connect overview](/docs/kryptos-connect/overview) |

### API keys

Enterprise customers can call the API with a long-lived key instead of an access token:

```bash
curl -X GET "https://api-v2.kryptos.io/v1/holdings?wid=WORKSPACE_ID" \
  -H "x-api-key: kryptos_live_xxxx"
```

API keys carry the same scopes as access tokens and are **not** bound to a workspace, so they must
name one on every request (see below). See [API Key Authentication](/docs/authentication/api-key).

## Workspaces

All portfolio data belongs to a workspace, not directly to a user. How the API resolves which
workspace you mean depends on your credential:

- **Access tokens issued through Kryptos Connect or OAuth are bound to one workspace.** Omit the
  workspace parameter — it is already in the token. Passing a *different* workspace id is rejected
  with `403 forbidden`.
- **API keys are not bound to a workspace.** Pass `?wid=WORKSPACE_ID`; the endpoint page names the
  parameter where it differs. Omitting it returns `400 bad_request`; naming a workspace you are not a
  member of returns `403 forbidden`.

## Scopes

Each endpoint requires one scope, listed on its page as **Required Permission**. The full vocabulary:

| Scope | Covers |
| --- | --- |
| `portfolios:read` | [Holdings](/docs/api/holdings), [calculated balances](/docs/api/holdings), [DeFi](/docs/api/defi), [NFTs](/docs/api/nfts), [portfolios](/docs/api/portfolios) |
| `transactions:read` | [Transactions](/docs/api/transactions), [ledgers](/docs/api/ledgers), [spam](/docs/api/spam) |
| `integrations:read` | [Integrations](/docs/api/integrations) |
| `contacts:read` | [Contacts](/docs/api/contacts), [counterparties](/docs/api/counterparties) |
| `users:read` | [User profile](/docs/api/userinfo) |
| — | [Providers](/docs/api/providers), [assets](/docs/api/assets), [labels](/docs/api/labels) — shared reference data, not workspace-specific |

OAuth flows additionally use the standard OIDC scopes `openid`, `profile`, `email` and
`offline_access`. The full vocabulary includes write scopes and further resources — see
[Available Scopes](/docs/authentication/oauth#available-scopes) — but the endpoints documented here are
**read-only**, so the five above are all you need to request.

`contacts:read` is **not** in the default client scope set and must be requested explicitly.

A token can never hold more than the granting member's role allows — an `editor` consenting to a scope
their role excludes receives a grant without it. Read the `scope` value returned with the token rather
than assuming you got what you asked for.

## Response shapes

Three shapes are in use. Which one you get depends on the domain, so check the endpoint page before
writing a parser.

**1. Wrapped — `{ success, data }`**

Integrations, providers, portfolios, user profile, assets, labels and spam:

```json
{
  "success": true,
  "data": { "...": "..." }
}
```

Paginated variants nest the collection under a named key beside `pagination`:

```json
{
  "success": true,
  "data": {
    "integrations": [],
    "pagination": { "page": 1, "limit": 50, "total": 120, "totalPages": 3, "hasMore": true }
  }
}
```

**2. Flattened — `{ success, ...result }`**

Holdings, calculated balances and DeFi holdings put their pagination fields at the **top level**, next to
`success`, rather than inside `data`:

```json
{
  "success": true,
  "data": [],
  "totalCount": 42,
  "offset": 0,
  "limit": 50,
  "hasMore": false,
  "totalValue": 250000
}
```

**3. Bare — `{ data, meta }`**

Transactions and ledgers return no `success` field at all, and nest their errors:

```json
{
  "data": [],
  "meta": { "limit": 50, "offset": 0, "hasMore": true, "total": 1284 }
}
```

## Pagination

| Style | Used by | Request | Response |
| --- | --- | --- | --- |
| Page number | Integrations, providers, portfolios, contacts, counterparties | `?page=1&limit=50` (limit 1–100) | `pagination: { page, limit, total, totalPages, hasMore }` |
| Offset, flattened | Holdings, DeFi, calculated balances | `?offset=0&limit=50` (limit 1–1000) | top-level `totalCount`, `offset`, `limit`, `hasMore` |
| Offset, in `meta` | Transactions, ledgers | `?offset=0&limit=50` (limit 1–200) | `meta: { limit, offset, hasMore, total }` |
| Totals only | NFTs, NFT collections | `?offset=0&limit=50` (limit 1–1000) | top-level `totalCount` only — no `offset`/`limit`/`hasMore` echoed |

Three details worth hard-coding into a client:

- Page-number endpoints clamp `limit` to 100 silently rather than erroring.
- `GET /v1/ledgers` returns `meta` **without** `hasMore`.
- The NFT endpoints echo neither `offset`, `limit` nor `hasMore`.

Wherever `hasMore` is absent, compare `offset + data.length` against the total. Note also that
[contacts](/docs/api/contacts) and [counterparties](/docs/api/counterparties) spread their pagination
beside `success` rather than nesting it, and that `limit` defaults differ per endpoint — 50 on most, 20
on contacts and spam.

## Errors

Authentication and authorization failures use the OAuth 2.0 error format, with no `success` field:

```json
{
  "error": "insufficient_scope",
  "error_description": "Missing: portfolios:read"
}
```

| Status | `error` | Meaning |
| --- | --- | --- |
| 401 | `unauthorized` | No credentials, or an invalid/expired token |
| 403 | `insufficient_scope` | Valid token, but it lacks the scope this endpoint needs |
| 403 | `forbidden` | Not a member of the workspace, or the token is bound to a different one |
| 400 | `bad_request` | Workspace id required but not supplied |

Application errors carry a machine-readable `code`. Integrations and portfolios return them wrapped:

```json
{
  "success": false,
  "error": "Integration not found",
  "code": "NOT_FOUND",
  "details": {}
}
```

| Code | Status | Meaning |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400 | Request failed schema validation; `details.issues` lists each field |
| `NOT_FOUND` | 404 | Resource does not exist in this workspace |
| `EXTERNAL_SERVICE_ERROR` | 502 | An upstream exchange, chain or price provider failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

Transactions and ledgers nest the same information instead:

```json
{
  "error": { "code": "NOT_FOUND", "message": "Transaction not found" }
}
```

| Code | Status | Meaning |
| --- | --- | --- |
| `NOT_FOUND` | 404 | Transaction or ledger does not exist in this workspace |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

See [Error Handling](/docs/reference/errors) for worked examples.

## Timestamps

Transaction and ledger timestamps are **Unix milliseconds** on both request and response — they are
the values you filter on with `startTime` and `endTime`. Record metadata such as `createdAt`,
`updatedAt`, `addedOn` and `lastSyncedAt` is ISO 8601.

## Next

- [Holdings](/docs/api/holdings) — balances, cost basis and allocation
- [Transactions](/docs/api/transactions) — the transaction record
- [Integrations](/docs/api/integrations) — connected exchanges and wallets
- [Migrating from the previous API](/docs/api/migrating-from-connect-apis) — if you built against
  `connect.kryptos.io/api`
