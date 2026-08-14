---
id: defi
title: DeFi Positions
sidebar_position: 7
---

# DeFi Positions

Lending, borrowing, staking, farming, derivatives and reward positions across protocols and chains.

**Base URL:** `https://api-v2.kryptos.io` · **Required Permission:** `portfolios:read`

| | Endpoint | Returns |
| --- | --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/defi` | All positions |
| <span className="badge badge--get">GET</span> | `/v1/defi/totals` | Headline DeFi numbers |
| <span className="badge badge--get">GET</span> | `/v1/defi/networks` | Distinct networks, for a filter dropdown |
| <span className="badge badge--get">GET</span> | `/v1/defi/staking` | Positions in the `staking` category |
| <span className="badge badge--get">GET</span> | `/v1/defi/lending` | Positions in the `lending` category |
| <span className="badge badge--get">GET</span> | `/v1/defi/farming` | Positions in the `farming` category |

Each of the six has a portfolio-scoped twin: `/v1/defi/portfolio/{portfolioId}`,
`/v1/defi/portfolio/{portfolioId}/totals`, `/staking`, `/lending`, `/farming`. (There is no
portfolio-scoped `/networks`.)

`/staking`, `/lending` and `/farming` are shorthand for `/v1/defi?category=…` and take the same
parameters.

## Request

```bash
curl -X GET "https://api-v2.kryptos.io/v1/defi?category=lending&limit=50" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Query Parameters

For `/v1/defi` and the category shortcuts:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `category` | string | — | One of the 18 categories listed below |
| `detailType` | string | — | Protocol-specific position subtype |
| `integrationId` | string | — | Scope to one connected account |
| `networkId` | string | — | Chain, by provider id — e.g. `ethereum`, `base`. Values come from `/v1/defi/networks` |
| `search` | string | — | Free-text match on protocol name |
| `includeSpam` | boolean | `false` | Include positions in assets flagged as spam |
| `offset` | integer | `0` | Rows to skip |
| `limit` | integer | `50` | Rows to return, 1–1000 |

`/v1/defi/totals` accepts only `includeSpam`. `/v1/defi/networks` accepts `includeSpam` and
`integrationId`.

### Categories

`lending`, `borrowing`, `staking`, `locked`, `farming`, `leveraged_farming`, `reward`, `trading`,
`derivatives`, `options_seller`, `options_buyer`, `perpetuals`, `insurance`, `insurance_seller`,
`insurance_buyer`, `governance`, `vesting`, `other`.

Any other value returns `400 Validation failed`.

## Response — position list

```json
{
  "success": true,
  "data": [
    {
      "id": "defi_7c1a9e",
      "owner": {
        "provider": "ethereum",
        "providerPublicName": "Ethereum",
        "publicAddress": "0xab...",
        "walletId": "int_44de",
        "logoUrl": "https://...",
        "alias": "Main EVM"
      },
      "protocolId": "aave-v3",
      "protocolName": "Aave V3",
      "protocolLogoUrl": "https://...",
      "chain": "ethereum",
      "positionName": "USDC Supply",
      "detailTypes": ["common"],
      "positionIndex": "0",
      "category": "lending",
      "pool": {},
      "portfolio": {},
      "totalValue": { "price": 52000, "baseCurrency": "USD", "timestamp": 1721088000000, "source": "debank" },
      "debtValue": { "price": 12000, "baseCurrency": "USD", "timestamp": 1721088000000, "source": "debank" },
      "netValue": { "price": 40000, "baseCurrency": "USD", "timestamp": 1721088000000, "source": "debank" },
      "positionTimestamp": 1721088000000,
      "isActive": true,
      "tags": [],
      "notes": null
    }
  ],
  "totalCount": 9,
  "offset": 0,
  "limit": 50,
  "hasMore": false
}
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Position id |
| `owner` | object | The account holding the position — `provider`, `providerPublicName`, `publicAddress`, `walletId`, `logoUrl`, `alias` |
| `protocolId` | string | Protocol identifier, e.g. `aave-v3` — joins to [DeFi protocol metadata](#protocol-metadata) |
| `protocolName` | string | Protocol display name |
| `protocolLogoUrl` | string | Protocol icon |
| `chain` | string | Chain the position is on |
| `positionName` | string | Human label for the position |
| `detailTypes` | array | Protocol-specific subtypes |
| `positionIndex` | string | Disambiguates multiple positions of the same type in one protocol |
| `category` | string | One of the categories above |
| `pool` | object | Protocol-specific pool detail — shape varies by protocol |
| `portfolio` | object | Protocol-specific position detail, including supplied and reward tokens |
| `totalValue` | object | Gross position value |
| `debtValue` | object | Borrowed value, where the position has debt |
| `netValue` | object | `totalValue − debtValue` |
| `positionTimestamp` | number | Unix ms the position was last observed |
| `isActive` | boolean | Still open |
| `tags`, `notes` | array, string | User annotations |

`totalValue`, `debtValue` and `netValue` are **price objects**, not bare numbers:
`{ price, baseCurrency, timestamp, source }`. Read `.price` for the amount.

`pool` and `portfolio` are protocol-defined and intentionally untyped — their keys differ per
protocol. Don't assume a fixed schema.

## Response — `/v1/defi/totals`

```json
{
  "success": true,
  "data": {
    "totalBalance": 52000,
    "borrowed": 12000,
    "earnedRewards": 840,
    "connectedProtocols": 4,
    "baseCurrency": "USD"
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `totalBalance` | number | Gross value of all positions |
| `borrowed` | number | Total debt |
| `earnedRewards` | number | Value of unclaimed rewards |
| `connectedProtocols` | number | Distinct protocols with an open position |
| `baseCurrency` | string | Currency of the values |

## Response — `/v1/defi/networks`

```json
{
  "success": true,
  "data": [
    { "providerId": "ethereum", "name": "Ethereum", "logoUrl": "https://...", "walletCount": 2 }
  ]
}
```

Use `providerId` as the `networkId` filter value.

## Protocol metadata

Protocol reference data — TVL, chains, tags, portfolio support — is a separate, workspace-independent
resource requiring only authentication:

| | Endpoint |
| --- | --- |
| <span className="badge badge--get">GET</span> | `/v1/defi-metadata` |
| <span className="badge badge--get">GET</span> | `/v1/defi-metadata/{id}` |

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | string | — | Filter by protocol id |
| `name` | string | — | Filter by name |
| `chain` | string | — | Filter by chain |
| `tags` | string | — | Comma-separated tags |
| `isSupportPortfolio` | string | — | `true` or `false` |
| `isVisible` | string | `true` | `true` or `false` |
| `sortBy` | string | `tvl` | `tvl`, `priority`, `name` or `totalUserCount` |
| `sortOrder` | string | `desc` | `asc` or `desc` |
| `limit` | integer | `50` | 1–200 |
| `offset` | integer | `0` | Rows to skip |

```json
{
  "success": true,
  "data": [],
  "pagination": { "limit": 50, "offset": 0, "total": 312 }
}
```

Note this is a **fourth** pagination shape, local to this endpoint: `limit`/`offset`/`total` inside a
`pagination` object, with no `hasMore`. `/v1/defi-metadata/{id}` returns
`404 { "success": false, "error": "Protocol not found" }` for an unknown id.
