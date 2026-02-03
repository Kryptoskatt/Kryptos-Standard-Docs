---
id: health
title: Health Check
sidebar_position: 1
---

# Health Check

<span className="badge badge--get">GET</span> `/health`

**Base URL:** `https://connect.kryptos.io/api`

Check the health status of the API service. **No authentication required.**

## Request

```bash
curl -X GET "https://connect.kryptos.io/api/health"
```

## Response

```json
{
  "status": "OK",
  "service": "connect-apis",
  "version": "1.0.0",
  "environment": "production"
}
```

## Response Fields

| Field         | Type   | Description                               |
| ------------- | ------ | ----------------------------------------- |
| `status`      | string | Service status (`OK`)                     |
| `service`     | string | Service name                              |
| `version`     | string | API version                               |
| `environment` | string | Environment (`production`, `development`) |
