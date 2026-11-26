---
id: overview
title: Kryptos Connect
sidebar_position: 1
---

import ConnectShowcase from '@site/src/components/ConnectShowcase';

# Kryptos Connect

Kryptos Connect enables users to securely share their crypto portfolio data with third-party applications through a single, easy-to-integrate widget.

:::tip When to use Connect
Use Connect when **your users** connect their wallets and exchanges, or their existing Kryptos account,
and agree to share that data with you. The workspace belongs to the user; your backend gets a
**read-only** access token for it. Users without a Kryptos account are created as guests on the fly.

Building on your own customers' data without them having Kryptos accounts? Use the
[White-label backend](/docs/integrations-api/overview). Need to act inside a Kryptos user's account? Use
[OAuth 2.0](/docs/authentication/oauth). Compare them in
[Pick your use case](/docs/intro#pick-your-use-case).
:::

## Overview

Kryptos Connect provides a seamless way for users to:

- **Authorize access** to their crypto portfolio with explicit consent
- **Share data securely** using industry-standard OAuth 2.0
- **Manage integrations** by connecting wallets and exchanges
- **Control permissions** with granular scope-based access
- **Standard token refresh**: an access token plus a refresh token you redeem at the OAuth token endpoint
- **Native mobile support** for iOS and Android applications

### Base URL

```
https://connect-api.kryptos.io
```

---

## How it works

See how users connect their accounts through the Kryptos Connect widget:

<ConnectShowcase />

---

## Getting Started

### Prerequisites

1. **Register your application** on the [Developer Portal](https://dashboard.kryptos.io/) to receive:
   - `client_id` - Your application identifier
   - `client_secret` - Your secret key (keep secure, never expose in frontend)

2. **Configure your client** with:
   - Allowed redirect URIs
   - Allowed origins for CORS
   - Required scopes

### Integration Steps

```
1. CREATE LINK TOKEN (Backend)
   Your server calls /link-token with client credentials
   ↓
2. INITIALIZE WIDGET (Frontend)
   Pass link_token to the SDK widget
   ↓
3. USER AUTHENTICATES
   Guest login (no account), or email login with a one-time code.
   An email user with existing workspaces also picks which one to share.
   ↓
4. USER GRANTS CONSENT
   User approves requested permissions
   ↓
5. RECEIVE PUBLIC TOKEN
   Widget returns public_token via onConnectSuccess callback
   ↓
6. EXCHANGE TOKEN (Backend)
   Your server exchanges public_token for access_token
   ↓
7. ACCESS DATA
   Use access_token to call Data APIs
```

### Authentication Methods

| Method             | Header                                    | Used For                                   |
| ------------------ | ----------------------------------------- | ------------------------------------------ |
| Client Credentials | `X-Client-Id` + `X-Client-Secret`         | Creating link tokens, checking sessions, exchanging, listing and revoking grants, and the `/developer/*` endpoints — **backend only** |
| Link Token         | `x-link-token`                            | Widget operations, and adding integrations from the browser |
| Bearer Token       | `Authorization: Bearer {access_token}`    | Data API calls from your backend           |

Client credentials may also be sent in the JSON body as `client_id` and `client_secret`, which the SDK
examples use. Either way they belong on your server, never in frontend code.

See [Backend Integration](./backend) for the request and response detail of every session endpoint.

---

## Available Scopes

### Default Client Scopes

When you create a new OAuth client, the following scopes are assigned by default:

```
openid profile offline_access email portfolios:read transactions:read
integrations:read tax:read accounting:read reports:read workspace:read users:read
```

### Core Scopes

| Scope            | Description                 |
| ---------------- | --------------------------- |
| `openid`         | Required for OpenID Connect |
| `profile`        | User profile information    |
| `email`          | User email address          |
| `offline_access` | Refresh tokens (OAuth); Connect always returns one |

### API Scopes

| Resource     | Read Scope          | Write Scope          |
| ------------ | ------------------- | -------------------- |
| Portfolios   | `portfolios:read`   | `portfolios:write`   |
| Transactions | `transactions:read` | `transactions:write` |
| Integrations | `integrations:read` | `integrations:write` |
| Tax          | `tax:read`          | `tax:write`          |
| Accounting   | `accounting:read`   | `accounting:write`   |
| Reports      | `reports:read`      | `reports:write`      |
| Invoices     | `invoices:read`     | `invoices:write`     |
| Workspace    | `workspace:read`    | `workspace:write`    |
| Users        | `users:read`        | `users:write`        |
| Contacts     | `contacts:read`     | `contacts:write`     |
| Swaps        | `swaps:read`        | `swaps:write`        |

These are the only scopes Kryptos accepts. Each endpoint's required scope is on its page in the
[API Reference](/docs/api-reference/kryptos-api); [OAuth scopes](/docs/authentication/oauth#available-scopes)
has the same list.

:::info Connect access tokens are read-only
The access token your backend receives from a Connect session carries your client's scopes **minus every
`:write` scope**. Write scopes on your client apply to [OAuth](/docs/authentication/oauth) apps only.

The widget still lets the user add and manage integrations: those calls are made by the widget's own
session, not with your access token. Access tokens issued before this rule keep the scopes they were
granted.
:::

---

## Token Types & Lifetimes

| Token         | Prefix    | Lifetime                      | Description                                                                   |
| ------------- | --------- | ----------------------------- | ----------------------------------------------------------------------------- |
| Link Token    | `link_`   | 2 hours                       | Starts a Connect widget session                                               |
| Public Token  | `public_` | 30 minutes                    | Exchanged once for an access token and a refresh token                        |
| Access Token  | `cat_` (from the exchange; treat as opaque) | `expires_in` of the exchange  | Calls the Kryptos API. Refreshed tokens have no prefix and last 24 hours |
| Refresh Token | `crt_`    | 30 days                       | Gets a new access token at the OAuth token endpoint (see below)               |
| Grant         | `cgrant_` | Until revoked                 | The user's consent. Keep its id to revoke access                              |

### Refreshing the access token

Connect uses the standard OAuth 2.0 refresh flow, at the same endpoint as
[Sign in with Kryptos](/docs/authentication/oauth). There is no Connect-specific refresh endpoint.

```bash
curl -X POST https://oauth.kryptos.io/oidc/token \
  -u "$KRYPTOS_CLIENT_ID:$KRYPTOS_CLIENT_SECRET" \
  -d grant_type=refresh_token \
  -d refresh_token=crt_...
```

- The response has a new `access_token` (24 hours) and a `refresh_token`. **Always store the refresh token
  it returns**: it is the same one until it is past 70% of its life, then a new one replaces it.
- Refresh from your backend only: it needs your client secret.
- A refresh token that was replaced or revoked fails with `400 invalid_grant` and **revokes the grant**, so
  the user has to reconnect. Don't run two refreshes with the same token at once.
- It works for Guest sessions too.

Access tokens from `/token/exchange` currently last 15 years, so apps that never refresh keep working. That
will change to 24 hours on an announced date: build against `expires_in` and refresh now.

### When access stops

- **The user or you revoke the grant** (`POST /token/revoke`): every access and refresh token of that grant
  stops at once.
- **Kryptos switches your client off**: every access token your client holds (Connect and OAuth) stops on
  its next request, and refreshing fails.

---

## Security Best Practices

1. **Never expose secrets in frontend code** - Keep client_secret on your backend only
2. **Store tokens securely** - Encrypt access tokens, refresh tokens and grant IDs at rest; refresh from your backend only
3. **Use HTTPS** - Always use secure connections in production
4. **Validate state parameters** - Prevent CSRF attacks
5. **Monitor for suspicious activity** - Log and monitor authentication events
6. **Allow users to revoke access** - Provide UI to disconnect integrations using `/token/revoke`
7. **Store grant IDs** - Keep grant IDs for revocation purposes

---

## Guest and Linked users

Connect produces two kinds of user, and the difference affects what you can do with the session:

|  | Guest | Linked |
| --- | --- | --- |
| Created by | Guest login (no email) | Email login with a one-time code |
| Kryptos account | **None** — the workspace is the identity | Yes |
| `user_id` | Equals `workspace_id` | A real user id |
| Can sign in to Kryptos directly | No | Yes |
| Subject to developer transaction limits | Yes | No |

Both are offered by default; control which with `authMethods` in the SDK.

A Guest is a workspace, not a person, which has two consequences worth designing around:

- [`GET /v1/users/me`](/docs/api/userinfo) returns `404` — there is no profile to fetch. Detect a Guest
  from `is_anonymous` at login, or by comparing `user_id` with `workspace_id`.
- The data belongs to the workspace your grant points at. Revoke the grant and nobody can reach it; a
  Guest cannot sign in elsewhere to recover it.

Only Guests accept [`PATCH /developer/grants/{grantId}/transaction-limit`](./backend#update-transaction-limit)
and [`DELETE /developer/integrations/{walletId}`](./backend#delete-integration); a Linked user returns
`400 NOT_ANON_USER`.

---

## Choose your integration path

- **[Web SDK](./web-sdk)** - React components for web applications
- **[Mobile SDK](./mobile-sdk)** - React Native components for iOS & Android
- **[Backend Implementation](./backend)** - Server-side token management and API calls
- **[Examples](./examples)** - Complete end-to-end integration examples

---

## Support

### SDK Packages

- **Web SDK:** [@kryptos_connect/web-sdk](https://www.npmjs.com/package/@kryptos_connect/web-sdk)
- **Mobile SDK:** [@kryptos_connect/mobile-sdk](https://www.npmjs.com/package/@kryptos_connect/mobile-sdk)

### Contact & Resources

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
- **Documentation:** [docs.kryptos.io](https://docs.kryptos.io)

### GitHub Repositories

- **Web SDK:** [Kryptoskatt/kryptos-connect-package](https://github.com/Kryptoskatt/kryptos-connect-package)
- **Mobile SDK:** [Kryptoskatt/kryptos-connect-mobile-package](https://github.com/Kryptoskatt/kryptos-connect-mobile-package)
