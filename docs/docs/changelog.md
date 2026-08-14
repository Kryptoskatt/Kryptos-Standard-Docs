---
id: changelog
title: Changelog
sidebar_position: 99
---

# Changelog

All notable changes to the Kryptos Connect API.

---

## August 2026

**Breaking — new API base URL**

The data API has moved to a new backend. The base URL is now **`https://api-v2.kryptos.io`**, and the
`/api` path prefix is gone: `https://connect.kryptos.io/api/v1/holdings` becomes
`https://api-v2.kryptos.io/v1/holdings`.

- **`X-Client-Id` and `X-Client-Secret` are no longer used on data calls.** `Authorization: Bearer` is
  the only header needed. Client credentials are still required on the Kryptos Connect
  link-token and token-exchange endpoints.
- **`user_id` and `timestamp` removed** from response envelopes.
- **Endpoints renamed:** `/v1/defi-holdings` → `/v1/defi`, `/v1/nft-holdings` → `/v1/nfts`,
  `/v1/userinfo` → `/v1/users/me`, `/v1/transactions/label-types` → `/v1/labels`,
  `/v1/integrations/providers` → `/v1/providers`, `/v1/counterparties` → `/v1/counter-parties`.
- **Holdings fields renamed:** `costbasis` → `costBasis`, `roi` → `roiPercentage` (now `null` rather
  than `0` when cost basis is unknown), and `24hrChange` split into `change24h` (absolute) and
  `change24hPercentage`. New: `assetId`, `costPerUnit`, `transactionCount`, `isSpam`.
- **The inline holdings `summary` block is gone** — `GET /v1/holdings` returns a top-level `totalValue`.
- **Ledger quantities are decimal strings**, not numbers, to preserve 18-decimal precision.
- **Removed:** the entire `/v0/*` surface, `GET /v1/profiling` and `GET /v1/holdings/graph`.

See **[Migrating from the previous API](/docs/api/migrating-from-connect-apis)** for the complete
mapping and a migration checklist.

**New**

- `GET /v1/ledgers` and `GET /v1/ledgers/{id}` — query transaction legs directly across transactions,
  with running balances and per-leg accounting figures.
- `GET /v1/calculated-balances` — ledger-derived balances with `isMissingTransactionHistory` and
  `lastLedgerTimestamp` reconciliation flags.
- `GET /v1/spam` — the assets being excluded from balances and totals.
- `GET /v1/integrations/{id}/assets` — per-asset breakdown for one connected account.
- `GET /v1/portfolios` — group accounts, and scope any portfolio query with `/portfolio/{portfolioId}`.
- Richer transaction filtering: exclusion filters (`notLabels`, `notWalletIds`, …) and data-quality
  flags (`isMissingTransaction`, `hasMissingPrice`, `hasMissingAsset`) that replace the previous
  reconciliation endpoints.
- `x-api-key` is now accepted on the portfolio and transaction endpoints, not just the user profile.

**Documentation**

- Kryptos Connect — new [Link Token API](/docs/kryptos-connect/link-token-api) page documenting the
  session endpoints the SDKs drive: OTP email login, workspace selection, consent, and the
  `x-link-token` credential. Guest vs Linked users are now explained rather than assumed.
- Sandbox mode has been removed from the product and from these docs.
- MCP Server documentation consolidated into a single install-and-go page.

---

## July 2026

**Enhancements**

- `GET /v1/holdings` — calculated balances (quantities derived from the transaction ledger, e.g. CSV uploads / custom wallets) are now **excluded by default**; the holdings list and its `summary` net-worth totals reflect live balances only. Pass `?calculatedBalances=true` to instead return the ledger-computed balances (the `calculatedBalances` set, maintained for every user).

---

## May 2026

**New**

- Web SDK & Mobile SDK — Integration form pre-fill via `extraConfig={{ prefill: { address, apiKey, secretKey, password, accountName } }}` on `KryptosConnectButton`. For EVM wallets, supplying an `address` automatically triggers chain detection and pre-selects all detected chains.
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
