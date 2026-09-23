---
id: userinfo
title: User Profile
sidebar_position: 2
---

# User Profile

The authenticated user's profile — who the token belongs to — and the workspace their data lives in.

**Base URL:** `https://api-v2.kryptos.io`

| | Endpoint | Returns | Required Permission |
| --- | --- | --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/users/me` | The profile behind the token | `users:read` |
| <span className="badge badge--get">GET</span> | `/v1/workspaces` | Every workspace you are a member of | — |
| <span className="badge badge--get">GET</span> | `/v1/workspaces/{wid}` | One workspace, with its ingestion limits | `workspace:read` |

Unlike most of the API, `/v1/users/me` also accepts an [API key](/docs/authentication/api-key) — pass
`x-api-key` instead of a bearer token.

## Request

```bash
curl -X GET "https://api-v2.kryptos.io/v1/users/me" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Response

```json
{
  "success": true,
  "data": {
    "uid": "user_9f2c8a",
    "email": "alex@example.com",
    "firstName": "Alex",
    "lastName": "Rivera",
    "active": true,
    "clientType": ["retail"],
    "preferredLanguage": "en",
    "createdAt": "2026-01-04T11:02:00.000Z",
    "updatedAt": "2026-08-01T09:30:00.000Z"
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `uid` | string | Stable user identifier — matches the `sub` claim in an OIDC token |
| `email` | string | Email address; unique across Kryptos |
| `firstName`, `lastName` | string \| null | Name, when provided |
| `active` | boolean | Account is active |
| `clientType` | array | One or more of `retail`, `enterprise`, `accountant`, `developer` |
| `preferredLanguage` | string | Language code, default `en` |
| `createdAt`, `updatedAt` | string | ISO 8601 |

`clientType` is an **array**, not a single value — a user can be both `retail` and `accountant`. Branch
on membership, not equality.

## 404 is expected for a Guest

```json
{ "success": false, "error": "User not found" }
```

A `404` here means the token authenticated but no profile exists. That is the normal response for a
**Kryptos Connect Guest** — a workspace-scoped identity with no user account behind it. Don't treat it as
an error state; check `is_anonymous` at login instead. See
[Guest and Linked users](/docs/kryptos-connect/overview#guest-and-linked-users).

## Your workspaces

`GET /v1/workspaces`

The profile itself does not list workspaces — all portfolio data is workspace-scoped, and for a
token-bound credential the workspace is resolved from the credential rather than from the profile. See
[Workspaces](/docs/api/overview#workspaces) for how that resolution works. This endpoint enumerates
every workspace the authenticated user is a **member** of.

```bash
curl -X GET "https://api-v2.kryptos.io/v1/workspaces?type=retail&status=active" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Query Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | integer | `1` | Page number |
| `limit` | integer | `10` | Page size. Note the default is **10**, not the 50 most list endpoints use |
| `type` | string | — | `retail`, `enterprise` or `connect-anonymous` |
| `status` | string | — | `active`, `suspended` or `pending` — **your membership** status, not the workspace's |
| `roleId` | string | — | Only workspaces where you hold this role |

### Response

```json
{
  "success": true,
  "data": {
    "workspaces": [
      {
        "wid": "ws_12ab",
        "workspaceName": "My Workspace",
        "type": "retail",
        "countryCode": "AU",
        "costBasisMethod": "FIFO",
        "timezone": "Australia/Sydney",
        "baseCurrencyCode": "AUD",
        "organizationId": null,
        "roleId": "owner",
        "status": "active",
        "joinedAt": "2026-01-04T11:02:00.000Z",
        "createdAt": "2026-01-04T11:02:00.000Z",
        "updatedAt": "2026-08-01T09:30:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 1 }
  }
}
```

Each entry is a workspace **joined with your membership in it**. Alongside the workspace fields
described under [One workspace](#one-workspace), it carries:

| Field | Type | Description |
| --- | --- | --- |
| `roleId` | string | Your role in this workspace — `owner`, `admin` and so on |
| `status` | string | Your membership status: `active`, `pending` (an unaccepted invite) or `suspended` |
| `joinedAt` | string \| null | When you accepted the invite; `null` if never accepted |
| `organizationId` | string \| null | Parent organization, for enterprise workspaces |

:::caution `status` is about you, not the workspace
Both the filter and the returned field describe **your membership**. A `pending` entry is an invite you
have not accepted — the workspace itself is fine. Don't read it as a workspace health signal.
:::

`pagination` here carries only `page`, `limit` and `total` — no `totalPages` or `hasMore`, unlike the
paginated collections elsewhere in the API. Derive the page count from `total` and `limit`.

**`limits` is not included in list entries.** It is computed per workspace and returned only by the
single-workspace read below.

:::info A Guest gets an empty list, not an error
The list is built by joining workspaces to **membership rows**, and a
[Kryptos Connect Guest](/docs/kryptos-connect/overview#guest-and-linked-users) has none — Guest login
creates a workspace and nothing else, with no user record and no membership. So a Guest token
authenticates normally and returns `200` with `workspaces: []`.

That is not a failure, and there is nothing to look up: a Guest belongs to exactly one workspace and its
id is already bound into the token. Use it directly with [One workspace](#one-workspace).
:::

## One workspace

`GET /v1/workspaces/{wid}` · **Required Permission:** `workspace:read`

Reads one workspace you already have the id for — including the ingestion limits the list omits.

```bash
curl -X GET "https://api-v2.kryptos.io/v1/workspaces/ws_12ab" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Response

```json
{
  "success": true,
  "data": {
    "wid": "ws_12ab",
    "workspaceName": "My Workspace",
    "type": "retail",
    "countryCode": "AU",
    "costBasisMethod": "FIFO",
    "timezone": "Australia/Sydney",
    "baseCurrencyCode": "AUD",
    "customAssetPricesEnabled": false,
    "organizationId": null,
    "lastSyncTime": "2026-08-13T09:16:02.000Z",
    "lastAccountingCalculation": "2026-08-13T09:18:40.000Z",
    "createdAt": "2026-01-04T11:02:00.000Z",
    "updatedAt": "2026-08-01T09:30:00.000Z",
    "limits": {
      "transactionLimit": 5000,
      "enableLimiter": true,
      "effectiveTransactionLimit": 5000,
      "currentTransactionCount": 4871,
      "remainingTransactions": 129
    }
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `wid` | string | Workspace identifier |
| `workspaceName` | string | Display name |
| `type` | string | `retail`, `enterprise` or `connect-anonymous` (a Kryptos Connect Guest workspace) |
| `countryCode` | string | Tax jurisdiction |
| `costBasisMethod` | string | e.g. `FIFO` |
| `timezone` | string | IANA timezone |
| `baseCurrencyCode` | string | Currency all values are reported in |
| `customAssetPricesEnabled` | boolean | Manually-set asset prices are in effect for this workspace |
| `organizationId` | string \| null | Parent organization, for enterprise workspaces |
| `lastSyncTime` | string \| null | Every integration last settled at this time; `null` if never |
| `lastAccountingCalculation` | string \| null | Cost-basis calculation last completed; `null` if never |
| `createdAt`, `updatedAt` | string | ISO 8601 |
| `limits` | object | Transaction-ingestion cap — see below |

Compare transaction counts against `limits.effectiveTransactionLimit` rather than the raw override it
resolves. Manually-set asset prices have their own endpoint,
`GET /v1/workspaces/{wid}/custom-asset-prices`.

### Ingestion limits

`limits` is returned on this single-workspace read only.

| Field | Type | Description |
| --- | --- | --- |
| `transactionLimit` | number \| null | The raw per-workspace override. `null` when unset — the workspace inherits the default |
| `enableLimiter` | boolean \| null | The raw override flag. `null` when unset |
| `effectiveTransactionLimit` | number \| null | **The cap actually enforced.** `null` when the workspace is uncapped |
| `currentTransactionCount` | number | Saved rows plus the rows a running sync has in flight |
| `remainingTransactions` | number \| null | Headroom before ingestion stops. `null` when uncapped |

Compare counts against `effectiveTransactionLimit`, not `transactionLimit` — an unset override still
inherits a cap, so a `null` `transactionLimit` does **not** mean unlimited.

Once `remainingTransactions` reaches `0`, syncs stop mid-run and report
[`limitReached`](/docs/api/integrations#sync-status-values). For Connect partners, raising a Guest
user's cap is
[`PATCH /developer/grants/{grantId}/transaction-limit`](/docs/kryptos-connect/backend#update-transaction-limit).
