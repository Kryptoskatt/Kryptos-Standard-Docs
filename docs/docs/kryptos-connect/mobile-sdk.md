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

## Core Dependencies

Install all required dependencies:

```bash
npx expo install @reown/appkit-react-native @react-native-async-storage/async-storage \
  react-native-get-random-values react-native-svg @react-native-community/netinfo \
  @walletconnect/react-native-compat react-native-safe-area-context expo-application
```

## Platform Setup

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

## Quick Start

```tsx
import {
  KryptosConnectProvider,
  KryptosConnectButton,
} from "@kryptos_connect/mobile-sdk";

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

## Provider Configuration

| Option                   | Type                  | Required | Description                             |
| ------------------------ | --------------------- | -------- | --------------------------------------- |
| `appName`                | string                | Yes      | Your application name                   |
| `appLogo`                | string \| ReactNode   | No       | Logo URL or image source                |
| `clientId`               | string                | Yes      | Kryptos client ID from Developer Portal |
| `theme`                  | `"light"` \| `"dark"` | No       | UI theme (default: `"light"`)           |
| `walletConnectProjectId` | string                | No       | WalletConnect v2 project ID             |

## Button Configuration

| Option              | Type                                 | Required | Description                       |
| ------------------- | ------------------------------------ | -------- | --------------------------------- |
| `generateLinkToken` | `() => Promise<string>`              | Yes      | Function that returns link token  |
| `onSuccess`         | `(userConsent: UserConsent) => void` | No       | Callback on successful connection |
| `onError`           | `() => void`                         | No       | Callback on connection failure    |
| `children`          | ReactNode                            | No       | Custom button content             |
| `style`             | ViewStyle                            | No       | Container styling                 |
| `textStyle`         | TextStyle                            | No       | Text styling                      |

## Custom Button Styling

```tsx
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  onSuccess={handleSuccess}
  onError={handleError}
  style={{ backgroundColor: "#8b5cf6", borderRadius: 12, padding: 16 }}
  textStyle={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}
>
  Connect Wallet
</KryptosConnectButton>
```

## Using KryptosConnectModal

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

## WalletConnect Integration

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
- **Dark Mode:** Light and dark theme support
- **TypeScript:** Full TypeScript support

## Package Information

- **NPM Package:** [@kryptos_connect/mobile-sdk](https://www.npmjs.com/package/@kryptos_connect/mobile-sdk)
- **GitHub:** [Kryptoskatt/kryptos-connect-mobile-package](https://github.com/Kryptoskatt/kryptos-connect-mobile-package)

## Next steps

- [Backend Implementation](./backend) -- set up your server-side integration
- [Examples](./examples) -- complete integration examples
- [Web SDK](./web-sdk) -- integrate Kryptos Connect in web applications
