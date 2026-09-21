---
id: changelog
title: Changelog
sidebar_position: 99
---

# Changelog

All notable changes to the Kryptos Connect API.

---

## September 2026

**Provider catalogue no longer exposes connector internals**

`GET /v1/providers` and `GET /v1/providers/{id}` are a public, unauthenticated catalogue, but each
`functions[]` entry was carrying the connector's operating configuration with it. Those three fields
are gone:

- `endpoint` — the upstream URL the function calls
- `details` — its rate-limit, window and batching parameters
- `status` — the raw result of the last health probe, including the upstream's error text

Function health is preserved as two derived booleans, `enabled` and `operational` — see
[Providers](/docs/api/providers#connector-functions). If you built an outage badge on
`status.on` / `status.status` / `status.error`, `operational` combined with `is_base` is the
replacement: any base function not operational is a full outage, a non-base one is partial.

`name`, `public_name`, `is_base` and `categories` are unchanged, as is every other provider field.

**User profile no longer returns the Stripe customer id**

`GET /v1/users/me` was returning `stripeCustomerId`, the billing identity behind the account. It was
never documented and is no longer returned. Every documented profile field is unchanged.

**Documentation corrections**

These describe behaviour that was already the case — the docs were wrong, not the API.

- **API keys reach `/v1/users/*` only.** `GET /v1/holdings` and every other resource endpoint accept a
  bearer token and reject `x-api-key` with `401`. The overview and API-key pages both showed a holdings
  example that never worked.
- **API keys are bound to a workspace.** A key carries its workspace from creation; you do not pass
  `?wid=`, and passing a different workspace id returns `403`. The previous text said the opposite.
- **Contacts and counterparties nest their pagination** under `meta` as `{ total, page, limit }`. The
  overview described it as spread beside `success`.
- **`credentialValidationStatus` and `importMethod` were never returned** by `GET /v1/integrations`
  and have been removed from the field table. `credentials` *is* returned by the list, not only the
  single-integration read.
- Counterparties, spam and the `fields=summary` integration projection now have response-field tables.
- Transactions: `explorerLinkSrc`, `isMergedTrx`, `trxsMerged` and `isSplitted` are now documented.
- Workspace: `customAssetPricesEnabled`, `organizationId`, `lastSyncTime` and
  `lastAccountingCalculation` are now documented on the single-workspace read.

---

## August 2026

**Webhooks — deliveries are now attributable**

- **Every delivery carries `grant_id` and `workspace_id`** as top-level envelope fields, next to `id`,
  `event` and `timestamp`. They are the same two ids returned by token exchange, so a partner can map a
  delivery to one of their own customers. They are body fields, not headers, and are not inside `data`.
- **Breaking — fan-out is per grant, not per developer workspace.** If two of your OAuth clients each
  hold a live grant on the same end user, that user's events are now delivered twice, once per grant,
  each with its own `grant_id` and delivery `id`. Previously the two collapsed into one delivery.
  Deduplicating on `X-Webhook-Id` still works for retries and will not collapse these.
- **`data` contains no `uid`.** It never did in v2 — the docs described a v1 field. Use `grant_id`.
  `walletId` is not a substitute: `integration.created` arrives before you have stored a wallet id, and
  the `transfer_detection.*` / `costbasis.*` payloads carry no wallet id at all.
- **Fixed:** `integration.updated` and `integration.failed` shipped `publicAddress: ""` for every
  wallet. Address-based integrations now report their real address. Note the field is an empty string,
  never `null`, for exchanges, OAuth and CSV integrations.
- Documented: `integration.deleted` reports `status: "DELETED"`, and `isContract` is always `false`
  (v2 does not perform contract detection).

**Sync — telling a truncated sync from a failed one**

- **New `limitReached` (boolean)** on `GET /v1/sync/{syncId}`, on every entry of `GET /v1/sync`, and on
  `latestSync` in `GET /v1/integrations`. `true` means the run stopped early because the workspace hit
  its transaction limit: rows fetched before the cut are saved, the rest were never read. A failed
  connector function produces the same `partially_synced` status, which is why this is a separate field
  rather than something to infer from `message`. Raising the cap does not backfill on its own — the
  integration has to be re-synced with `syncMode: resync_from_start`. This is the v2 replacement for
  v1's `limitExceeded`.
- **Fixed:** `GET /v1/sync/{syncId}` returned `summary: undefined` for every sync. It now returns the
  per-function report.

**Transaction limits**

- `PATCH /developer/grants/{grantId}/transaction-limit` now returns `previous_transaction_limit` and
  `previous_enable_limiter`, so the response alone tells you what the cap was as well as what it became.
- **A limit change now re-syncs the user's wallets.** When the call actually changes the cap, every
  re-syncable integration in the workspace is queued for a full re-fetch from the start — you no longer
  need to detect the change and request it yourself. The new `resync` field reports
  `{ triggered, failed, skipped }`, or is `null` when the request changed nothing. Custom wallets,
  sync-disabled accounts and CSV-fed integrations are counted in `skipped`, along with anything past the
  100-per-call cap.
- A workspace's cap can be read back from `GET /v1/workspaces/{workspace_id}`, whose `limits` block
  carries `effectiveTransactionLimit`, `currentTransactionCount` and `remainingTransactions`.

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

- Kryptos Connect — Guest and Linked users are now explained rather than assumed, including why
  `GET /v1/users/me` returns `404` for a Guest and which sessions accept developer transaction limits.
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
