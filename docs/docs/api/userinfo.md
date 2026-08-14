---
id: userinfo
title: User Profile
sidebar_position: 2
---

# User Profile

The authenticated user's profile — who the token belongs to.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `users:read`

| | Endpoint |
| --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/users/me` |

Unlike most of the API, this endpoint also accepts an [API key](/docs/authentication/api-key) — pass
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

## Workspaces

A profile does not list the user's workspaces. Portfolio data is workspace-scoped — see
[Workspaces](/docs/api/overview#workspaces) for how the workspace is resolved from your credential.
