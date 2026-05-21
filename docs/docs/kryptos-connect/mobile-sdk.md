---
id: mobile-sdk
title: Mobile SDK
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Kryptos Connect Mobile SDK provides React Native components for iOS and Android applications. It works with both Expo and React Native CLI.

:::info Before you begin
Make sure you have completed the [prerequisites in the overview](./overview) and set up your [backend server](./backend).
:::

## Installation

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install @kryptos_connect/mobile-sdk react-native-webview
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add @kryptos_connect/mobile-sdk react-native-webview
```

</TabItem>
<TabItem value="expo" label="Expo">

```bash
npx expo install @kryptos_connect/mobile-sdk react-native-webview
```

</TabItem>
</Tabs>

**iOS (React Native CLI only):**

```bash
cd ios && pod install
```

## Prerequisites

- **Client ID** from the [Kryptos Developer Portal](https://dashboard.kryptos.io)
- **WalletConnect Project ID** from [WalletConnect Cloud](https://cloud.walletconnect.com) _(optional)_

## Quick Start

```tsx
import { KryptosConnect, KryptosConnectButton } from "@kryptos_connect/mobile-sdk";

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
  buttonLabel="Connect Kryptos"
  buttonHeight={52}
/>;
```

## Full Example

```tsx
import { KryptosConnect, KryptosConnectButton } from "@kryptos_connect/mobile-sdk";
import { useState } from "react";

const BASE_URL = "https://connect-api.kryptos.io";
const CLIENT_ID = "your-client-id";
const CLIENT_SECRET = "your-client-secret"; // keep server-side in production
const SCOPES = "openid profile offline_access email portfolios:read integrations:read";

export default function App() {
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
        generateLinkToken={() => generateLinkToken()}
        onConnectSuccess={handleSuccess}
        onConnectError={(err) => console.error(err)}
        buttonLabel="Link Kryptos Account"
        buttonHeight={52}
      />

      {/* Pre-select a specific integration with custom style */}
      <KryptosConnectButton
        generateLinkToken={() => generateLinkToken()}
        onConnectSuccess={handleSuccess}
        onConnectError={(err) => console.error(err)}
        integrationName="coinbase"
        buttonLabel="Connect Coinbase"
        buttonHeight={48}
        style={{ borderRadius: 10, backgroundColor: "#0052FF" }}
      />

      {/* Re-authorize with stored access token */}
      {accessToken && (
        <KryptosConnectButton
          generateLinkToken={() => generateLinkToken(accessToken)}
          onConnectSuccess={handleSuccess}
          onConnectError={(err) => console.error(err)}
          buttonLabel="Continue with Access Token"
          buttonHeight={52}
        />
      )}
    </>
  );
}
```

## User Flow Variations

The SDK handles two flows based on the `isAuthorized` flag returned from `generateLinkToken`:

### Flow 1: New User (`isAuthorized: false` or undefined)

```
press → AUTH → INTEGRATION → onConnectSuccess({ public_token })
```

Exchange `public_token` server-side for a long-lived `access_token`.

### Flow 2: Returning User (`isAuthorized: true`)

```
press → INTEGRATION → onConnectSuccess(null)
```

Pass stored `access_token` in the link-token request body and return `isAuthorized: true`. No new token is issued.

## `KryptosConnect.init` Config

| Key                      | Type                          | Required | Description                                                                                                                |
| ------------------------ | ----------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `clientId`               | `string`                      | Yes      | Your Kryptos client ID.                                                                                                    |
| `appName`                | `string`                      | Yes      | Displayed in the connect UI header.                                                                                        |
| `appLogo`                | `string`                      | No       | URI to your app logo shown in the connect UI.                                                                              |
| `walletConnectProjectId` | `string`                      | No       | Required if using WalletConnect.                                                                                           |
| `theme`                  | `"light" \| "dark" \| "auto"` | No       | UI theme. Default `"light"`.                                                                                               |
| `language`               | `string`                      | No       | UI language. Supported: `en fr de pt sv es pl it`.                                                                         |
| `authMethods`            | `("email" \| "anonymous")[]`  | No       | Auth methods shown. Default: both.                                                                                         |
| `cssVars`                | `Record<string, string>`      | No       | Override `--kc-*` CSS variables in the connect UI. `--kc-primary` and `--kc-primary-text` also apply to the native button. |

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

| Prop                | Type                                                            | Required | Description                                                                        |
| ------------------- | --------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------- |
| `generateLinkToken` | `() => Promise<{ link_token: string; isAuthorized?: boolean }>` | Yes      | Called on press. Return `isAuthorized: true` to skip auth for existing users.      |
| `onConnectSuccess`  | `(data: UserConsent \| null) => void`                           | Yes      | Called on success. `data` is `null` when `isAuthorized` was `true`.                |
| `onConnectError`    | `(error: Error) => void`                                        | Yes      | Called on error or dismissal.                                                      |
| `integrationName`   | `string`                                                        | No       | Skip the integration list and open a specific integration directly.                |
| `buttonLabel`       | `string`                                                        | No       | Button text.                                                                       |
| `buttonHeight`      | `number`                                                        | No       | Button height in dp. Default `56`.                                                 |
| `extraConfig`       | `Record<string, unknown>`                                       | No       | Per-button config overrides, merged onto the global config.                        |
| `style`             | `StyleProp<ViewStyle>`                                          | No       | Style for the button. `backgroundColor` overrides `--kc-primary` for that button.  |

## Theming & Customization

Theme the connect UI by passing `cssVars` to `KryptosConnect.init`. The connect UI runs inside a WebView, so global stylesheet overrides have no effect. `--kc-primary` and `--kc-primary-text` also apply to the native button's background and label.

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

For per-button overrides, use the `style` prop. `backgroundColor` takes precedence over `--kc-primary` for that button only:

```tsx
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  onConnectSuccess={handleSuccess}
  onConnectError={(err) => console.error(err)}
  buttonLabel="Connect Coinbase"
  buttonHeight={48}
  style={{ backgroundColor: "#0052FF", borderRadius: 10 }}
/>
```

For the complete variable reference, see [Theming & Customization](./css-theming).

## Direct Integration Flow

The `integrationName` prop directs users to a specific integration, bypassing the integration selection page.

Fetch available integration IDs from the public Kryptos API (see [Public Endpoints - Integrations](/docs/public-endpoints/integrations)).

```tsx
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  onConnectSuccess={handleSuccess}
  onConnectError={(err) => console.error(err)}
  integrationName="binance"
  buttonLabel="Connect Binance"
/>
```

:::info
The `integrationName` value must match an integration ID from the supported providers list.
:::

## Platform Requirements

| Platform     | Minimum Version        |
| ------------ | ---------------------- |
| iOS          | 12.0+                  |
| Android      | API 21+ (Android 5.0+) |
| React Native | 0.60+                  |
| Expo SDK     | 48+                    |

## Features

- **Cross-Platform:** Single codebase for iOS and Android
- **Expo Support:** Works with Expo and React Native CLI
- **WalletConnect v2:** Built-in WalletConnect integration
- **Theming:** Light, dark, and auto theme support with CSS variable customization
- **TypeScript:** Full TypeScript support

## Next steps

- [Backend Implementation](./backend) — set up your server-side integration
- [Examples](./examples) — complete integration examples
- [Web SDK](./web-sdk) — integrate Kryptos Connect in web applications
