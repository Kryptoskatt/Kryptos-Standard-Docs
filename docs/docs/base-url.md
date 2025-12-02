---
id: base-url
title: Base URL
sidebar_position: 2
---

# Base URL

All API requests should be made to:

```
https://connect.kryptos.io/api
```

## Environment

| Environment    | Base URL                           |
| -------------- | ---------------------------------- |
| **Production** | `https://connect.kryptos.io/api`   |

## Request Format

All requests should include:

- **Content-Type:** `application/json`
- **Authorization:** Bearer token or API key (see [Authentication](/authentication/oauth))

## Example Request

```bash
curl -X GET "https://connect.kryptos.io/api/v1/holdings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

