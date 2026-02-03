---
id: kryptos-connect
title: Kryptos Connect
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
   Widget returns public_token via onSuccess callback
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

## Web SDK

The Kryptos Connect Web SDK provides a pre-built widget that handles the complete authentication flow.

### Installation

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install @kryptos_connect/web-sdk
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add @kryptos_connect/web-sdk
```

</TabItem>
<TabItem value="cdn" label="CDN">

```html
<script src="https://unpkg.com/@kryptos_connect/web-sdk@latest/dist/index.js"></script>
```

</TabItem>
</Tabs>

### Quick Start

```javascript
import KryptosConnect from "@kryptos_connect/web-sdk";

// 1. Initialize the Connect widget
const kryptosConnect = KryptosConnect.create({
  linkToken: "link_token_from_backend", // Get this from your backend
  onSuccess: (public_token) => {
    // Send public_token to your backend to exchange for access tokens
    fetch("/api/exchange-token", {
      method: "POST",
      body: JSON.stringify({ public_token }),
    });
  },
  onExit: (error) => {
    // Handle user exit or errors
    console.error("Widget exited:", error);
  },
  onEvent: (eventName, metadata) => {
    // Track user actions in widget
    console.log("Event:", eventName, metadata);
  },
});

// 2. Open the widget
kryptosConnect.open();
```

### SDK Configuration

| Option      | Type     | Required | Description                                 |
| ----------- | -------- | -------- | ------------------------------------------- |
| `linkToken` | string   | Yes      | Link token obtained from your backend       |
| `onSuccess` | function | Yes      | Callback when user completes authentication |
| `onExit`    | function | No       | Callback when widget is closed              |
| `onEvent`   | function | No       | Callback for tracking user events           |
| `language`  | string   | No       | Widget language (default: 'en')             |
| `theme`     | object   | No       | Custom theme configuration                  |

### Events

The SDK emits events during the authentication flow:

| Event                | Description                    |
| -------------------- | ------------------------------ |
| `OPEN`               | Widget opened                  |
| `EXIT`               | Widget closed                  |
| `HANDOFF`            | User switched to browser flow  |
| `SELECT_INSTITUTION` | User selected exchange/wallet  |
| `SUBMIT_CREDENTIALS` | User submitted API credentials |
| `SUCCESS`            | Authentication flow completed  |
| `ERROR`              | An error occurred              |

---

## Mobile SDK

The Kryptos Connect Mobile SDK provides native integration for React Native applications on iOS and Android.

### Installation

```bash
npm install @kryptos_connect/mobile-sdk
```

**iOS Setup:**

```bash
cd ios && pod install
```

**Android Setup:**

Add the following to your `android/app/build.gradle`:

```gradle
dependencies {
    implementation project(':@kryptos_connect_mobile-sdk')
}
```

### Quick Start

```javascript
import KryptosConnect from "@kryptos_connect/mobile-sdk";

// 1. Initialize the Connect SDK
const initializeKryptos = async () => {
  const linkToken = await fetchLinkTokenFromBackend();

  const config = {
    linkToken: linkToken,
    onSuccess: (publicToken) => {
      // Send public_token to your backend
      exchangePublicToken(publicToken);
    },
    onExit: (error) => {
      if (error) {
        console.error("Connection error:", error);
      }
    },
    onEvent: (eventName, metadata) => {
      console.log("Event:", eventName, metadata);
    },
  };

  KryptosConnect.create(config);
};

// 2. Open the connection flow
const connectWallet = () => {
  KryptosConnect.open();
};
```

### Configuration

| Option      | Type     | Required | Description                                 |
| ----------- | -------- | -------- | ------------------------------------------- |
| `linkToken` | string   | Yes      | Link token obtained from your backend       |
| `onSuccess` | function | Yes      | Callback when user completes authentication |
| `onExit`    | function | No       | Callback when connection flow is closed     |
| `onEvent`   | function | No       | Callback for tracking user events           |
| `language`  | string   | No       | SDK language (default: device language)     |
| `theme`     | object   | No       | Custom theme configuration (light/dark)     |

### Events

The Mobile SDK emits events during the authentication flow:

| Event                | Description                    |
| -------------------- | ------------------------------ |
| `OPEN`               | Connection flow opened         |
| `EXIT`               | Connection flow closed         |
| `SELECT_INSTITUTION` | User selected exchange/wallet  |
| `SUBMIT_CREDENTIALS` | User submitted API credentials |
| `SUCCESS`            | Authentication flow completed  |
| `ERROR`              | An error occurred              |

### Features

- **Cross-Platform:** Single codebase for iOS and Android
- **Native Performance:** Optimized native modules
- **Biometric Auth:** Face ID, Touch ID, and fingerprint support
- **Secure Storage:** Encrypted token storage (Keychain on iOS, KeyStore on Android)
- **Dark Mode:** Automatic theme detection
- **Deep Linking:** Handle OAuth redirects seamlessly

### Package Information

- **NPM Package:** [@kryptos_connect/mobile-sdk](https://www.npmjs.com/package/@kryptos_connect/mobile-sdk)
- **React Native:** 0.64+
- **iOS:** 12.0+
- **Android:** API 23+ (Android 6.0+)

---

## Backend Implementation

### Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │         │    Your     │         │  Kryptos    │
│   App       │         │   Backend   │         │  Connect    │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │ 1. Request link token │                       │
       ├──────────────────────►│                       │
       │                       │ 2. Create link token  │
       │                       ├──────────────────────►│
       │                       │                       │
       │                       │◄──────────────────────┤
       │                       │   link_token          │
       │◄──────────────────────┤                       │
       │   link_token          │                       │
       │                       │                       │
       │ 3. Open widget        │                       │
       ├───────────────────────┼──────────────────────►│
       │                       │   User authenticates  │
       │                       │   and grants consent  │
       │◄──────────────────────┼───────────────────────┤
       │   public_token        │                       │
       │                       │                       │
       │ 4. Exchange token     │                       │
       ├──────────────────────►│                       │
       │                       │ 5. Exchange token     │
       │                       ├──────────────────────►│
       │                       │                       │
       │                       │◄──────────────────────┤
       │                       │ access_token (15 yr)  │
       │◄──────────────────────┤ grant_id              │
       │   Success             │                       │
```

### Step 1: Create Link Token

Create a link token on your backend to initialize the widget.

**Endpoint:** `POST https://connect-api.kryptos.io/link-token`

**Authentication:** Client credentials via `X-Client-Id` and `X-Client-Secret` headers

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
const axios = require("axios");

async function createLinkToken(userId, existingAccessToken = null) {
  const payload = {
    scopes:
      "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
    state: generateRandomState(),
    metadata: {
      user_id: userId,
    },
  };

  // Optional: pass existing access token to resume session
  if (existingAccessToken) {
    payload.access_token = existingAccessToken;
  }

  const response = await axios.post(
    "https://connect-api.kryptos.io/link-token",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    }
  );

  return response.data.data;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import os

def create_link_token(user_id, existing_access_token=None):
    payload = {
        'scopes': 'openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read',
        'state': generate_random_state(),
        'metadata': {
            'user_id': user_id,
        },
    }

    # Optional: pass existing access token to resume session
    if existing_access_token:
        payload['access_token'] = existing_access_token

    response = requests.post(
        'https://connect-api.kryptos.io/link-token',
        json=payload,
        headers={
            'Content-Type': 'application/json',
            'X-Client-Id': os.getenv('KRYPTOS_CLIENT_ID'),
            'X-Client-Secret': os.getenv('KRYPTOS_CLIENT_SECRET'),
        }
    )

    return response.json()['data']
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
function createLinkToken($userId, $existingAccessToken = null) {
    $ch = curl_init();

    $data = [
        'scopes' => 'openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read',
        'state' => bin2hex(random_bytes(16)),
        'metadata' => [
            'user_id' => $userId,
        ],
    ];

    // Optional: pass existing access token to resume session
    if ($existingAccessToken) {
        $data['access_token'] = $existingAccessToken;
    }

    curl_setopt_array($ch, [
        CURLOPT_URL => 'https://connect-api.kryptos.io/link-token',
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'X-Client-Id: ' . getenv('KRYPTOS_CLIENT_ID'),
            'X-Client-Secret: ' . getenv('KRYPTOS_CLIENT_SECRET'),
        ],
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    return $result['data'];
}
?>
```

</TabItem>
</Tabs>

**Response (Fresh Session):**

```json
{
  "success": true,
  "data": {
    "link_token": "link_abc123xyz789",
    "expires_at": "2024-01-28T10:30:00Z"
  }
}
```

**Response (Session Resumed with `access_token`):**

```json
{
  "success": true,
  "data": {
    "link_token": "link_abc123xyz789",
    "expires_at": "2024-01-28T10:30:00Z",
    "user_id": "uuid-user-123",
    "workspace_id": "uuid-workspace-456",
    "has_existing_grant": true
  }
}
```

### Step 2: Exchange Public Token

After the user completes authentication, exchange the public token for a long-lived access token.

**Endpoint:** `POST https://connect-api.kryptos.io/token/exchange`

**Authentication:** Client credentials via headers or body

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
async function exchangePublicToken(publicToken) {
  const response = await axios.post(
    "https://connect-api.kryptos.io/token/exchange",
    {
      public_token: publicToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    }
  );

  const { access_token, grant_id, workspace_id } = response.data.data;

  // Store tokens securely
  await storeTokens(access_token, grant_id, workspace_id);

  return response.data.data;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
def exchange_public_token(public_token):
    response = requests.post(
        'https://connect-api.kryptos.io/token/exchange',
        json={
            'public_token': public_token,
        },
        headers={
            'Content-Type': 'application/json',
            'X-Client-Id': os.getenv('KRYPTOS_CLIENT_ID'),
            'X-Client-Secret': os.getenv('KRYPTOS_CLIENT_SECRET'),
        }
    )

    data = response.json()['data']
    access_token = data['access_token']
    grant_id = data['grant_id']
    workspace_id = data['workspace_id']

    # Store tokens securely
    store_tokens(access_token, grant_id, workspace_id)

    return data
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
function exchangePublicToken($publicToken) {
    $ch = curl_init();

    $data = [
        'public_token' => $publicToken,
    ];

    curl_setopt_array($ch, [
        CURLOPT_URL => 'https://connect-api.kryptos.io/token/exchange',
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'X-Client-Id: ' . getenv('KRYPTOS_CLIENT_ID'),
            'X-Client-Secret: ' . getenv('KRYPTOS_CLIENT_SECRET'),
        ],
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    $data = $result['data'];

    // Store tokens securely
    storeTokens($data['access_token'], $data['grant_id'], $data['workspace_id']);

    return $data;
}
?>
```

</TabItem>
</Tabs>

**Response:**

```json
{
  "success": true,
  "data": {
    "access_token": "cat_abc123xyz789",
    "grant_id": "cgrant_abc123xyz789",
    "token_type": "Bearer",
    "expires_in": 473040000,
    "scope": "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
    "workspace_id": "uuid-workspace-123"
  }
}
```

:::info Long-Lived Access Tokens
Access tokens are valid for **15 years** (473,040,000 seconds). No refresh tokens are needed. Store the `grant_id` to allow users to revoke access later.
:::

### Step 3: Make API Calls

Use the access token to call Kryptos APIs:

```javascript
async function getUserHoldings(accessToken) {
  const response = await axios.get(
    "https://connect.kryptos.io/api/v1/holdings",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    }
  );

  return response.data;
}
```

---

## Session Management

### Resume Existing Session

Pass an existing access token when creating a link token to skip the authentication flow for returning users:

```javascript
async function createLinkTokenWithSession(userId, existingAccessToken) {
  const response = await axios.post(
    "https://connect-api.kryptos.io/link-token",
    {
      scopes:
        "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
      access_token: existingAccessToken, // Pre-authenticate with existing token
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    }
  );

  return response.data.data;
}
```

**Response with existing session:**

```json
{
  "success": true,
  "data": {
    "link_token": "link_xxx...",
    "expires_at": "...",
    "user_id": "user123",
    "workspace_id": "ws123",
    "has_existing_grant": true
  }
}
```

### Check Session Status

Check if a user has an active session before opening the widget:

```javascript
async function checkSession(accessToken) {
  const response = await axios.post(
    "https://connect-api.kryptos.io/link-token/check-session",
    {
      access_token: accessToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    }
  );

  return response.data.data;
}
```

**Response (Valid Session):**

```json
{
  "success": true,
  "data": {
    "has_valid_session": true,
    "user_id": "uuid-user-123",
    "workspace_id": "uuid-workspace-456",
    "workspace_name": "My Workspace",
    "granted_scopes": "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
    "grant_id": "cgrant_abc123"
  }
}
```

**Response (No Valid Session):**

```json
{
  "success": true,
  "data": {
    "has_valid_session": false,
    "reason": "token_expired"
  }
}
```

### Revoke Grant

Allow users to disconnect their account by revoking the grant:

**Endpoint:** `POST https://connect-api.kryptos.io/token/revoke`

```javascript
async function revokeGrant(grantId) {
  const response = await axios.post(
    "https://connect-api.kryptos.io/token/revoke",
    {
      grant_id: grantId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    }
  );

  return response.data;
}
```

**Response:**

```json
{
  "success": true,
  "message": "Grant revoked successfully"
}
```

:::warning Grant Revocation
When a grant is revoked, all associated access tokens are immediately invalidated. Any subsequent API calls using those tokens will fail.
:::

### List Connected Grants

Get all active grants for your client:

**Endpoint:** `GET https://connect-api.kryptos.io/token/grants`

```javascript
async function listGrants() {
  const response = await axios.get(
    "https://connect-api.kryptos.io/token/grants",
    {
      headers: {
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    }
  );

  return response.data.data;
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "grants": [
      {
        "grant_id": "cgrant_abc123xyz789",
        "workspace_id": "uuid-workspace-123",
        "scopes": "transactions:read balances:read",
        "created_at": "2024-01-15T10:00:00Z",
        "expires_at": "2039-01-15T10:00:00Z"
      }
    ],
    "count": 1
  }
}
```

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

## Error Handling

### Common Errors

| Error Code                 | Description                  | Solution                             |
| -------------------------- | ---------------------------- | ------------------------------------ |
| `INVALID_CLIENT`           | Invalid client credentials   | Verify client_id and client_secret   |
| `INVALID_TOKEN`            | Token expired or invalid     | Re-authenticate user                 |
| `TOKEN_EXPIRED`            | Link or public token expired | Create new link token                |
| `TOKEN_ALREADY_USED`       | Token was already consumed   | Create new link token                |
| `INVALID_SCOPE`            | Requested scope not allowed  | Check allowed scopes for your client |
| `INVALID_GRANT`            | Grant revoked or invalid     | Re-authenticate user                 |
| `INSUFFICIENT_PERMISSIONS` | User lacks required role     | User must be owner/admin             |
| `WORKSPACE_NOT_FOUND`      | Workspace doesn't exist      | Verify workspace ID                  |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Handling Revoked Grants

Since access tokens are long-lived, the grant may be revoked before the token expires. Handle this case:

```javascript
async function makeApiCallWithCheck(endpoint, accessToken, grantId) {
  try {
    return await makeApiCall(endpoint, accessToken);
  } catch (error) {
    if (error.response?.status === 401) {
      // Token or grant invalid - user needs to re-authenticate
      throw new Error("Access revoked. Please reconnect your account.");
    }
    throw error;
  }
}
```

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

## Token Types & Lifetimes

| Token Type   | Prefix    | Lifetime   | Description                           |
| ------------ | --------- | ---------- | ------------------------------------- |
| Link Token   | `link_`   | 30 minutes | Initialize Connect widget             |
| Public Token | `public_` | 30 minutes | Exchange for access token (one-time)  |
| Access Token | `cat_`    | 15 years   | API authentication (long-lived)       |
| Grant Token  | `cgrant_` | 15 years   | Authorization record (for revocation) |

---

## Support

### SDK Packages

- **Web SDK:** [@kryptos_connect/web-sdk](https://www.npmjs.com/package/@kryptos_connect/web-sdk)
- **Mobile SDK:** [@kryptos_connect/mobile-sdk](https://www.npmjs.com/package/@kryptos_connect/mobile-sdk)

### Contact & Resources

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
- **Documentation:** [docs.kryptos.io](https://docs.kryptos.io)

---

## Next Steps

1. **[Set up OAuth 2.0](/authentication/oauth)** - Configure full OAuth flow
2. **[Explore API Endpoints](/api/holdings)** - Browse available APIs
3. **[View Type Definitions](/reference/types)** - TypeScript types for API responses
