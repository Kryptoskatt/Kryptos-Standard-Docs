---
id: userinfo
title: User Info
sidebar_position: 2
---

# User Info

<span className="badge badge--get">GET</span> `/v1/userinfo`

Get authenticated user's profile information.

**Required Permission:** `read:profile`

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
    "preferred_username": "john@example.com"
  },
  "scopes": ["openid", "profile", "email"]
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `userInfo.sub` | string | User ID |
| `userInfo.name` | string | User's full name |
| `userInfo.email` | string | Email address |
| `userInfo.email_verified` | boolean | Email verification status |
| `userInfo.preferred_username` | string | Preferred username |
| `scopes` | array | Granted OAuth scopes |

