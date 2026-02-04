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

The Kryptos Connect Web SDK provides React components that handle the complete authentication and wallet connection flow. It supports 5000+ DeFi protocols, 100+ exchanges/wallets, and 200+ blockchains.

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
</Tabs>

### Prerequisites

1. **Client ID** from the [Kryptos Developer Portal](https://dashboard.kryptos.io)
2. **WalletConnect Project ID** from [WalletConnect Cloud](https://cloud.walletconnect.com)

### Quick Start

```tsx
// 1. Import styles (required)
import "@kryptos_connect/web-sdk/dist/styles/index.css";

import {
  KryptosConnectProvider,
  KryptosConnectButton,
} from "@kryptos_connect/web-sdk";

// 2. Wrap your app with the provider
function App() {
  return (
    <KryptosConnectProvider
      config={{
        appName: "My DeFi App",
        appLogo: "https://yourapp.com/logo.png",
        clientId: "your-kryptos-client-id",
        theme: "light",
        walletConnectProjectId: "your-walletconnect-project-id",
      }}
    >
      <ConnectButton />
    </KryptosConnectProvider>
  );
}

// 3. Use the connect button
function ConnectButton() {
  return (
    <KryptosConnectButton
      generateLinkToken={async () => {
        // Call your backend to create a link token
        const response = await fetch("/api/kryptos/create-link-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        return {
          link_token: data.link_token,
          isAuthorized: data.isAuthorized,
        };
      }}
      onSuccess={(userConsent) => {
        if (userConsent?.public_token) {
          // New user - exchange public token for access token
          fetch("/api/kryptos/exchange-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_token: userConsent.public_token }),
          });
        }
        // If userConsent is null, user was already authenticated
      }}
      onError={(error) => {
        console.error("Connection failed:", error);
      }}
    >
      Connect to Kryptos
    </KryptosConnectButton>
  );
}
```

### Provider Configuration

Wrap your application with `KryptosConnectProvider`:

| Option                   | Type                         | Required | Description                              |
| ------------------------ | ---------------------------- | -------- | ---------------------------------------- |
| `appName`                | string                       | Yes      | Your application name                    |
| `appLogo`                | string \| React.ReactNode    | No       | Logo URL or React component              |
| `clientId`               | string                       | Yes      | Kryptos client ID from Developer Portal  |
| `theme`                  | `"light"` \| `"dark"`        | No       | Visual theme (default: `"light"`)        |
| `walletConnectProjectId` | string                       | Yes      | WalletConnect project ID                 |

### Button Configuration

The `KryptosConnectButton` component triggers the connection flow:

| Option              | Type                                                              | Required | Description                                           |
| ------------------- | ----------------------------------------------------------------- | -------- | ----------------------------------------------------- |
| `generateLinkToken` | `() => Promise<{ link_token: string; isAuthorized?: boolean }>`   | Yes      | Function that returns link token from your backend    |
| `onSuccess`         | `(userConsent: UserConsent \| null) => void`                      | No       | Callback on successful connection                     |
| `onError`           | `(error: Error) => void`                                          | No       | Callback on connection failure                        |
| `children`          | React.ReactNode                                                   | No       | Button text (default: "Connect to Kryptos")           |
| `className`         | string                                                            | No       | Custom CSS class                                      |
| `style`             | React.CSSProperties                                               | No       | Inline styles                                         |

### TypeScript Support

```typescript
import type {
  KryptosConnectButtonProps,
  KryptosConnectProviderProps,
  UserConsent,
} from "@kryptos_connect/web-sdk";

interface UserConsent {
  public_token: string;
}
```

### Customization

#### CSS Variables

```css
:root {
  --kc-primary: #8b5cf6;
  --kc-primary-hover: #7c3aed;
  --kc-bg-primary: #ffffff;
  --kc-text-primary: #000000;
  --kc-border: #e5e7eb;
  --kc-border-radius: 8px;
}

[data-kc-theme="dark"] {
  --kc-bg-primary: #1a1a1a;
  --kc-text-primary: #ffffff;
  --kc-border: #404040;
}
```

#### Custom Button Styling

```tsx
<KryptosConnectButton
  className="my-custom-button"
  style={{
    background: "linear-gradient(to right, #667eea, #764ba2)",
    borderRadius: "12px",
  }}
>
  Connect Wallet
</KryptosConnectButton>
```

### Framework Integration

#### Next.js (App Router)

```tsx
// app/layout.tsx
import { KryptosConnectProvider } from "@kryptos_connect/web-sdk";
import "@kryptos_connect/web-sdk/dist/styles/index.css";

const config = {
  appName: "My Next.js App",
  clientId: process.env.NEXT_PUBLIC_KRYPTOS_CLIENT_ID!,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  theme: "light" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KryptosConnectProvider config={config}>
          {children}
        </KryptosConnectProvider>
      </body>
    </html>
  );
}
```

#### React (Vite/CRA)

```tsx
// main.tsx
import ReactDOM from "react-dom/client";
import { KryptosConnectProvider } from "@kryptos_connect/web-sdk";
import "@kryptos_connect/web-sdk/dist/styles/index.css";
import App from "./App";

const config = {
  appName: "My React App",
  clientId: import.meta.env.VITE_KRYPTOS_CLIENT_ID,
  walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  theme: "light" as const,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <KryptosConnectProvider config={config}>
    <App />
  </KryptosConnectProvider>
);
```

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Peer Dependencies

- React >= 16.8.0
- React DOM >= 16.8.0

---

## Mobile SDK

The Kryptos Connect Mobile SDK provides React Native components for iOS and Android applications. It works with both Expo and React Native CLI.

### Installation

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install @kryptos_connect/mobile-sdk react-native-svg
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add @kryptos_connect/mobile-sdk react-native-svg
```

</TabItem>
<TabItem value="expo" label="Expo">

```bash
npx expo install @kryptos_connect/mobile-sdk react-native-svg
```

</TabItem>
</Tabs>

### Core Dependencies

Install all required dependencies:

```bash
npx expo install @reown/appkit-react-native @react-native-async-storage/async-storage \
  react-native-get-random-values react-native-svg @react-native-community/netinfo \
  @walletconnect/react-native-compat react-native-safe-area-context expo-application
```

### Platform Setup

**iOS (React Native CLI only):**

```bash
cd ios && pod install
```

**Expo SDK 53+** - Add to `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
  };
};
```

### Quick Start

```tsx
import { KryptosConnectProvider, KryptosConnectButton } from "@kryptos_connect/mobile-sdk";

// 1. Wrap your app with the provider
export default function App() {
  return (
    <KryptosConnectProvider
      config={{
        appName: "My Mobile App",
        appLogo: "https://yourapp.com/logo.png",
        clientId: "your-kryptos-client-id",
        theme: "light",
        walletConnectProjectId: "your-walletconnect-project-id",
      }}
    >
      <ConnectScreen />
    </KryptosConnectProvider>
  );
}

// 2. Use the connect button
function ConnectScreen() {
  const generateLinkToken = async () => {
    const response = await fetch("https://your-api.com/api/kryptos/create-link-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data.link_token;
  };

  const handleSuccess = (userConsent) => {
    if (userConsent?.public_token) {
      // Exchange public token for access token
      fetch("https://your-api.com/api/kryptos/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_token: userConsent.public_token }),
      });
    }
  };

  return (
    <KryptosConnectButton
      generateLinkToken={generateLinkToken}
      onSuccess={handleSuccess}
      onError={() => console.log("Connection failed")}
    >
      Connect to Kryptos
    </KryptosConnectButton>
  );
}
```

### Provider Configuration

| Option                   | Type                         | Required | Description                              |
| ------------------------ | ---------------------------- | -------- | ---------------------------------------- |
| `appName`                | string                       | Yes      | Your application name                    |
| `appLogo`                | string \| ReactNode          | No       | Logo URL or image source                 |
| `clientId`               | string                       | Yes      | Kryptos client ID from Developer Portal  |
| `theme`                  | `"light"` \| `"dark"`        | No       | UI theme (default: `"light"`)            |
| `walletConnectProjectId` | string                       | No       | WalletConnect v2 project ID              |

### Button Configuration

| Option              | Type                                    | Required | Description                                |
| ------------------- | --------------------------------------- | -------- | ------------------------------------------ |
| `generateLinkToken` | `() => Promise<string>`                 | Yes      | Function that returns link token           |
| `onSuccess`         | `(userConsent: UserConsent) => void`    | No       | Callback on successful connection          |
| `onError`           | `() => void`                            | No       | Callback on connection failure             |
| `children`          | ReactNode                               | No       | Custom button content                      |
| `style`             | ViewStyle                               | No       | Container styling                          |
| `textStyle`         | TextStyle                               | No       | Text styling                               |

### Custom Button Styling

```tsx
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  onSuccess={handleSuccess}
  onError={handleError}
  style={{ backgroundColor: '#8b5cf6', borderRadius: 12, padding: 16 }}
  textStyle={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}
>
  Connect Wallet
</KryptosConnectButton>
```

### Using KryptosConnectModal

For advanced use cases, use the modal component directly:

```tsx
import { KryptosConnectModal } from "@kryptos_connect/mobile-sdk";
import { useState } from "react";
import { TouchableOpacity, Text } from "react-native";

function ConnectScreen() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Text>Open Connection Modal</Text>
      </TouchableOpacity>
      <KryptosConnectModal
        open={open}
        setOpen={setOpen}
        generateLinkToken={generateLinkToken}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  );
}
```

### WalletConnect Integration

To enable WalletConnect v2 functionality, add the required imports at your app entry point:

```tsx
// App.tsx or index.js - add these imports at the top
import "@walletconnect/react-native-compat";
import "react-native-get-random-values";

import { KryptosConnectProvider } from "@kryptos_connect/mobile-sdk";

const config = {
  appName: "Your App",
  appLogo: "https://your-logo.png",
  clientId: "your-kryptos-client-id",
  walletConnectProjectId: "your-walletconnect-project-id", // Required for WalletConnect
};

export default function App() {
  return (
    <KryptosConnectProvider config={config}>
      <YourApp />
    </KryptosConnectProvider>
  );
}
```

### Platform Requirements

| Platform      | Minimum Version        |
| ------------- | ---------------------- |
| iOS           | 12.0+                  |
| Android       | API 21+ (Android 5.0+) |
| React Native  | 0.60+                  |
| Expo SDK      | 48+                    |

### Features

- **Cross-Platform:** Single codebase for iOS and Android
- **Expo Support:** Works with Expo and React Native CLI
- **WalletConnect v2:** Built-in WalletConnect integration
- **Dark Mode:** Light and dark theme support
- **TypeScript:** Full TypeScript support

### Package Information

- **NPM Package:** [@kryptos_connect/mobile-sdk](https://www.npmjs.com/package/@kryptos_connect/mobile-sdk)
- **GitHub:** [Kryptoskatt/kryptos-connect-mobile-package](https://github.com/Kryptoskatt/kryptos-connect-mobile-package)

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

Create a link token endpoint on your backend that the Web SDK's `generateLinkToken` function will call.

**Endpoint:** `POST https://connect-api.kryptos.io/link-token`

**Authentication:** Client credentials via `X-Client-Id` and `X-Client-Secret` headers

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const KRYPTOS_BASE_URL = "https://connect-api.kryptos.io";

// Endpoint for the Web SDK's generateLinkToken function
app.post("/api/kryptos/create-link-token", async (req, res) => {
  try {
    // Check if user has an existing access token stored
    const existingAccessToken = await getUserAccessToken(req.user?.id);

    const payload = {
      scopes:
        "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
    };

    // If user has existing token, include it to skip authentication
    if (existingAccessToken) {
      payload.access_token = existingAccessToken;
    }

    const response = await axios.post(
      `${KRYPTOS_BASE_URL}/link-token`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
          "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
        },
      }
    );

    // Return format expected by Web SDK's generateLinkToken
    res.json({
      link_token: response.data.data.link_token,
      isAuthorized: !!existingAccessToken, // true = skip auth, false = full flow
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create link token" });
  }
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

KRYPTOS_BASE_URL = "https://connect-api.kryptos.io"

@app.route("/api/kryptos/create-link-token", methods=["POST"])
def create_link_token():
    try:
        # Check if user has an existing access token stored
        existing_access_token = get_user_access_token(request.user_id)

        payload = {
            "scopes": "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
        }

        # If user has existing token, include it to skip authentication
        if existing_access_token:
            payload["access_token"] = existing_access_token

        response = requests.post(
            f"{KRYPTOS_BASE_URL}/link-token",
            json=payload,
            headers={
                "Content-Type": "application/json",
                "X-Client-Id": os.getenv("KRYPTOS_CLIENT_ID"),
                "X-Client-Secret": os.getenv("KRYPTOS_CLIENT_SECRET"),
            },
        )

        data = response.json()["data"]

        # Return format expected by Web SDK's generateLinkToken
        return jsonify({
            "link_token": data["link_token"],
            "isAuthorized": bool(existing_access_token),
        })
    except Exception as e:
        return jsonify({"error": "Failed to create link token"}), 500
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
header('Content-Type: application/json');

$KRYPTOS_BASE_URL = 'https://connect-api.kryptos.io';

// Check if user has an existing access token stored
$existingAccessToken = getUserAccessToken($userId);

$payload = [
    'scopes' => 'openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read',
];

// If user has existing token, include it to skip authentication
if ($existingAccessToken) {
    $payload['access_token'] = $existingAccessToken;
}

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $KRYPTOS_BASE_URL . '/link-token',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
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

// Return format expected by Web SDK's generateLinkToken
echo json_encode([
    'link_token' => $result['data']['link_token'],
    'isAuthorized' => !empty($existingAccessToken),
]);
?>
```

</TabItem>
</Tabs>

**Your Backend Response (for Web SDK):**

```json
{
  "link_token": "link_abc123xyz789",
  "isAuthorized": false
}
```

**Kryptos API Response (Fresh Session):**

```json
{
  "success": true,
  "data": {
    "link_token": "link_abc123xyz789",
    "expires_at": "2024-01-28T10:30:00Z"
  }
}
```

**Kryptos API Response (Session Resumed with `access_token`):**

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

Create an endpoint to exchange the public token for a long-lived access token. The Web SDK's `onSuccess` callback will send the `public_token` to this endpoint.

**Endpoint:** `POST https://connect-api.kryptos.io/token/exchange`

**Authentication:** Client credentials via headers

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Endpoint for the Web SDK's onSuccess callback
app.post("/api/kryptos/exchange-token", async (req, res) => {
  try {
    const { public_token } = req.body;

    const response = await axios.post(
      `${KRYPTOS_BASE_URL}/token/exchange`,
      { public_token },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
          "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
        },
      }
    );

    const { access_token, grant_id, workspace_id } = response.data.data;

    // Store tokens securely for the user
    await saveUserTokens(req.user.id, {
      access_token,
      grant_id,
      workspace_id,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to exchange token" });
  }
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
@app.route("/api/kryptos/exchange-token", methods=["POST"])
def exchange_token():
    try:
        public_token = request.json.get("public_token")

        response = requests.post(
            f"{KRYPTOS_BASE_URL}/token/exchange",
            json={"public_token": public_token},
            headers={
                "Content-Type": "application/json",
                "X-Client-Id": os.getenv("KRYPTOS_CLIENT_ID"),
                "X-Client-Secret": os.getenv("KRYPTOS_CLIENT_SECRET"),
            },
        )

        data = response.json()["data"]

        # Store tokens securely for the user
        save_user_tokens(
            request.user_id,
            access_token=data["access_token"],
            grant_id=data["grant_id"],
            workspace_id=data["workspace_id"],
        )

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": "Failed to exchange token"}), 500
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$publicToken = $input['public_token'];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'https://connect-api.kryptos.io/token/exchange',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode(['public_token' => $publicToken]),
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

// Store tokens securely for the user
saveUserTokens($userId, [
    'access_token' => $data['access_token'],
    'grant_id' => $data['grant_id'],
    'workspace_id' => $data['workspace_id'],
]);

echo json_encode(['success' => true]);
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

To upgrade to production mode with full access to all chains and addresses, contact us:

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)

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

---

## Next Steps

1. **[Set up OAuth 2.0](/authentication/oauth)** - Configure full OAuth flow
2. **[Explore API Endpoints](/api/holdings)** - Browse available APIs
3. **[View Type Definitions](/reference/types)** - TypeScript types for API responses
