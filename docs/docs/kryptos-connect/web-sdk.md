---
id: web-sdk
title: Web SDK
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Kryptos Connect Web SDK provides React components that handle the complete authentication and wallet connection flow. It supports 5000+ DeFi protocols, 100+ exchanges/wallets, and 200+ blockchains.

:::info Before you begin
Make sure you have completed the prerequisites outlined in the [overview](./overview) and set up your server-side integration following the [backend](./backend) guide.
:::

## Installation

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

## Prerequisites

1. **Client ID** from the [Kryptos Developer Portal](https://dashboard.kryptos.io)
2. **WalletConnect Project ID** from [WalletConnect Cloud](https://cloud.walletconnect.com)

## Quick Start

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
      onConnectSuccess={(userConsent) => {
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
      onConnectError={(error) => {
        console.error("Connection failed:", error);
      }}
    >
      Connect to Kryptos
    </KryptosConnectButton>
  );
}
```

## User Flow Variations

The SDK automatically handles two different user flows based on the `isAuthorized` flag returned from `generateLinkToken`:

### Flow 1: New User (`isAuthorized: false` or undefined)

```
INIT → CONNECT → INTEGRATION → STATUS
```

- User goes through authentication (controlled by `authMethods` prop)
  - **Email Login:** Enter email → receive OTP → verify OTP
  - **Anonymous:** proceed without credentials
- Account is created on the backend
- User selects integrations to connect
- Returns `public_token` in `onConnectSuccess` callback

**When to use:** First-time users or users without an existing access token.

### Flow 2: Authenticated User (`isAuthorized: true`)

```
INIT → INTEGRATION → STATUS
```

- Skips authentication (account already exists on the backend)
- User directly selects integrations
- Returns `null` in `onConnectSuccess` callback (no new token needed)

**When to use:** Returning users with a stored access token who want to add more integrations.

**Implementation Example:**

```tsx
generateLinkToken={async () => {
  const user = getCurrentUser(); // Your auth logic

  const response = await fetch("/api/kryptos/create-link-token", {
    method: "POST",
    body: JSON.stringify({
      // Include access_token if user is logged in
      access_token: user?.kryptosAccessToken || undefined,
    }),
  });

  const data = await response.json();

  return {
    link_token: data.link_token,
    // isAuthorized will be true if access_token was valid
    isAuthorized: !!user?.kryptosAccessToken,
  };
}}
```

## Provider Configuration

Wrap your application with `KryptosConnectProvider`:

| Option                   | Type                         | Required | Description                                                   |
| ------------------------ | ---------------------------- | -------- | ------------------------------------------------------------- |
| `appName`                | string                       | Yes      | Your application name                                         |
| `appLogo`                | string \| React.ReactNode    | No       | Logo URL or React component                                   |
| `clientId`               | string                       | Yes      | Kryptos client ID from Developer Portal                       |
| `theme`                  | `"light"` \| `"dark"`        | No       | Visual theme (default: `"light"`)                             |
| `walletConnectProjectId` | string                       | Yes      | WalletConnect project ID                                      |
| `authMethods`            | `("email" \| "anonymous")[]` | No       | Authentication methods to show. Defaults to both when not set |

### Restricting Auth Methods

By default, both `email` and `anonymous` login options are shown. Use `authMethods` in the provider config to restrict which options appear:

```tsx
// Email only
<KryptosConnectProvider
  config={{
    appName: "My App",
    clientId: "your-client-id",
    walletConnectProjectId: "your-walletconnect-project-id",
    authMethods: ["email"],
  }}
>
  {children}
</KryptosConnectProvider>

// Anonymous only
<KryptosConnectProvider
  config={{
    appName: "My App",
    clientId: "your-client-id",
    walletConnectProjectId: "your-walletconnect-project-id",
    authMethods: ["anonymous"],
  }}
>
  {children}
</KryptosConnectProvider>
```

## Button Configuration

The `KryptosConnectButton` component triggers the connection flow:

| Option              | Type                                                            | Required | Description                                                                                                                |
| ------------------- | --------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `generateLinkToken` | `() => Promise<{ link_token: string; isAuthorized?: boolean }>` | Yes      | Function that returns link token from your backend                                                                         |
| `onConnectSuccess`  | `(userConsent: UserConsent \| null) => void`                    | Yes      | Callback on successful connection                                                                                          |
| `onConnectError`    | `(error: Error) => void`                                        | Yes      | Callback on connection failure                                                                                             |
| `integrationName`   | string                                                          | No       | Direct integration ID to bypass selection page                                                                             |
| `children`          | React.ReactNode                                                 | No       | Button text. Defaults to "Connect [integrationName] Account" if `integrationName` is set, otherwise "Connect with Kryptos" |
| `size`              | `"sm"` \| `"md"` \| `"lg"`                                      | No       | Button size (default: `"md"`)                                                                                              |
| `disabled`          | boolean                                                         | No       | Disables the button (also auto-disabled during loading)                                                                    |
| `className`         | string                                                          | No       | Custom CSS class                                                                                                           |
| `style`             | React.CSSProperties                                             | No       | Inline styles                                                                                                              |

## Direct Integration Flow

The `integrationName` prop allows you to direct users to a specific integration, bypassing the general integration selection page. This is useful when you want to provide dedicated buttons for specific exchanges or wallets.

**Getting Supported Integration IDs:**

Fetch available integration IDs from the public Kryptos API endpoint (see [Public Endpoints - Integrations](/docs/public-endpoints/integrations) documentation).

**Usage Example:**

```tsx
// Direct connection to a specific integration (e.g., Binance)
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  integrationName="binance"
  onConnectSuccess={(userConsent) => {
    console.log("Binance connected:", userConsent);
  }}
>
  Connect Binance Account
</KryptosConnectButton>

// Without children - uses default button text
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  integrationName="metamask"
  onConnectSuccess={(userConsent) => {
    console.log("MetaMask connected:", userConsent);
  }}
  // Button will display: "Connect using Metamask"
/>
```

**Use Cases:**

1. **Dedicated Integration Buttons**: Create separate buttons for popular integrations

```tsx
<KryptosConnectButton integrationName="binance">
  Connect Binance
</KryptosConnectButton>
<KryptosConnectButton integrationName="coinbase">
  Connect Coinbase
</KryptosConnectButton>
<KryptosConnectButton integrationName="metamask">
  Connect MetaMask
</KryptosConnectButton>
```

2. **Contextual Integration**: Direct users to relevant integrations based on their context

```tsx
// In an exchange-focused feature
<KryptosConnectButton integrationName="kraken">
  Add Kraken Account
</KryptosConnectButton>
```

3. **Onboarding Flows**: Guide users to connect specific integrations during onboarding

```tsx
// Step 1: Connect wallet
<KryptosConnectButton integrationName="metamask">
  Connect Your Wallet
</KryptosConnectButton>

// Step 2: Connect exchange
<KryptosConnectButton integrationName="binance">
  Connect Your Exchange
</KryptosConnectButton>
```

:::info
The `integrationName` value must match an integration ID from the supported providers list. An invalid ID will result in an error.
:::

## TypeScript Support

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

## Customization

### CSS Variables

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

### Custom Button Styling

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

## Framework Integration

### Next.js (App Router)

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

### React (Vite/CRA)

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
  </KryptosConnectProvider>,
);
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Peer Dependencies

- React >= 16.8.0
- React DOM >= 16.8.0

## Next steps

- [Backend Implementation](./backend) -- set up the server-side token exchange and API integration
- [Examples](./examples) -- complete integration examples for common use cases
- [Mobile SDK](./mobile-sdk) -- integrate Kryptos Connect in React Native applications
