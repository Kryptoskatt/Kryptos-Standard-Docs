---
id: errors
title: Error Codes
sidebar_position: 1
---

# Error Codes

All API errors follow a consistent format.

## Error Response Format

```json
{
  "error": "error_code",
  "message": "Human readable message",
  "details": []
}
```

## HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created |
| `400` | Bad Request | Invalid parameters |
| `401` | Unauthorized | Invalid or missing authentication |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |

## Error Examples

### 400 Bad Request

```json
{
  "error": "invalid_parameters",
  "message": "Invalid query parameters",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "string",
      "path": ["limit"],
      "message": "Expected number, received string"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "error": "unauthorized",
  "message": "Invalid or missing authentication token"
}
```

**Solutions:**
- Check that you're including the authentication header
- Verify your API key or access token is correct
- Ensure your credentials haven't expired

### 403 Forbidden

```json
{
  "error": "forbidden",
  "message": "Insufficient scopes. Required scopes not met"
}
```

**Solutions:**
- Check your API key's permissions
- Request additional OAuth scopes
- Create a new API key with appropriate permissions

### 429 Too Many Requests

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests"
}
```

**Solutions:**
- Implement exponential backoff
- Reduce request frequency
- Contact support for rate limit increase




