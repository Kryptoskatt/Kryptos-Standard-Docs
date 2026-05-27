---
id: changelog
title: Changelog
sidebar_position: 99
---

# Changelog

All notable changes to the Kryptos Connect API.

---

## May 2026

**New**

- Demo Apps — Live interactive demos published at [demo-connect.kryptos.io](https://demo-connect.kryptos.io).

**Enhancements**

- `GET /v1/userinfo` — the `profile` scope response now includes `transaction_limit` (number | null). Reflects the effective limit applied to the user: per-user override if set, otherwise the workspace default, otherwise the platform default (100,000). `null` means the limiter is disabled and no cap applies.
- `GET /v1/integrations` — each integration now includes a new `lastSyncLogDetails` field alongside `lastSyncLog`. Where `lastSyncLog` is the flat `{ stage: status }` map (unchanged), `lastSyncLogDetails` carries `{ status, message?, limitExceeded? }` per stage so clients can show stage-specific failure reasons (e.g. which sync step hit the transaction-import limit) without parsing the wallet-level `message`. The existing `lastSyncLog`, `message`, and `limitExceeded` fields are unchanged.

**Breaking**

- Web SDK & Mobile SDK — `KryptosConnectProvider` has been removed. Call `KryptosConnect.init({ clientId, appName, theme, language, authMethods })` once at app startup instead. Apps still using the provider will not render correctly.
- Mobile SDK — `react-native-svg` and all WalletConnect dependencies (`@reown/appkit-react-native`, `@walletconnect/react-native-compat`, etc.) are no longer required and must be removed. The only peer dependency is `react-native-webview`.
- Web SDK & Mobile SDK — CSS theming is now done via the `cssVars` option in `KryptosConnect.init()` using `--kc-*` CSS custom properties. Previous workarounds targeting internal class names will break.

---

## April 2026

**New**

- `POST /v1/integrations/{integrationId}/resync` — trigger a resync on a user's connected wallet, exchange, or CSV integration. Supports `latest` (incremental refresh) and `from_start` (full re-ingestion) modes.
- Developer Portal — optional per-client transaction limits for Guest users.
- Kryptos Connect SDKs — published documentation for Web SDK, Mobile SDK, and the Connect Overview.
- Web SDK — `authMethods` prop to restrict the auth options shown in the widget; email login and anonymous authentication.

**Enhancements**

- `GET /v1/holdings` — each holding now includes a per-asset `roi` field (`unrealizedPnL / costbasis * 100`). The `summary.roiPercentage` field is unchanged.
- `GET /v1/transactions`, `GET /v1/nft-holdings`, `GET /v1/defi-holdings` — the `pagination` object now includes `totalCount`, `returned_count`, `hasNextPage`, and `hasPreviousPage`. Existing `limit` and `offset` fields are unchanged.
- `GET /v1/holdings`, `GET /v1/transactions`, `GET /v1/nft-holdings` — spam assets are now excluded by default. Pass `?isSpam=true` to include them.
- Web SDK — added `language` prop for UI localization.

**Fixes**

- `GET /v1/transactions` — very small or very large amounts in the `description` string (e.g. `"Received 1e-9 SOL from airdrops"`) are now rendered in fixed-decimal notation (e.g. `"Received 0.000000001 SOL from airdrops"`).

**Removed**

- Web SDK — `baseUrl` prop is no longer applicable and has been removed from the documentation.

---

## February 2026

**New**

- Webhooks — added a Webhooks category to the docs covering setup and the supported event types.
- Recipes — new "Recipes" category with a guide for posting transactions using API-key authentication.
- Public Endpoints — added a Public Endpoints category with integrations documentation.
- Kryptos Connect — sandbox mode section covering supported chains, test addresses, and error codes; user-flow variations and direct-integration examples.

**Enhancements**

- `GET /v1/transactions` — added `totalCostbasis` and `totalGains` fields to transaction responses and type definitions.

**Breaking**

- Kryptos Connect callbacks renamed: `onSuccess` → `onConnectSuccess`, `onError` → `onConnectError`.

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
