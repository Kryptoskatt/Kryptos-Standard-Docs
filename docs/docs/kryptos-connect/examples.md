---
id: examples
title: Examples
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Examples

Complete end-to-end integrations. Each example shows both the frontend and the backend code needed for a
working flow.

:::info Prerequisites
Get your `client_id` and `client_secret` from the [Developer Portal](https://dashboard.kryptos.io/). See
the [overview](./overview) for setup.
:::

:::warning The client secret stays on your server
Every example here calls Kryptos through **your own backend**. The client secret must never reach
frontend code, a mobile bundle, or a public repository — anyone holding it can mint link tokens against
your client. The frontend's only job is to fetch a link token from an endpoint you control.
:::

---

## Full-Stack Web Integration

A complete React + Express integration showing the flow from widget to data access.

### Backend (Express.js)

```javascript
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const CONNECT_URL = "https://connect-api.kryptos.io";
const API_URL = "https://api-v2.kryptos.io";

const clientHeaders = {
  "Content-Type": "application/json",
  "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
  "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
};

// Step 1: Create a link token
app.post("/api/kryptos/create-link-token", async (req, res) => {
  try {
    const existingAccessToken = await getUserAccessToken(req.user?.id);

    const payload = {
      scopes:
        "openid profile offline_access email portfolios:read transactions:read integrations:read",
    };
    if (existingAccessToken) payload.access_token = existingAccessToken;

    const response = await axios.post(`${CONNECT_URL}/link-token`, payload, {
      headers: clientHeaders,
    });

    // `has_existing_grant` is only present when a valid access_token was supplied and
    // accepted — an expired token silently yields a plain link token, so read the
    // response rather than assuming the token still worked.
    res.json({
      link_token: response.data.data.link_token,
      isAuthorized: !!response.data.data.has_existing_grant,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create link token" });
  }
});

// Step 2: Exchange the public token for an access token
app.post("/api/kryptos/exchange-token", async (req, res) => {
  try {
    const { public_token } = req.body;

    const response = await axios.post(
      `${CONNECT_URL}/token/exchange`,
      { public_token },
      { headers: clientHeaders },
    );

    const { access_token, grant_id, workspace_id, scope } = response.data.data;

    // Store the grant_id — it is the only handle for revoking access later.
    await saveUserTokens(req.user.id, {
      access_token,
      grant_id,
      workspace_id,
      scope,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to exchange token" });
  }
});

// Step 3: Fetch holdings
app.get("/api/kryptos/holdings", async (req, res) => {
  try {
    const accessToken = await getUserAccessToken(req.user.id);

    // The workspace is in the token, so no workspace parameter is needed.
    const response = await axios.get(`${API_URL}/v1/holdings`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

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
import { useEffect } from "react";
import { KryptosConnect, KryptosConnectButton } from "@kryptos_connect/web-sdk";

function App() {
  useEffect(() => {
    KryptosConnect.init({
      clientId: process.env.REACT_APP_KRYPTOS_CLIENT_ID!,
      appName: "My DeFi App",
      appLogo: "https://yourapp.com/logo.png",
      theme: "light",
      language: "en",
      authMethods: ["email", "anonymous"],
    });
  }, []);

  return <Dashboard />;
}

function Dashboard() {
  return (
    <KryptosConnectButton
      generateLinkToken={async () => {
        // Calls YOUR backend — the client secret never leaves the server.
        const response = await fetch("/api/kryptos/create-link-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        return response.json(); // { link_token, isAuthorized }
      }}
      onConnectSuccess={(consent) => {
        // consent is null for a returning user who skipped consent —
        // there is nothing to exchange in that case.
        if (consent?.public_token) {
          fetch("/api/kryptos/exchange-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_token: consent.public_token }),
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

`KryptosConnect.init` is called once at startup, and `generateLinkToken` must resolve to
`{ link_token, isAuthorized }` — a bare string will not work.

---

## Next.js App Router

### Root layout (`app/layout.tsx`)

```tsx
import KryptosInit from "./kryptos-init";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <KryptosInit />
        {children}
      </body>
    </html>
  );
}
```

### Init component (`app/kryptos-init.tsx`)

```tsx
"use client";
import { useEffect } from "react";
import { KryptosConnect } from "@kryptos_connect/web-sdk";

export default function KryptosInit() {
  useEffect(() => {
    KryptosConnect.init({
      clientId: process.env.NEXT_PUBLIC_KRYPTOS_CLIENT_ID!,
      appName: "My Next.js App",
      theme: "light",
      language: "en",
    });
  }, []);

  return null;
}
```

`init` touches browser APIs, so it belongs in a client component — calling it during server rendering
will fail.

### API route (`app/api/kryptos/link-token/route.ts`)

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
        "openid profile offline_access email portfolios:read transactions:read integrations:read",
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    link_token: data.data.link_token,
    isAuthorized: !!data.data.has_existing_grant,
  });
}
```

Note the env var has **no `NEXT_PUBLIC_` prefix** — that prefix would ship the secret to the browser.

### API route (`app/api/kryptos/exchange/route.ts`)

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

  // Store access_token and grant_id against your user
  // await db.user.update({ kryptosToken: data.data.access_token, kryptosGrantId: data.data.grant_id });

  return NextResponse.json({ success: true });
}
```

### Page component (`app/page.tsx`)

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
      onConnectSuccess={(consent) => {
        if (consent?.public_token) {
          fetch("/api/kryptos/exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_token: consent.public_token }),
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

Dedicated buttons for specific exchanges and wallets, skipping the picker.

```tsx
import { KryptosConnectButton } from "@kryptos_connect/web-sdk";

function IntegrationButtons({ generateLinkToken, onConnectSuccess }) {
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
          onConnectSuccess={onConnectSuccess}
        >
          {label}
        </KryptosConnectButton>
      ))}
    </div>
  );
}
```

:::info
`integrationName` must match a provider `id` from [`GET /v1/providers`](/docs/api/providers). An invalid
id results in an error.
:::

---

## Mobile Integration (React Native)

```tsx
import { useEffect } from "react";
import {
  KryptosConnect,
  KryptosConnectButton,
} from "@kryptos_connect/mobile-sdk";

export default function App() {
  useEffect(() => {
    KryptosConnect.init({
      clientId: "your-kryptos-client-id",
      appName: "My Mobile App",
      appLogo: "https://yourapp.com/logo.png",
      theme: "light",
      language: "en",
      authMethods: ["email", "anonymous"],
    });
  }, []);

  return <ConnectScreen />;
}

function ConnectScreen() {
  const generateLinkToken = async () => {
    const response = await fetch(
      "https://your-api.com/api/kryptos/create-link-token",
      { method: "POST", headers: { "Content-Type": "application/json" } },
    );
    // Must be { link_token, isAuthorized } — not a bare string.
    return response.json();
  };

  const handleConnectSuccess = (consent) => {
    if (consent?.public_token) {
      fetch("https://your-api.com/api/kryptos/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_token: consent.public_token }),
      });
    }
  };

  return (
    <KryptosConnectButton
      generateLinkToken={generateLinkToken}
      onConnectSuccess={handleConnectSuccess}
      onConnectError={() => console.log("Connection failed")}
      buttonLabel="Connect to Kryptos"
      buttonHeight={52}
    />
  );
}
```

The mobile SDK's only peer dependency is `react-native-webview`. No WalletConnect or crypto-polyfill
imports are needed.

---

## Session Management Lifecycle

Handling new users, returning users, and disconnection.

```javascript
const axios = require("axios");

const CONNECT_URL = "https://connect-api.kryptos.io";
const headers = {
  "Content-Type": "application/json",
  "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
  "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
};

// Does this user still have a working session?
async function checkSession(accessToken) {
  const response = await axios.post(
    `${CONNECT_URL}/link-token/check-session`,
    { access_token: accessToken },
    { headers },
  );
  return response.data.data; // { has_valid_session, workspace_id, granted_scopes, ... }
}

// Create a link token — handles both new and returning users
async function createLinkToken(existingAccessToken) {
  const payload = {
    scopes:
      "openid profile offline_access email portfolios:read transactions:read integrations:read",
  };
  if (existingAccessToken) payload.access_token = existingAccessToken;

  const response = await axios.post(`${CONNECT_URL}/link-token`, payload, {
    headers,
  });

  return {
    link_token: response.data.data.link_token,
    isAuthorized: !!response.data.data.has_existing_grant,
  };
}

// Exchange a public token
async function exchangeToken(publicToken) {
  const response = await axios.post(
    `${CONNECT_URL}/token/exchange`,
    { public_token: publicToken },
    { headers },
  );
  return response.data.data; // { access_token, grant_id, workspace_id, scope }
}

// Revoke access
async function revokeAccess(grantId) {
  const response = await axios.post(
    `${CONNECT_URL}/token/revoke`,
    { grant_id: grantId },
    { headers },
  );
  return response.data;
}

// List active grants
async function listGrants() {
  const response = await axios.get(`${CONNECT_URL}/token/grants`, { headers });
  return response.data.data.grants;
}
```

---

## Error Handling Middleware

```javascript
function kryptosErrorHandler(error, req, res, next) {
  if (!error.response) {
    return res.status(500).json({ error: "Network error" });
  }

  const { status, data } = error.response;

  // Connect session errors carry `code`; data-API errors carry `error` /
  // `error_description`. Handle both.
  switch (data?.code) {
    case "INVALID_CLIENT":
      console.error("Bad client credentials — check KRYPTOS_CLIENT_ID and KRYPTOS_CLIENT_SECRET");
      return res.status(500).json({ error: "Configuration error" });

    case "INVALID_TOKEN":
    case "TOKEN_EXPIRED":
    case "INVALID_GRANT":
      return res.status(401).json({
        error: "Access expired. Please reconnect your account.",
        requiresReconnect: true,
      });

    case "TOKEN_ALREADY_USED":
      // Public tokens are single-use. Restart the widget flow.
      return res.status(400).json({ error: "Token already used. Please try again." });

    case "INVALID_SCOPE":
      return res.status(403).json({ error: "Insufficient permissions" });

    case "OTP_NOT_REQUESTED":
    case "EMAIL_MISMATCH":
    case "INVALID_OTP":
      return res.status(400).json({ error: "Verification failed. Request a new code." });

    case "NOT_ANON_USER":
      // Transaction limits apply only to Guest users.
      return res.status(400).json({ error: "This user is not a Guest account." });
  }

  // Data-API errors
  if (data?.error === "insufficient_scope") {
    return res.status(403).json({
      error: `Missing permission: ${data.error_description}`,
      requiresReconnect: true,
    });
  }

  return res.status(status || 500).json({ error: data?.error || "Unknown error" });
}

// Usage: app.use(kryptosErrorHandler);
```

`insufficient_scope` means the grant is valid but too narrow — the user must re-authorize with the extra
scope, so treat it like a reconnect rather than a hard failure.

---

## Next Steps

- **[Overview](./overview)** — Scopes, tokens, Guest vs Linked
- **[Web SDK](./web-sdk)** — Web SDK configuration
- **[Mobile SDK](./mobile-sdk)** — Mobile SDK configuration
- **[Backend](./backend)** — Backend API reference
