---
id: overview
title: Kryptos Connect
sidebar_position: 1
---

import ConnectShowcase from '@site/src/components/ConnectShowcase';

# Kryptos Connect

Kryptos Connect enables users to securely share their crypto portfolio data with third-party applications through a single, easy-to-integrate widget.

## Overview

Kryptos Connect provides a seamless way for users to:

- **Authorize access** to their crypto portfolio with explicit consent
- **Share data securely** using industry-standard OAuth 2.0
- **Manage integrations** by connecting wallets and exchanges
- **Control permissions** with granular scope-based access
- **Long-lived access** with 15-year access tokens (no refresh tokens needed)
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
| Client Credentials | `X-Client-Id` + `X-Client-Secret`         | Creating link tokens, exchanging and revoking tokens — **backend only** |
| Link Token         | `x-link-token`                            | Widget operations, and adding integrations from the browser |
| Bearer Token       | `Authorization: Bearer {access_token}`    | Data API calls from your backend           |

Client credentials may also be sent in the JSON body as `client_id` and `client_secret`, which the SDK
examples use. Either way they belong on your server, never in frontend code.

For the full request and response detail of every session endpoint, see the
**[Link Token API](./link-token-api)**.

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
| `offline_access` | Enable long-lived tokens    |

### API Scopes

| Resource     | Read Scope          | Write Scope          | Covers                                  |
| ------------ | ------------------- | -------------------- | --------------------------------------- |
| Portfolios   | `portfolios:read`   | `portfolios:write`   | Holdings, balances, DeFi, NFTs, dashboard, graphs |
| Transactions | `transactions:read` | `transactions:write` | Transactions, ledgers, labels, spam     |
| Integrations | `integrations:read` | `integrations:write` | Connected wallets, exchanges, sync, CSV |
| Contacts     | `contacts:read`     | `contacts:write`     | Contacts and counterparties             |
| Tax          | `tax:read`          | `tax:write`          | Tax calculations                        |
| Accounting   | `accounting:read`   | `accounting:write`   | Accounting ledger                       |
| Reports      | `reports:read`      | `reports:write`      | Generated reports                       |
| Workspace    | `workspace:read`    | `workspace:write`    | Workspace settings                      |
| Users        | `users:read`        | `users:write`        | User profile                            |

There is **no separate `balances`, `defi` or `nft` scope** — all three are covered by `portfolios:read`.
`contacts:*` is not in the default set above and must be requested explicitly.

A grant can never exceed what the consenting member's role allows, so check the `scope` value returned
with the access token rather than assuming you received everything you requested.

---

## Token Types & Lifetimes

| Token Type   | Prefix    | Lifetime   | Description                           |
| ------------ | --------- | ---------- | ------------------------------------- |
| Link Token   | `link_`   | 30 minutes | Initialize Connect widget             |
| Public Token | `public_` | 30 minutes | Exchange for access token (one-time)  |
| Access Token | `cat_`    | 15 years   | API authentication (long-lived)       |
| Grant Token  | `cgrant_` | 15 years   | Authorization record (for revocation) |

---

## Security Best Practices

1. **Never expose secrets in frontend code** - Keep client_secret on your backend only
2. **Store tokens securely** - Use encrypted storage for access tokens and grant IDs
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
| Can sign in to Kryptos directly | No | Yes |
| Subject to developer transaction limits | Yes | No |

Both are offered by default; control which with `authMethods` in the SDK. See
[Guest vs Linked users](./link-token-api#guest-vs-linked-users) for the detail, including why
`GET /v1/users/me` returns `404` for a Guest.

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
