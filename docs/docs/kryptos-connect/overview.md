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
   User logs in or creates anonymous account
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

| Method             | Header/Body                               | Used For             |
| ------------------ | ----------------------------------------- | -------------------- |
| Client Credentials | `X-Client-Id` + `X-Client-Secret` headers | Creating link tokens |
| Link Token         | `X-LINK-TOKEN` header                     | Widget operations    |
| Bearer Token       | `Authorization: Bearer {access_token}`    | Data API calls       |

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

| Resource     | Read Scope          | Write Scope          | Description                     |
| ------------ | ------------------- | -------------------- | ------------------------------- |
| Portfolios   | `portfolios:read`   | `portfolios:write`   | Portfolio holdings              |
| Transactions | `transactions:read` | `transactions:write` | Transaction history             |
| Balances     | `balances:read`     | `balances:write`     | Account balances                |
| Integrations | `integrations:read` | `integrations:write` | Connected wallets and exchanges |
| DeFi         | `defi:read`         | `defi:write`         | DeFi protocol positions         |
| NFT          | `nft:read`          | `nft:write`          | NFT collections                 |
| Tax          | `tax:read`          | `tax:write`          | Tax calculations                |
| Accounting   | `accounting:read`   | `accounting:write`   | Accounting ledger               |
| Reports      | `reports:read`      | `reports:write`      | Generated reports               |
| Workspace    | `workspace:read`    | `workspace:write`    | Workspace settings              |

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

## Sandbox Mode

New clients are created in **sandbox mode** by default, which has the following limitations:

### Supported Chains

Only **Ethereum** and **Solana** are available in sandbox mode.

### Test Addresses

Use these pre-approved test addresses for sandbox testing:

| Chain    | Test Address                                   |
| -------- | ---------------------------------------------- |
| Ethereum | `0x47c2e31e9ce22437bcf6313d2b9e98245a7bfcfa`   |
| Solana   | `2r8Hm938GzCQ2gXTP2deDarkn52ezYf1UUaEzMpkwrk1` |

### Sandbox Errors

| Error Code                     | Description                            |
| ------------------------------ | -------------------------------------- |
| `SANDBOX_PROVIDER_NOT_ALLOWED` | Provider not available in sandbox mode |
| `SANDBOX_ADDRESS_NOT_ALLOWED`  | Address not allowed in sandbox mode    |

### Production Access

To upgrade to production mode with full access to all chains and addresses, contact us at [support@kryptos.io](mailto:support@kryptos.io).

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
