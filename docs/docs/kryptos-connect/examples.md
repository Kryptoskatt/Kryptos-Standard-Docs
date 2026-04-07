---
id: examples
title: Examples
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Examples

Complete end-to-end integration examples for Kryptos Connect. Each example shows both the frontend and backend code needed for a working integration.

:::info Prerequisites
Before following these examples, make sure you have your `client_id` and `client_secret` from the [Developer Portal](https://dashboard.kryptos.io/). See the [overview](./overview) for setup instructions.
:::

---

## Full-Stack Web Integration

A complete React + Express integration showing the entire flow from widget to data access.

### Backend (Express.js)

```javascript
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const KRYPTOS_BASE_URL = "https://connect-api.kryptos.io";

// Step 1: Create link token
app.post("/api/kryptos/create-link-token", async (req, res) => {
  try {
    const existingAccessToken = await getUserAccessToken(req.user?.id);

    const payload = {
      scopes:
        "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
    };

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
      },
    );

    res.json({
      link_token: response.data.data.link_token,
      isAuthorized: !!existingAccessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create link token" });
  }
});

// Step 2: Exchange public token for access token
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
      },
    );

    const { access_token, grant_id, workspace_id } = response.data.data;

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

// Step 3: Fetch user holdings
app.get("/api/kryptos/holdings", async (req, res) => {
  try {
    const accessToken = await getUserAccessToken(req.user.id);

    const response = await axios.get(
      "https://connect.kryptos.io/api/v1/holdings",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
          "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      res.status(401).json({ error: "Access revoked. Please reconnect." });
    } else {
      res.status(500).json({ error: "Failed to fetch holdings" });
    }
  }
});

app.listen(3000);
```

### Frontend (React)

```tsx
import "@kryptos_connect/web-sdk/dist/styles/index.css";
import {
  KryptosConnectProvider,
  KryptosConnectButton,
} from "@kryptos_connect/web-sdk";

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
      <Dashboard />
    </KryptosConnectProvider>
  );
}

function Dashboard() {
  return (
    <KryptosConnectButton
      generateLinkToken={async () => {
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
      onConnectSuccess={(userConsent) => {
        if (userConsent?.public_token) {
          fetch("/api/kryptos/exchange-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_token: userConsent.public_token }),
          });
        }
      }}
      onConnectError={(error) => {
        console.error("Connection failed:", error);
      }}
    >
      Connect to Kryptos
    </KryptosConnectButton>
  );
}
```

---

## Next.js App Router

A complete Next.js integration using the App Router with server-side token management.

### Layout (`app/layout.tsx`)

```tsx
import { KryptosConnectProvider } from "@kryptos_connect/web-sdk";
import "@kryptos_connect/web-sdk/dist/styles/index.css";

const config = {
  appName: "My Next.js App",
  clientId: process.env.NEXT_PUBLIC_KRYPTOS_CLIENT_ID!,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  theme: "light" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

### API Route (`app/api/kryptos/link-token/route.ts`)

```typescript
import { NextResponse } from "next/server";

export async function POST() {
  const response = await fetch("https://connect-api.kryptos.io/link-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Id": process.env.KRYPTOS_CLIENT_ID!,
      "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET!,
    },
    body: JSON.stringify({
      scopes:
        "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read",
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    link_token: data.data.link_token,
    isAuthorized: false,
  });
}
```

### API Route (`app/api/kryptos/exchange/route.ts`)

```typescript
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { public_token } = await request.json();

  const response = await fetch(
    "https://connect-api.kryptos.io/token/exchange",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID!,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET!,
      },
      body: JSON.stringify({ public_token }),
    },
  );

  const data = await response.json();

  // Store access_token and grant_id in your database
  // await db.user.update({ kryptosToken: data.data.access_token });

  return NextResponse.json({ success: true });
}
```

### Page Component (`app/page.tsx`)

```tsx
"use client";
import { KryptosConnectButton } from "@kryptos_connect/web-sdk";

export default function Home() {
  return (
    <KryptosConnectButton
      generateLinkToken={async () => {
        const res = await fetch("/api/kryptos/link-token", { method: "POST" });
        return res.json();
      }}
      onConnectSuccess={(userConsent) => {
        if (userConsent?.public_token) {
          fetch("/api/kryptos/exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_token: userConsent.public_token }),
          });
        }
      }}
    >
      Connect Wallet
    </KryptosConnectButton>
  );
}
```

---

## Direct Integration Buttons

Create dedicated buttons for specific exchanges and wallets, bypassing the general selection screen.

```tsx
import { KryptosConnectButton } from "@kryptos_connect/web-sdk";

function IntegrationButtons({ generateLinkToken, onSuccess }) {
  const integrations = [
    { id: "binance", label: "Connect Binance" },
    { id: "coinbase", label: "Connect Coinbase" },
    { id: "metamask", label: "Connect MetaMask" },
    { id: "kraken", label: "Connect Kraken" },
  ];

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      {integrations.map(({ id, label }) => (
        <KryptosConnectButton
          key={id}
          generateLinkToken={generateLinkToken}
          integrationName={id}
          onConnectSuccess={onSuccess}
        >
          {label}
        </KryptosConnectButton>
      ))}
    </div>
  );
}
```

:::info
The `integrationName` value must match an integration ID from the [supported providers list](/docs/public-endpoints/integrations). An invalid ID will result in an error.
:::

---

## Mobile Integration (React Native)

A complete React Native example with Expo.

```tsx
import "@walletconnect/react-native-compat";
import "react-native-get-random-values";

import {
  KryptosConnectProvider,
  KryptosConnectButton,
} from "@kryptos_connect/mobile-sdk";

const config = {
  appName: "My Mobile App",
  appLogo: "https://yourapp.com/logo.png",
  clientId: "your-kryptos-client-id",
  theme: "light",
  walletConnectProjectId: "your-walletconnect-project-id",
};

export default function App() {
  return (
    <KryptosConnectProvider config={config}>
      <ConnectScreen />
    </KryptosConnectProvider>
  );
}

function ConnectScreen() {
  const generateLinkToken = async () => {
    const response = await fetch(
      "https://your-api.com/api/kryptos/create-link-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await response.json();
    return data.link_token;
  };

  const handleSuccess = (userConsent) => {
    if (userConsent?.public_token) {
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

---

## Session Management Lifecycle

Complete example showing how to handle new users, returning users, and disconnection.

```javascript
const axios = require("axios");

const KRYPTOS_BASE_URL = "https://connect-api.kryptos.io";
const headers = {
  "Content-Type": "application/json",
  "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
  "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
};

// Check if user has a valid session
async function checkSession(accessToken) {
  const response = await axios.post(
    `${KRYPTOS_BASE_URL}/link-token/check-session`,
    { access_token: accessToken },
    { headers },
  );
  return response.data.data;
}

// Create link token (handles both new and returning users)
async function createLinkToken(existingAccessToken) {
  const payload = {
    scopes:
      "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
  };

  if (existingAccessToken) {
    payload.access_token = existingAccessToken;
  }

  const response = await axios.post(
    `${KRYPTOS_BASE_URL}/link-token`,
    payload,
    { headers },
  );

  return {
    link_token: response.data.data.link_token,
    isAuthorized: !!existingAccessToken,
  };
}

// Exchange public token for access token
async function exchangeToken(publicToken) {
  const response = await axios.post(
    `${KRYPTOS_BASE_URL}/token/exchange`,
    { public_token: publicToken },
    { headers },
  );
  return response.data.data; // { access_token, grant_id, workspace_id }
}

// Revoke a user's access
async function revokeAccess(grantId) {
  const response = await axios.post(
    `${KRYPTOS_BASE_URL}/token/revoke`,
    { grant_id: grantId },
    { headers },
  );
  return response.data;
}

// List all active grants
async function listGrants() {
  const response = await axios.get(
    `${KRYPTOS_BASE_URL}/token/grants`,
    { headers },
  );
  return response.data.data.grants;
}
```

---

## Error Handling Middleware

A reusable pattern for handling Kryptos API errors in Express.

```javascript
function kryptosErrorHandler(error, req, res, next) {
  if (!error.response) {
    return res.status(500).json({ error: "Network error" });
  }

  const { status, data } = error.response;

  switch (data?.code) {
    case "INVALID_CLIENT":
      console.error("Invalid client credentials - check KRYPTOS_CLIENT_ID and KRYPTOS_CLIENT_SECRET");
      return res.status(500).json({ error: "Configuration error" });

    case "INVALID_TOKEN":
    case "TOKEN_EXPIRED":
    case "INVALID_GRANT":
      // User needs to re-authenticate
      return res.status(401).json({
        error: "Access expired. Please reconnect your account.",
        requiresReconnect: true,
      });

    case "TOKEN_ALREADY_USED":
      return res.status(400).json({ error: "Token already used. Please try again." });

    case "INVALID_SCOPE":
      return res.status(403).json({ error: "Insufficient permissions" });

    case "SANDBOX_PROVIDER_NOT_ALLOWED":
    case "SANDBOX_ADDRESS_NOT_ALLOWED":
      return res.status(400).json({
        error: "Not available in sandbox mode. Contact support@kryptos.io for production access.",
      });

    default:
      return res.status(status || 500).json({ error: data?.error || "Unknown error" });
  }
}

// Usage: app.use(kryptosErrorHandler);
```

---

## Next Steps

- **[Overview](./overview)** - Scopes, tokens, sandbox mode reference
- **[Web SDK](./web-sdk)** - Detailed Web SDK configuration
- **[Mobile SDK](./mobile-sdk)** - Detailed Mobile SDK configuration
- **[Backend](./backend)** - Complete backend API reference
