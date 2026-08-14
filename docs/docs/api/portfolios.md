---
id: portfolios
title: Portfolios
sidebar_position: 13
---

# Portfolios

A portfolio groups connected accounts inside a workspace. Every integration belongs to exactly one, and
most portfolio-data endpoints can be scoped to one.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `portfolios:read`

| | Endpoint | Returns |
| --- | --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/portfolios` | List them |
| <span className="badge badge--get">GET</span> | `/v1/portfolios/default` | The workspace's default portfolio |
| <span className="badge badge--get">GET</span> | `/v1/portfolios/{id}` | One portfolio |

## List

```bash
curl -X GET "https://api-v2.kryptos.io/v1/portfolios?workspaceId=WORKSPACE_ID" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `workspaceId` | string | — | Required unless your token is workspace-bound |
| `page` | integer | `1` | Page number |
| `limit` | integer | `50` | 1–100 |

```json
{
  "success": true,
  "data": {
    "portfolios": [
      {
        "id": "pf_main",
        "workspaceId": "ws_12ab",
        "name": "Main",
        "description": null,
        "isDefault": true,
        "metadata": null,
        "integrationsCount": 7,
        "integrationLogos": ["https://...", "https://..."],
        "createdAt": "2026-01-04T11:02:00.000Z",
        "updatedAt": "2026-01-04T11:02:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 50, "total": 2, "totalPages": 1, "hasMore": false }
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Portfolio id — pass as `portfolioId` elsewhere |
| `name` | string | Display name |
| `description` | string \| null | Free text |
| `isDefault` | boolean | The workspace's default portfolio |
| `metadata` | object \| null | Arbitrary client-supplied data |
| `integrationsCount` | number | Accounts in this portfolio — **list responses only** |
| `integrationLogos` | array | Up to 5 provider logos, for list rendering — **list responses only** |
| `createdAt`, `updatedAt` | string | ISO 8601 |

`integrationsCount` and `integrationLogos` are computed for the list view and absent from
single-portfolio responses.

## Default portfolio

```bash
curl -X GET "https://api-v2.kryptos.io/v1/portfolios/default?workspaceId=WORKSPACE_ID" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

```json
{ "success": true, "data": { "portfolio": { "id": "pf_main", "name": "Main", "isDefault": true } } }
```

Returns the workspace's default portfolio. Use it when you need a portfolio id but don't know the
workspace's layout — every active workspace has a default.

Note the response nests the object under `data.portfolio`, unlike `/v1/portfolios/{id}` which returns it
as `data` directly.

## One portfolio

`GET /v1/portfolios/{id}` returns `{ success, data }`.

`workspaceId` is a required **query** parameter on both `/default` and `/{id}` unless your token is
workspace-bound; omitting it returns `400`.

## Scoping data to a portfolio

Most portfolio-data endpoints take a `/portfolio/{portfolioId}` path segment:

- `/v1/holdings/portfolio/{portfolioId}`
- `/v1/calculated-balances/portfolio/{portfolioId}`
- `/v1/defi/portfolio/{portfolioId}` (and its `/totals`, `/staking`, `/lending`, `/farming` variants)
- `/v1/nfts/portfolio/{portfolioId}`
