---
id: userinfo
title: User Info
sidebar_position: 2
---

# User Info

<span className="badge badge--get">GET</span> `/v1/userinfo`

**Base URL:** `https://connect.kryptos.io/api`

Get authenticated user's profile information.

**Required Permission:** `users:read`

## Request

```bash
curl -X GET "https://connect.kryptos.io/api/v1/userinfo" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Response

```json
{
  "message": "User information retrieved successfully",
  "userInfo": {
    "sub": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified": true,
    "preferred_username": "john@example.com",
    "language": "en",
    "transaction_limit": 15000
  },
  "scopes": ["openid", "profile", "email"]
}
```

## Response Fields

| Field                         | Type    | Scope     | Description                                                              |
| ----------------------------- | ------- | --------- | ------------------------------------------------------------------------ |
| `userInfo.sub`                | string  | `openid`  | User ID                                                                  |
| `userInfo.name`               | string  | `profile` | User's full name                                                         |
| `userInfo.email`              | string  | `email`   | Email address                                                            |
| `userInfo.email_verified`     | boolean | `email`   | Email verification status                                                |
| `userInfo.preferred_username` | string  | `profile` | Preferred username                                                       |
| `userInfo.language`           | string       | `profile` | User's preferred language (e.g. `"en"`). Defaults to `"en"` if not set.                                                                       |
| `userInfo.transaction_limit`  | number\|null | `profile` | Effective transaction import cap for this user. `null` means no limit. Resolution order: per-user override → workspace default → platform default (100,000). |
| `scopes`                      | array        |           | Granted OAuth scopes.                                                                                                                          |
