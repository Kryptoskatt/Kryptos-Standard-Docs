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
- **Native mobile support** for iOS and Android applications

### Production URL

```
https://connect-api.kryptos.io
```

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
import KryptosConnect from '@kryptos_connect/web-sdk';

// 1. Initialize the Connect widget
const kryptosConnect = KryptosConnect.create({
  linkToken: 'link_token_from_backend', // Get this from your backend
  onSuccess: (public_token) => {
    // Send public_token to your backend to exchange for access tokens
    fetch('/api/exchange-token', {
      method: 'POST',
      body: JSON.stringify({ public_token }),
    });
  },
  onExit: (error) => {
    // Handle user exit or errors
    console.error('Widget exited:', error);
  },
  onEvent: (eventName, metadata) => {
    // Track user actions in widget
    console.log('Event:', eventName, metadata);
  },
});

// 2. Open the widget
kryptosConnect.open();
```

### SDK Configuration

| Option      | Type     | Required | Description                                          |
| ----------- | -------- | -------- | ---------------------------------------------------- |
| `linkToken` | string   | Yes      | Link token obtained from your backend                |
| `onSuccess` | function | Yes      | Callback when user completes authentication          |
| `onExit`    | function | No       | Callback when widget is closed                       |
| `onEvent`   | function | No       | Callback for tracking user events                    |
| `language`  | string   | No       | Widget language (default: 'en')                      |
| `theme`     | object   | No       | Custom theme configuration                           |

### Events

The SDK emits events during the authentication flow:

| Event                 | Description                          |
| --------------------- | ------------------------------------ |
| `OPEN`                | Widget opened                        |
| `EXIT`                | Widget closed                        |
| `HANDOFF`             | User switched to browser flow        |
| `SELECT_INSTITUTION`  | User selected exchange/wallet        |
| `SUBMIT_CREDENTIALS`  | User submitted API credentials       |
| `SUCCESS`             | Authentication flow completed        |
| `ERROR`               | An error occurred                    |

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
import KryptosConnect from '@kryptos_connect/mobile-sdk';

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
        console.error('Connection error:', error);
      }
    },
    onEvent: (eventName, metadata) => {
      console.log('Event:', eventName, metadata);
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

| Option      | Type     | Required | Description                                          |
| ----------- | -------- | -------- | ---------------------------------------------------- |
| `linkToken` | string   | Yes      | Link token obtained from your backend                |
| `onSuccess` | function | Yes      | Callback when user completes authentication          |
| `onExit`    | function | No       | Callback when connection flow is closed              |
| `onEvent`   | function | No       | Callback for tracking user events                    |
| `language`  | string   | No       | SDK language (default: device language)              |
| `theme`     | object   | No       | Custom theme configuration (light/dark)              |

### Events

The Mobile SDK emits events during the authentication flow:

| Event                 | Description                          |
| --------------------- | ------------------------------------ |
| `OPEN`                | Connection flow opened               |
| `EXIT`                | Connection flow closed               |
| `SELECT_INSTITUTION`  | User selected exchange/wallet        |
| `SUBMIT_CREDENTIALS`  | User submitted API credentials       |
| `SUCCESS`             | Authentication flow completed        |
| `ERROR`               | An error occurred                    |

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
       │                       │ access_token          │
       │◄──────────────────────┤ refresh_token         │
       │   Success             │                       │
```

### Step 1: Create Link Token

Create a link token on your backend to initialize the widget.

**Endpoint:** `POST https://connect-api.kryptos.io/link-token`

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
const axios = require('axios');

async function createLinkToken(userId) {
  const response = await axios.post(
    'https://connect-api.kryptos.io/link-token',
    {
      client_id: process.env.KRYPTOS_CLIENT_ID,
      client_secret: process.env.KRYPTOS_CLIENT_SECRET,
      scopes: 'openid profile offline_access portfolios:read transactions:read integrations:read integrations:write',
      redirect_uri: 'https://yourapp.com/callback',
      state: generateRandomState(),
      metadata: {
        user_id: userId,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': process.env.KRYPTOS_CLIENT_ID,
        'X-Client-Secret': process.env.KRYPTOS_CLIENT_SECRET,
      },
    }
  );

  return response.data.data.link_token;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import os

def create_link_token(user_id):
    response = requests.post(
        'https://connect-api.kryptos.io/link-token',
        json={
            'client_id': os.getenv('KRYPTOS_CLIENT_ID'),
            'client_secret': os.getenv('KRYPTOS_CLIENT_SECRET'),
            'scopes': 'openid profile offline_access portfolios:read transactions:read integrations:read integrations:write',
            'redirect_uri': 'https://yourapp.com/callback',
            'state': generate_random_state(),
            'metadata': {
                'user_id': user_id,
            },
        },
        headers={
            'Content-Type': 'application/json',
            'X-Client-Id': os.getenv('KRYPTOS_CLIENT_ID'),
            'X-Client-Secret': os.getenv('KRYPTOS_CLIENT_SECRET'),
        }
    )
    
    return response.json()['data']['link_token']
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
function createLinkToken($userId) {
    $ch = curl_init();
    
    $data = [
        'client_id' => getenv('KRYPTOS_CLIENT_ID'),
        'client_secret' => getenv('KRYPTOS_CLIENT_SECRET'),
        'scopes' => 'openid profile offline_access portfolios:read transactions:read integrations:read integrations:write',
        'redirect_uri' => 'https://yourapp.com/callback',
        'state' => bin2hex(random_bytes(16)),
        'metadata' => [
            'user_id' => $userId,
        ],
    ];
    
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
    return $result['data']['link_token'];
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
    "link_token": "link_abc123xyz789",
    "expires_at": "2024-01-28T10:30:00Z"
  }
}
```

### Step 2: Exchange Public Token

After the user completes authentication, exchange the public token for access and refresh tokens.

**Endpoint:** `POST https://connect-api.kryptos.io/token/exchange`

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
async function exchangePublicToken(publicToken) {
  const response = await axios.post(
    'https://connect-api.kryptos.io/token/exchange',
    {
      public_token: publicToken,
      client_id: process.env.KRYPTOS_CLIENT_ID,
      client_secret: process.env.KRYPTOS_CLIENT_SECRET,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const { access_token, refresh_token, workspace_id } = response.data.data;

  // Store tokens securely
  await storeTokens(access_token, refresh_token, workspace_id);

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
            'client_id': os.getenv('KRYPTOS_CLIENT_ID'),
            'client_secret': os.getenv('KRYPTOS_CLIENT_SECRET'),
        },
        headers={
            'Content-Type': 'application/json',
        }
    )
    
    data = response.json()['data']
    access_token = data['access_token']
    refresh_token = data['refresh_token']
    workspace_id = data['workspace_id']
    
    # Store tokens securely
    store_tokens(access_token, refresh_token, workspace_id)
    
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
        'client_id' => getenv('KRYPTOS_CLIENT_ID'),
        'client_secret' => getenv('KRYPTOS_CLIENT_SECRET'),
    ];
    
    curl_setopt_array($ch, [
        CURLOPT_URL => 'https://connect-api.kryptos.io/token/exchange',
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
        ],
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $result = json_decode($response, true);
    $data = $result['data'];
    
    // Store tokens securely
    storeTokens($data['access_token'], $data['refresh_token'], $data['workspace_id']);
    
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
    "refresh_token": "crt_abc123xyz789",
    "token_type": "Bearer",
    "expires_in": 86400,
    "scope": "openid profile offline_access portfolios:read transactions:read integrations:read integrations:write",
    "workspace_id": "uuid-workspace-123"
  }
}
```

### Step 3: Refresh Access Token

Access tokens expire after 24 hours. Use the refresh token to obtain new access tokens.

**Endpoint:** `POST https://oauth.kryptos.io/oidc/token`

:::tip Token Refresh
Always use the OIDC token endpoint for refreshing tokens to ensure compatibility with the OAuth 2.0 standard.
:::

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
async function refreshAccessToken(refreshToken) {
  const response = await axios.post(
    'https://oauth.kryptos.io/oidc/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.KRYPTOS_CLIENT_ID,
      client_secret: process.env.KRYPTOS_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const { access_token, refresh_token: new_refresh_token } = response.data;

  // Store new tokens (refresh token is rotated)
  await updateTokens(access_token, new_refresh_token);

  return response.data;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
def refresh_access_token(refresh_token):
    response = requests.post(
        'https://oauth.kryptos.io/oidc/token',
        data={
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': os.getenv('KRYPTOS_CLIENT_ID'),
            'client_secret': os.getenv('KRYPTOS_CLIENT_SECRET'),
        },
        headers={
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    )
    
    data = response.json()
    access_token = data['access_token']
    new_refresh_token = data['refresh_token']
    
    # Store new tokens (refresh token is rotated)
    update_tokens(access_token, new_refresh_token)
    
    return data
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
function refreshAccessToken($refreshToken) {
    $ch = curl_init();
    
    $data = [
        'grant_type' => 'refresh_token',
        'refresh_token' => $refreshToken,
        'client_id' => getenv('KRYPTOS_CLIENT_ID'),
        'client_secret' => getenv('KRYPTOS_CLIENT_SECRET'),
    ];
    
    curl_setopt_array($ch, [
        CURLOPT_URL => 'https://oauth.kryptos.io/oidc/token',
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/x-www-form-urlencoded',
        ],
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $result = json_decode($response, true);
    
    // Store new tokens (refresh token is rotated)
    updateTokens($result['access_token'], $result['refresh_token']);
    
    return $result;
}
?>
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST https://oauth.kryptos.io/oidc/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=YOUR_REFRESH_TOKEN" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

</TabItem>
</Tabs>

**Response:**

```json
{
  "access_token": "cat_new123xyz789",
  "refresh_token": "crt_new123xyz789",
  "token_type": "Bearer",
  "expires_in": 86400,
  "scope": "openid profile offline_access portfolios:read transactions:read integrations:read integrations:write"
}
```

:::warning Refresh Token Rotation
The refresh token is rotated with each refresh request. Always store and use the new refresh token returned in the response.
:::

### Step 4: Make API Calls

Use the access token to call Kryptos APIs:

```javascript
async function getUserHoldings(accessToken) {
  const response = await axios.get(
    'https://connect-api.kryptos.io/api/v1/holdings',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Client-Id': process.env.KRYPTOS_CLIENT_ID,
        'X-Client-Secret': process.env.KRYPTOS_CLIENT_SECRET,
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
    'https://connect-api.kryptos.io/link-token',
    {
      client_id: process.env.KRYPTOS_CLIENT_ID,
      client_secret: process.env.KRYPTOS_CLIENT_SECRET,
      scopes: 'openid profile offline_access portfolios:read transactions:read',
      access_token: existingAccessToken, // Pre-authenticate with existing token
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': process.env.KRYPTOS_CLIENT_ID,
        'X-Client-Secret': process.env.KRYPTOS_CLIENT_SECRET,
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
    'https://connect-api.kryptos.io/link-token/check-session',
    {
      access_token: accessToken,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': process.env.KRYPTOS_CLIENT_ID,
        'X-Client-Secret': process.env.KRYPTOS_CLIENT_SECRET,
      },
    }
  );

  return response.data.data;
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

:::info Future Updates
More granular scope controls will be added in the future, allowing you to request specific permissions for individual features and data types.
:::

### Core Scopes

| Scope            | Description                                |
| ---------------- | ------------------------------------------ |
| `openid`         | Required for OpenID Connect                |
| `profile`        | User profile information                   |
| `email`          | User email address                         |
| `offline_access` | Enable refresh tokens                      |

### API Scopes

| Resource      | Read Scope          | Write Scope          | Description                     |
| ------------- | ------------------- | -------------------- | ------------------------------- |
| Portfolios    | `portfolios:read`   | `portfolios:write`   | Portfolio holdings              |
| Transactions  | `transactions:read` | `transactions:write` | Transaction history             |
| Integrations  | `integrations:read` | `integrations:write` | Connected wallets and exchanges |
| DeFi          | `defi:read`         | `defi:write`         | DeFi protocol positions         |
| NFT           | `nft:read`          | `nft:write`          | NFT collections                 |
| Tax           | `tax:read`          | `tax:write`          | Tax calculations                |
| Accounting    | `accounting:read`   | `accounting:write`   | Accounting ledger               |
| Reports       | `reports:read`      | `reports:write`      | Generated reports               |
| Workspace     | `workspace:read`    | `workspace:write`    | Workspace settings              |

---

## Error Handling

### Common Errors

| Error Code               | Description                          | Solution                             |
| ------------------------ | ------------------------------------ | ------------------------------------ |
| `INVALID_CLIENT`         | Invalid client credentials           | Verify client_id and client_secret   |
| `INVALID_TOKEN`          | Token expired or invalid             | Refresh or recreate token            |
| `TOKEN_EXPIRED`          | Link or public token expired         | Create new link token                |
| `INVALID_SCOPE`          | Requested scope not allowed          | Check allowed scopes for your client |
| `INSUFFICIENT_PERMISSIONS` | User lacks required role           | User must be owner/admin             |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Handling Token Expiration

```javascript
async function makeApiCallWithRetry(endpoint, accessToken, refreshToken) {
  try {
    return await makeApiCall(endpoint, accessToken);
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired - refresh and retry
      const newTokens = await refreshAccessToken(refreshToken);
      return await makeApiCall(endpoint, newTokens.access_token);
    }
    throw error;
  }
}
```

---

## Security Best Practices

1. **Never expose secrets in frontend code** - Keep client_secret on your backend only
2. **Store tokens securely** - Use encrypted storage for access and refresh tokens
3. **Use HTTPS** - Always use secure connections in production
4. **Validate state parameters** - Prevent CSRF attacks
5. **Implement token rotation** - Refresh tokens are automatically rotated
6. **Monitor for suspicious activity** - Log and monitor authentication events
7. **Allow users to revoke access** - Provide UI to disconnect integrations

---

## Token Lifetimes

| Token Type    | Lifetime   | Rotation |
| ------------- | ---------- | -------- |
| Link Token    | 30 minutes | No       |
| Public Token  | 30 minutes | No       |
| Access Token  | 24 hours   | No       |
| Refresh Token | 30 days    | Yes      |
| Grant Token   | 1 year     | No       |

---

## Rate Limits

| Endpoint         | Limit            | Window     |
| ---------------- | ---------------- | ---------- |
| Link Token       | 10 requests      | per minute |
| Token Exchange   | 5 requests       | per minute |
| Token Refresh    | 100 requests     | per minute |
| API Calls        | 1000 requests    | per hour   |

Rate limits are per client ID. Exceeding limits returns HTTP 429 with `retry_after` header.

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
