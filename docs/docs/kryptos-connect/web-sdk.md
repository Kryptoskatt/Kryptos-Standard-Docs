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
2. **WalletConnect Project ID** from [WalletConnect Cloud](https://cloud.walletconnect.com) _(optional)_

## Quick Start

```tsx
import { KryptosConnect, KryptosConnectButton } from "@kryptos_connect/web-sdk";

// 1. Initialize once (or on every render to keep config in sync)
KryptosConnect.init({
  clientId: "your-client-id",
  appName: "My App",
  appLogo: "https://yourapp.com/logo.png",
  theme: "light", // "light" | "dark" | "auto"
  language: "en",
  authMethods: ["email", "anonymous"],
});

// 2. Drop in the button
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  onConnectSuccess={(consent) => console.log(consent.public_token)}
  onConnectError={(err) => console.error(err)}
/>;
```

## Full Example

```tsx
import { KryptosConnect, KryptosConnectButton } from "@kryptos_connect/web-sdk";
import { useState } from "react";

const BASE_URL = "https://connect-api.kryptos.io";
const CLIENT_ID = "your-client-id";
const CLIENT_SECRET = "your-client-secret"; // keep server-side in production
const SCOPES = "openid profile offline_access email portfolios:read integrations:read";

function App() {
  const [accessToken, setAccessToken] = useState(null);

  KryptosConnect.init({
    clientId: CLIENT_ID,
    appName: "My App",
    theme: "light",
    language: "en",
    authMethods: ["email", "anonymous"],
  });

  async function generateLinkToken(existingAccessToken?: string | null) {
    const body: Record<string, unknown> = { scopes: SCOPES };
    if (existingAccessToken) body.access_token = existingAccessToken;

    const res = await fetch(`${BASE_URL}/link-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": CLIENT_ID,
        "X-Client-Secret": CLIENT_SECRET,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { link_token: data.data.link_token, isAuthorized: !!existingAccessToken };
  }

  async function handleSuccess(consent) {
    if (!consent) return; // re-auth — no new token
    const res = await fetch(`${BASE_URL}/token/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_token: consent.public_token,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });
    const data = await res.json();
    setAccessToken(data.data.access_token);
  }

  return (
    <>
      {/* Default button */}
      <KryptosConnectButton
        generateLinkToken={generateLinkToken}
        onConnectSuccess={handleSuccess}
        onConnectError={(err) => console.error(err)}
      />

      {/* Pre-select a specific integration */}
      <KryptosConnectButton
        generateLinkToken={generateLinkToken}
        onConnectSuccess={handleSuccess}
        onConnectError={(err) => console.error(err)}
        integrationName="coinbase"
      />

      {/* Custom label */}
      <KryptosConnectButton
        generateLinkToken={generateLinkToken}
        onConnectSuccess={handleSuccess}
        onConnectError={(err) => console.error(err)}
        size="lg"
      >
        Link your crypto account
      </KryptosConnectButton>

      {/* Re-authorize with stored access token */}
      {accessToken && (
        <KryptosConnectButton
          generateLinkToken={() => generateLinkToken(accessToken)}
          onConnectSuccess={handleSuccess}
          onConnectError={(err) => console.error(err)}
        >
          Add more integrations
        </KryptosConnectButton>
      )}
    </>
  );
}
```

## User Flow Variations

The SDK handles two flows based on the `isAuthorized` flag returned from `generateLinkToken`:

### Flow 1: New User (`isAuthorized: false` or undefined)

```
click → AUTH → INTEGRATION → onConnectSuccess({ public_token })
```

Exchange `public_token` server-side for a long-lived `access_token`.

### Flow 2: Returning User (`isAuthorized: true`)

```
click → INTEGRATION → onConnectSuccess(null)
```

Pass stored `access_token` in the link-token request body and return `isAuthorized: true`. No new token is issued.

## `KryptosConnect.init` Config

| Key                      | Type                          | Required | Description                                                           |
| ------------------------ | ----------------------------- | -------- | --------------------------------------------------------------------- |
| `clientId`               | `string`                      | Yes      | Your Kryptos client ID.                                               |
| `appName`                | `string`                      | Yes      | Displayed in the connect UI header.                                   |
| `appLogo`                | `ReactNode \| string`         | No       | Logo shown in the connect UI.                                         |
| `walletConnectProjectId` | `string`                      | No       | Required if using WalletConnect.                                      |
| `theme`                  | `"light" \| "dark" \| "auto"` | No       | UI theme. Default `"light"`.                                          |
| `language`               | `string`                      | No       | UI language. Supported: `en fr de pt sv es pl it`.                    |
| `authMethods`            | `("email" \| "anonymous")[]`  | No       | Auth methods shown. Default: both.                                    |
| `cssVars`                | `Record<string, string>`      | No       | Override `--kc-*` CSS variables in the connect UI and trigger button. |

### Restricting Auth Methods

```tsx
// Email only
KryptosConnect.init({
  clientId: "your-client-id",
  appName: "My App",
  authMethods: ["email"],
});

// Anonymous only
KryptosConnect.init({
  clientId: "your-client-id",
  appName: "My App",
  authMethods: ["anonymous"],
});
```

### Setting the Language

| Code   | Language   |
| ------ | ---------- |
| `"en"` | English    |
| `"fr"` | French     |
| `"de"` | German     |
| `"pt"` | Portuguese |
| `"sv"` | Swedish    |
| `"es"` | Spanish    |
| `"pl"` | Polish     |
| `"it"` | Italian    |

## `KryptosConnectButton` Props

| Prop                | Type                                                            | Required | Description                                                                                                                |
| ------------------- | --------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `generateLinkToken` | `() => Promise<{ link_token: string; isAuthorized?: boolean }>` | Yes      | Called on click. Return `isAuthorized: true` to skip auth for existing users.                                              |
| `onConnectSuccess`  | `(data: UserConsent \| null) => void`                           | Yes      | Called on success. `data` is `null` when `isAuthorized` was `true`.                                                        |
| `onConnectError`    | `(error: Error) => void`                                        | Yes      | Called on error or dismissal.                                                                                              |
| `size`              | `"sm" \| "md" \| "lg"`                                          | No       | Button size. Default `"md"`.                                                                                               |
| `integrationName`   | `string`                                                        | No       | Skip the integration list and open a specific integration directly.                                                        |
| `extraConfig`       | `Record<string, unknown>`                                       | No       | Per-button config overrides, merged onto the global config.                                                                |
| `extraConfig`       | `Record<string, unknown>`                                       | No       | Per-button config overrides merged onto the global config. Pass `prefill` here to pre-populate integration form fields.    |
| `children`          | `React.ReactNode`                                               | No       | Custom button label.                                                                                                       |
| `className`         | `string`                                                        | No       | Extra CSS class on the `<button>` element.                                                                                 |
| `style`             | `React.CSSProperties`                                           | No       | Inline styles on the `<button>` element.                                                                                   |

### Pre-filling Integration Forms

Pass a `prefill` object inside `extraConfig` to pre-populate the integration form when the user reaches the connection step. All fields are optional — pass only the ones you have.

| Field                    | Type     | Description                                                               |
| ------------------------ | -------- | ------------------------------------------------------------------------- |
| `prefill.address`        | `string` | Wallet or blockchain address. Triggers chain auto-detect for EVM wallets. |
| `prefill.apiKey`         | `string` | API key for exchange or API-based integrations.                           |
| `prefill.secretKey`      | `string` | Secret key for integrations that require one.                             |
| `prefill.password`       | `string` | Password for integrations that require one.                               |
| `prefill.accountName`    | `string` | Account name for account-based integrations.                              |

```tsx
// Pre-fill a wallet address — chains are auto-detected
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  onConnectSuccess={handleSuccess}
  onConnectError={(err) => console.error(err)}
  integrationName="ethereum"
  extraConfig={{ prefill: { address: "0x1234567890123456789012345678901234567890" } }}
/>

// Pre-fill API credentials for an exchange
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  onConnectSuccess={handleSuccess}
  onConnectError={(err) => console.error(err)}
  integrationName="binance"
  extraConfig={{ prefill: { apiKey: "user-api-key", secretKey: "user-secret-key" } }}
/>
```

:::info
Prefilled values populate the form as editable defaults — the user can still change them before submitting. For EVM wallets, providing an `address` automatically triggers chain detection and pre-selects all detected chains.
:::

## Direct Integration Flow

The `integrationName` prop directs users to a specific integration, bypassing the integration selection page.

Fetch available integration IDs from the public Kryptos API endpoint (see [Public Endpoints - Integrations](/docs/public-endpoints/integrations)).

```tsx
// Connect directly to Binance
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  onConnectSuccess={handleSuccess}
  onConnectError={(err) => console.error(err)}
  integrationName="binance"
>
  Connect Binance Account
</KryptosConnectButton>

// Dedicated buttons for popular integrations
<KryptosConnectButton integrationName="binance">Connect Binance</KryptosConnectButton>
<KryptosConnectButton integrationName="coinbase">Connect Coinbase</KryptosConnectButton>
<KryptosConnectButton integrationName="metamask">Connect MetaMask</KryptosConnectButton>
```

:::info
The `integrationName` value must match an integration ID from the supported providers list.
:::

## Theming & Customization

Theme the connect UI by passing `cssVars` to `KryptosConnect.init`. The connect UI is sandboxed — global stylesheet overrides have no effect. `--kc-primary` and `--kc-primary-text` also apply to the trigger button in your page.

```tsx
KryptosConnect.init({
  clientId: "your-client-id",
  appName: "My App",
  cssVars: {
    "--kc-primary":       "#6366f1",
    "--kc-primary-hover": "#4f46e5",
    "--kc-primary-text":  "#ffffff",
    "--kc-border-focus":  "#6366f1",
  },
});
```

For per-button overrides, use the `style` or `className` prop directly on `KryptosConnectButton`:

```tsx
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  onConnectSuccess={handleSuccess}
  onConnectError={(err) => console.error(err)}
  style={{ background: "linear-gradient(to right, #667eea, #764ba2)", borderRadius: "12px" }}
>
  Connect Wallet
</KryptosConnectButton>
```

For the complete variable reference, see [Theming & Customization](./css-theming).

## Framework Integration

### Next.js (App Router)

```tsx
// app/layout.tsx
import { KryptosConnect } from "@kryptos_connect/web-sdk";

KryptosConnect.init({
  appName: "My Next.js App",
  clientId: process.env.NEXT_PUBLIC_KRYPTOS_CLIENT_ID!,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  theme: "light",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### React (Vite/CRA)

```tsx
// main.tsx
import { KryptosConnect } from "@kryptos_connect/web-sdk";

KryptosConnect.init({
  appName: "My React App",
  clientId: import.meta.env.VITE_KRYPTOS_CLIENT_ID,
  walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  theme: "light",
});
```

## TypeScript Support

```typescript
import type { UserConsent } from "@kryptos_connect/web-sdk";

interface UserConsent {
  public_token: string;
}
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

- [Backend Implementation](./backend) — set up the server-side token exchange and API integration
- [Examples](./examples) — complete integration examples for common use cases
- [Mobile SDK](./mobile-sdk) — integrate Kryptos Connect in React Native applications
