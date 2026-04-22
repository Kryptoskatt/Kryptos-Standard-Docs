---
id: changelog
title: Changelog
sidebar_position: 99
---

# Changelog

All notable changes to the Kryptos Connect API.

---

## April 2026

**Enhancements**

- `GET /v1/holdings` — each holding now includes a per-asset `roi` field (`unrealizedPnL / costbasis * 100`). The `summary.roiPercentage` field is unchanged.
- `GET /v1/transactions`, `GET /v1/nft-holdings`, `GET /v1/defi-holdings` — the `pagination` object now includes `totalCount`, `returned_count`, `hasNextPage`, and `hasPreviousPage`. Existing `limit` and `offset` fields are unchanged.

**Fixes**

- `GET /v1/transactions` — very small or very large amounts in the `description` string (e.g. `"Received 1e-9 SOL from airdrops"`) are now rendered in fixed-decimal notation (e.g. `"Received 0.000000001 SOL from airdrops"`).

---

## v1.0.0 — January 2026

**Initial Release**

- OAuth 2.0 authentication with PKCE
- Developer Portal for client management
- V1 API endpoints (Holdings, Transactions, DeFi, NFT, Integrations, Profiling)
- Granular permission scopes
- API documentation

---

## Upcoming

- Kryptos Connect Widget
