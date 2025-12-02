# Kryptos Documentation

Complete documentation for Kryptos Connect APIs and TypeScript Type Definitions.

---

## 📚 What's Included

1. **[Complete API Documentation](./API-DOCUMENTATION.md)** - Full API reference with authentication
2. **[Swagger UI](./swagger-ui/)** - Interactive API explorer
3. **[TypeScript Types](./types/)** - Type definitions for all data structures

---

## 🚀 Quick Start

### 1. View API Documentation

Open the complete API reference:

```bash
open API-DOCUMENTATION.md
```

**Includes:**

- ✅ Creating API Keys (step-by-step guide)
- ✅ All endpoints with specifications
- ✅ Authentication guide
- ✅ Request/Response examples (JavaScript & Python)
- ✅ Error handling
- ✅ Complete code examples

### 2. Interactive Swagger UI

**🌐 Live Documentation:** [https://connect.kryptos.io/docs/](https://connect.kryptos.io/docs/)

**Features:**

- Try API endpoints directly in your browser
- Test with your API key
- See live request/response examples
- Copy code snippets in multiple languages

---

## 🔐 Authentication

Kryptos Connect APIs support two authentication methods:

### Option 1: OAuth 2.0 (Kryptos Connect)

Use OAuth 2.0 authorization code flow with PKCE to access user portfolio data with their consent.

| Endpoint          | URL                                        |
| ----------------- | ------------------------------------------ |
| **Authorization** | `https://connect.kryptos.io/oidc/auth`     |
| **Token**         | `https://connect.kryptos.io/oidc/token`    |
| **UserInfo**      | `https://connect.kryptos.io/oidc/userinfo` |

**Available Scopes:**
- **Core:** `openid`, `profile`, `email`, `offline_access`
- **Data (Read):** `holdings:read`, `transactions:read`, `defi-portfolio:read`, `nft-portfolio:read`, `ledger:read`, `tax:read`, `integrations:read`
- **Data (Write):** `holdings:write`, `transactions:write`, `defi-portfolio:write`, `nft-portfolio:write`, `ledger:write`, `tax:write`, `integrations:write`

**Quick Example:**

```bash
# 1. Redirect user to authorize (with PKCE)
GET https://connect.kryptos.io/oidc/auth?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=openid+holdings:read+transactions:read&code_challenge=CODE_CHALLENGE&code_challenge_method=S256

# 2. Exchange code for token
curl -X POST https://connect.kryptos.io/oidc/token \
  -d "grant_type=authorization_code&code=AUTH_CODE&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code_verifier=CODE_VERIFIER"

# 3. Call API with token
curl https://connect.kryptos.io/api/v1/holdings \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

**Full OAuth Guide:** See [API-DOCUMENTATION.md#oauth-20-authentication](./API-DOCUMENTATION.md#oauth-20-authentication-kryptos-connect)

---

### Option 2: API Keys (Enterprise)

> **Note:** API key support is currently available for **Enterprise customers only**. Contact [support@kryptos.io](mailto:support@kryptos.io) for more information.

**Steps:**

1. Log in to [enterprise.kryptos.io](https://enterprise.kryptos.io)
2. Navigate to **Settings** → **API Keys**
3. Click **"Create New API Key"**
4. Configure permissions and copy your key

```
X-API-Key: kryptos_live_xxxxxxxxxxxxxxxxxxxx
```

**Complete Guide:** See [API-DOCUMENTATION.md#creating-api-keys](./API-DOCUMENTATION.md#creating-api-keys)

---

## 📖 API Endpoints

### Base URL

```
https://connect.kryptos.io/api
```

### V1 Endpoints (Modern V2 Format)

| Endpoint            | Method | Description                 | Required Permission |
| ------------------- | ------ | --------------------------- | ------------------- |
| `/v1/userinfo`      | GET    | Get user information        | `read:profile`      |
| `/v1/holdings`      | GET    | Get cryptocurrency holdings | `read:holdings`     |
| `/v1/transactions`  | GET    | Get transaction history     | `read:transactions` |
| `/v1/defi-holdings` | GET    | Get DeFi positions          | `read:defi`         |
| `/v1/nft-holdings`  | GET    | Get NFT holdings            | `read:nft`          |
| `/v1/profiling`     | GET    | Get portfolio insights      | `read:analytics`    |

### V0 Endpoints (Legacy Format)

| Endpoint            | Method   | Description             |
| ------------------- | -------- | ----------------------- |
| `/v0/wallets`       | GET      | Get user wallets        |
| `/v0/transactions`  | GET/POST | Get/Create transactions |
| `/v0/nft-holdings`  | GET      | Get NFT holdings        |
| `/v0/defi-holdings` | GET      | Get DeFi holdings       |

**Full API Reference:** [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)

---

## 💻 Quick Examples

### JavaScript/Node.js

```javascript
const axios = require("axios");

const API_KEY = "your_api_key_here";

// Get Holdings
async function getHoldings() {
  const response = await axios.get(
    "https://connect.kryptos.io/api/v1/holdings",
    {
      headers: { "X-API-Key": API_KEY },
    }
  );

  console.log("Total Value:", response.data.summary.totalValue);
  return response.data;
}

getHoldings();
```

### Python

```python
import requests

API_KEY = 'your_api_key_here'

def get_holdings():
    headers = {'X-API-Key': API_KEY}
    response = requests.get(
        'https://connect.kryptos.io/api/v1/holdings',
        headers=headers
    )

    data = response.json()
    print(f"Total Value: ${data['summary']['totalValue']}")
    return data

get_holdings()
```

### cURL

```bash
curl -X GET "https://connect.kryptos.io/api/v1/holdings" \
  -H "X-API-Key: your_api_key_here"
```

**More Examples:** [API-DOCUMENTATION.md#code-examples](./API-DOCUMENTATION.md#code-examples)

---

## 📦 TypeScript Types (v1)

Complete type definitions for all Kryptos data structures.

**Location:** [types/](./types/) directory

### Available Type Definitions

- **[asset.ts](./types/asset.ts)** - Asset types (crypto, NFT, fiat)
- **[transaction.ts](./types/transaction.ts)** - Transaction and ledger types
- **[holdings.ts](./types/holdings.ts)** - Portfolio holdings types
- **[defi.ts](./types/defi.ts)** - DeFi protocol types (lending, staking, farming)
- **[nft-balance.ts](./types/nft-balance.ts)** - NFT collection types
- **[tax.ts](./types/tax.ts)** - Tax calculation types

### Usage Example

```typescript
import { Asset } from "./types/asset";
import { Transaction } from "./types/transaction";
import { HoldingsType } from "./types/holdings";
import { DefiHolding } from "./types/defi";
import { NFTBalance } from "./types/nft-balance";

// Define an asset
const bitcoin: Asset = {
  tokenId: "bitcoin",
  symbol: "BTC",
  publicName: "Bitcoin",
  chainId: "bitcoin",
  logoUrl: "https://...",
  standard: "Native",
  explorerUrl: "https://blockchain.com",
  category: "cryptocurrency",
  type: "crypto",
  providerId: { coingecko: "bitcoin" },
};

// Use with API responses
async function getTypedHoldings(): Promise<HoldingsType[]> {
  const response = await fetch("https://connect.kryptos.io/api/v1/holdings", {
    headers: { "X-API-Key": API_KEY },
  });

  const data = await response.json();
  return data.holdings as HoldingsType[];
}
```

---

**© 2024 Kryptos. All rights reserved.**
