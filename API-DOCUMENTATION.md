# Kryptos Connect APIs - Complete Documentation

Complete API documentation for Kryptos Connect APIs with authentication, endpoints, and examples.

---

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
  - [Creating API Keys](#creating-api-keys)
  - [Using API Keys](#using-api-keys)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [User Information](#user-information)
  - [Holdings](#holdings)
  - [Transactions](#transactions)
  - [DeFi Holdings](#defi-holdings)
  - [NFT Holdings](#nft-holdings)
  - [Portfolio Insights](#portfolio-insights)
- [Legacy Endpoints (V0)](#legacy-endpoints-v0)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)

---

## Overview

Kryptos Connect APIs provide comprehensive access to cryptocurrency portfolio data, including:

- **Portfolio Holdings** - Track crypto assets across multiple wallets and chains
- **Transaction History** - Complete transaction records with advanced filtering
- **DeFi Integration** - Lending, staking, farming, and derivatives positions
- **NFT Management** - Collection tracking with metadata and sales history
- **Portfolio Insights** - Analytics and user classification
- **Tax Calculations** - Cost basis, P&L, and tax reporting data

### API Versions

- **V0 Endpoints** (`/v0/*`) - Legacy format with original data structure
- **V1 Endpoints** (`/v1/*`) - Modern format with V2 standardized structure and enhanced features

---

## Base URL

```
https://connect-api.kryptos.io/api
```

All API requests should be made to this base URL.

---

## Authentication

All endpoints (except `/health`) require authentication. Two methods are supported:

1. **API Key Authentication** - For Enterprise customers with direct API access
2. **OAuth 2.0 Authentication** - For applications accessing user data with consent

---

### OAuth 2.0 Authentication (Kryptos Connect)

Use OAuth 2.0 authorization code flow to access user portfolio data with their consent.

#### OAuth Endpoints

| Endpoint          | URL                                        |
| ----------------- | ------------------------------------------ |
| **Authorization** | `https://oauth.kryptos.io/oidc/auth`       |
| **Token**         | `https://oauth.kryptos.io/oidc/token`      |
| **UserInfo**      | `https://oauth.kryptos.io/oidc/userinfo`   |

#### Available Scopes

**Core Scopes:**

| Scope            | Description                              |
| ---------------- | ---------------------------------------- |
| `openid`         | Basic OpenID Connect access (required)   |
| `profile`        | User profile (name, picture, updated_at) |
| `email`          | Email address and verified status        |
| `offline_access` | Allow refresh tokens for offline access  |

**Data Scopes (Granular Read/Write):**

| Resource     | Read Scope          | Write Scope          | Description                          |
| ------------ | ------------------- | -------------------- | ------------------------------------ |
| Portfolios   | `portfolios:read`   | `portfolios:write`   | Portfolio holdings and balances      |
| Transactions | `transactions:read` | `transactions:write` | Transaction history and trades       |
| Integrations | `integrations:read` | `integrations:write` | Connected wallets and exchanges      |
| Tax          | `tax:read`          | `tax:write`          | Tax calculations and reports         |
| Accounting   | `accounting:read`   | `accounting:write`   | Accounting ledger entries            |
| Reports      | `reports:read`      | `reports:write`      | Generated reports and exports        |
| Workspace    | `workspace:read`    | `workspace:write`    | Workspace settings and configuration |
| Users        | `users:read`        | `users:write`        | User profile and preferences         |

#### OAuth Flow

**Step 1: Redirect to Authorization**

```
GET https://oauth.kryptos.io/oidc/auth?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  scope=openid profile portfolios:read transactions:read offline_access&
  state=RANDOM_STATE&
  code_challenge=CODE_CHALLENGE&
  code_challenge_method=S256
```

**Step 2: Exchange Code for Token**

```bash
curl -X POST https://oauth.kryptos.io/oidc/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTH_CODE" \
  -d "redirect_uri=YOUR_REDIRECT_URI" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code_verifier=CODE_VERIFIER"
```

**Step 3: Call APIs with Access Token**

```bash
curl -X GET https://connect-api.kryptos.io/api/v1/holdings \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

#### OAuth Code Examples

<details>
<summary>JavaScript/Node.js</summary>

```javascript
class KryptosOAuthClient {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.oauthUrl = "https://oauth.kryptos.io";
    this.apiUrl = "https://connect-api.kryptos.io";
    this.accessToken = null;
  }

  getAuthUrl(
    redirectUri,
    codeChallenge,
    scopes = [
      "openid",
      "profile",
      "portfolios:read",
      "transactions:read",
      "offline_access",
    ]
  ) {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(" "),
      state: Math.random().toString(36).substring(7),
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });
    return `${this.oauthUrl}/oidc/auth?${params}`;
  }

  async exchangeCode(code, redirectUri, codeVerifier) {
    const response = await fetch(`${this.oauthUrl}/oidc/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code_verifier: codeVerifier,
      }),
    });
    const tokens = await response.json();
    this.accessToken = tokens.access_token;
    return tokens;
  }

  async getHoldings() {
    const response = await fetch(`${this.apiUrl}/api/v1/holdings`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "X-Client-Id": this.clientId,
        "X-Client-Secret": this.clientSecret,
      },
    });
    return response.json();
  }
}

// Usage
const client = new KryptosOAuthClient("your_client_id", "your_client_secret");
const authUrl = client.getAuthUrl("http://localhost:3000/callback");
// Redirect user to authUrl, then handle callback...
```

</details>

<details>
<summary>Python</summary>

```python
import requests
from urllib.parse import urlencode

class KryptosOAuthClient:
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.oauth_url = 'https://oauth.kryptos.io'
        self.api_url = 'https://connect-api.kryptos.io'
        self.access_token = None

    def get_auth_url(self, redirect_uri, code_challenge, scopes=['openid', 'profile', 'portfolios:read', 'transactions:read', 'offline_access']):
        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'redirect_uri': redirect_uri,
            'scope': ' '.join(scopes),
            'state': 'random_state_value',
            'code_challenge': code_challenge,
            'code_challenge_method': 'S256'
        }
        return f"{self.oauth_url}/oidc/auth?{urlencode(params)}"

    def exchange_code(self, code, redirect_uri, code_verifier):
        response = requests.post(
            f"{self.oauth_url}/oidc/token",
            data={
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': redirect_uri,
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'code_verifier': code_verifier
            }
        )
        tokens = response.json()
        self.access_token = tokens['access_token']
        return tokens

    def get_holdings(self):
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'X-Client-Id': self.client_id,
            'X-Client-Secret': self.client_secret
        }
        response = requests.get(f"{self.api_url}/api/v1/holdings", headers=headers)
        return response.json()

# Usage
client = KryptosOAuthClient('your_client_id', 'your_client_secret')
auth_url = client.get_auth_url('http://localhost:8000/callback')
print(f"Visit: {auth_url}")
```

</details>

---

### API Key Authentication (Enterprise)

> **Note:** API key support is currently available for **Enterprise customers only**. Contact [support@kryptos.io](mailto:support@kryptos.io) for more information.

### Creating API Keys

**Step 1: Access Your Dashboard**

1. Log in to your Kryptos account at [https://enterprise.kryptos.io](https://enterprise.kryptos.io)
2. Navigate to **Settings** → **API Keys**
3. Click **"Create New API Key"**

**Step 2: Configure Your Key**

When creating an API key, configure:

| Setting             | Description                    | Options                                       |
| ------------------- | ------------------------------ | --------------------------------------------- |
| **Name**            | Descriptive name for the key   | e.g., "Production API", "Dev Environment"     |
| **Permissions**     | Data access level              | See [Permissions](#api-key-permissions) below |
| **IP Restrictions** | (Optional) Limit by IP address | Comma-separated IP list                       |
| **Expiration**      | (Optional) Auto-expire date    | Select date or "Never"                        |

**Step 3: Save Your Key**

:::warning IMPORTANT
Your API key will only be displayed **once**. Copy and store it securely!
:::

```
Example API Key: kryptos_live_xxxxxxxxxxxxxxxxxxxx
```

#### API Key Permissions

| Permission           | Access Level               | Required For                             |
| -------------------- | -------------------------- | ---------------------------------------- |
| `read:profile`       | View user profile          | `/v1/userinfo`                           |
| `read:holdings`      | View crypto holdings       | `/v1/holdings`                           |
| `read:transactions`  | View transaction history   | `/v1/transactions`, `/v0/transactions`   |
| `write:transactions` | Create/modify transactions | `POST /v0/transactions`                  |
| `read:defi`          | View DeFi positions        | `/v1/defi-holdings`, `/v0/defi-holdings` |
| `read:nft`           | View NFT holdings          | `/v1/nft-holdings`, `/v0/nft-holdings`   |
| `read:analytics`     | Access analytics           | `/v1/profiling`                          |

### Using API Keys

Include your API key in the `X-API-Key` header with every request:

**Header:**

```http
X-API-Key: your_api_key_here
```

**Example Request:**

```bash
curl -X GET "https://connect-api.kryptos.io/api/v1/holdings" \
  -H "X-API-Key: kryptos_live_xxxxxxxxxxxxxxxxxxxx"
```

---

## API Endpoints

### Health Check

Check API service status (no authentication required).

**Endpoint:**

```
GET /health
```

**Response:**

```json
{
  "status": "OK",
  "service": "connect-apis",
  "version": "1.0.0",
  "environment": "production"
}
```

**Example:**

```bash
curl -X GET "https://connect-api.kryptos.io/api/health"
```

---

### User Information

Get authenticated user's profile information.

**Endpoint:**

```
GET /v1/userinfo
```

**Required Permissions:** `read:profile`

**Response:**

```json
{
  "message": "User information retrieved successfully",
  "userInfo": {
    "sub": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified": true,
    "preferred_username": "john@example.com"
  },
  "scopes": ["openid", "profile", "email"]
}
```

**Examples:**

<details>
<summary>JavaScript (Axios)</summary>

```javascript
const axios = require("axios");

const response = await axios.get("https://connect-api.kryptos.io/api/v1/userinfo", {
  headers: {
    "X-API-Key": "your_api_key_here",
  },
});

console.log(response.data);
```

</details>

<details>
<summary>Python</summary>

```python
import requests

headers = {'X-API-Key': 'your_api_key_here'}
response = requests.get(
    'https://connect-api.kryptos.io/api/v1/userinfo',
    headers=headers
)

print(response.json())
```

</details>

---

### Holdings

Get comprehensive cryptocurrency holdings with asset distribution across wallets.

**Endpoint:**

```
GET /v1/holdings
```

**Required Permissions:** `read:holdings`

**Query Parameters:** None

**Response Structure:**

```json
{
  "holdings": [
    {
      "asset": {
        "tokenId": "bitcoin",
        "symbol": "BTC",
        "publicName": "Bitcoin",
        "chainId": "bitcoin",
        "logoUrl": "https://...",
        "type": "crypto",
        "category": "crypto"
      },
      "totalQuantity": 2.5,
      "costbasis": 100000,
      "marketPrice": 50000,
      "marketValue": 125000,
      "unrealizedPnL": 25000,
      "baseCurrency": "USD",
      "24hrChange": 3.5,
      "marketLinks": {
        "coinmarketcap": "https://..."
      },
      "assetDistribution": [
        {
          "quantity": 1.5,
          "account": {
            "provider": "Ledger",
            "walletId": "wallet_123"
          },
          "allocationPercentage": 60
        }
      ]
    }
  ],
  "summary": {
    "totalValue": 250000,
    "totalCostBasis": 200000,
    "totalUnrealizedPnL": 50000,
    "roiPercentage": 25,
    "total24hrChange": 2.8
  },
  "user_id": "user_123",
  "timestamp": 1640995200000
}
```

**Key Features:**

- Asset distribution across multiple wallets
- Cost basis and P&L calculations
- Market value and ROI metrics
- 24-hour price change tracking

**Examples:**

<details>
<summary>JavaScript (Axios)</summary>

```javascript
const axios = require("axios");

const response = await axios.get("https://connect-api.kryptos.io/api/v1/holdings", {
  headers: {
    "X-API-Key": "your_api_key_here",
  },
});

console.log("Total Portfolio Value:", response.data.summary.totalValue);
console.log("Holdings:", response.data.holdings);
```

</details>

<details>
<summary>Python</summary>

```python
import requests

headers = {'X-API-Key': 'your_api_key_here'}
response = requests.get(
    'https://connect-api.kryptos.io/api/v1/holdings',
    headers=headers
)

data = response.json()
print(f"Total Portfolio Value: ${data['summary']['totalValue']}")
print(f"Number of Assets: {len(data['holdings'])}")
```

</details>

---

### Transactions

Retrieve user's transaction history with advanced filtering.

**Endpoint:**

```
GET /v1/transactions
```

**Required Permissions:** `read:transactions`

**Query Parameters:**

| Parameter           | Type    | Description                              | Example                 |
| ------------------- | ------- | ---------------------------------------- | ----------------------- |
| `walletId`          | string  | Filter by wallet IDs (comma-separated)   | `wallet_123,wallet_456` |
| `currencyId`        | string  | Filter by currency IDs (comma-separated) | `bitcoin,ethereum`      |
| `trxId`             | string  | Specific transaction ID                  | `trx_abc123`            |
| `isNft`             | boolean | Filter NFT transactions                  | `true`                  |
| `isMissingPrice`    | boolean | Transactions missing price data          | `true`                  |
| `isMissingPurchase` | boolean | Transactions missing purchase data       | `true`                  |
| `isEdited`          | boolean | Manually edited transactions             | `true`                  |
| `isManual`          | boolean | Manually created transactions            | `true`                  |
| `transactionType`   | string  | Transaction types (comma-separated)      | `swap,deposit,withdraw` |
| `label`             | string  | Transaction labels (comma-separated)     | `DeFi,Swap,Purchase`    |
| `order`             | string  | Sort order (`asc` or `desc`)             | `desc`                  |
| `timeStart`         | number  | Start timestamp (Unix milliseconds)      | `1609459200000`         |
| `timeEnd`           | number  | End timestamp (Unix milliseconds)        | `1640995200000`         |
| `limit`             | number  | Maximum results (1-1000, default: 100)   | `50`                    |

**Response Structure:**

```json
{
  "message": "User transactions retrieved successfully",
  "data": [
    {
      "id": "trx_123",
      "transactionPlatfromId": "0xabc123...",
      "timestamp": 1640995200000,
      "label": "Swap",
      "description": "Swapped ETH for USDC",
      "incomingAssets": [
        {
          "asset": {
            "tokenId": "usd-coin",
            "symbol": "USDC",
            "publicName": "USD Coin",
            "type": "crypto"
          },
          "quantity": 3000,
          "price": 1.0,
          "baseCurrency": "USD",
          "timestamp": 1640995200000,
          "type": "incoming",
          "toAccount": {
            "provider": "MetaMask",
            "walletId": "wallet_123",
            "publicAddress": "0x742d35..."
          }
        }
      ],
      "outgoingAssets": [
        {
          "asset": {
            "tokenId": "ethereum",
            "symbol": "ETH",
            "publicName": "Ethereum",
            "type": "crypto"
          },
          "quantity": 1.5,
          "price": 2000,
          "baseCurrency": "USD",
          "timestamp": 1640995200000,
          "type": "outgoing",
          "fromAccount": {
            "provider": "MetaMask",
            "walletId": "wallet_123",
            "publicAddress": "0x742d35..."
          }
        }
      ],
      "fee": [
        {
          "asset": {
            "tokenId": "ethereum",
            "symbol": "ETH",
            "type": "crypto"
          },
          "quantity": 0.005,
          "price": 2000,
          "baseCurrency": "USD",
          "type": "fee"
        }
      ],
      "metadata": {
        "importSource": "API",
        "isManual": false,
        "isEdited": false,
        "isDefiTrx": false,
        "isNFTTrx": false
      },
      "tags": [],
      "ledger": [],
      "rawTrx": {}
    }
  ],
  "user_id": "user_123",
  "timestamp": 1640995200000
}
```

**Examples:**

<details>
<summary>Get Recent Transactions</summary>

```javascript
const axios = require("axios");

const response = await axios.get(
  "https://connect-api.kryptos.io/api/v1/transactions",
  {
    headers: {
      "X-API-Key": "your_api_key_here",
    },
    params: {
      limit: 10,
      order: "desc",
    },
  }
);

console.log("Recent Transactions:", response.data.data);
```

</details>

<details>
<summary>Filter by Date Range</summary>

```python
import requests
from datetime import datetime, timedelta

headers = {'X-API-Key': 'your_api_key_here'}

# Last 30 days
end_time = int(datetime.now().timestamp() * 1000)
start_time = int((datetime.now() - timedelta(days=30)).timestamp() * 1000)

params = {
    'timeStart': start_time,
    'timeEnd': end_time,
    'order': 'desc',
    'limit': 100
}

response = requests.get(
    'https://connect-api.kryptos.io/api/v1/transactions',
    headers=headers,
    params=params
)

print(f"Transactions in last 30 days: {len(response.json()['data'])}")
```

</details>

---

### DeFi Holdings

Get user's DeFi positions with protocol details.

**Endpoint:**

```
GET /v1/defi-holdings
```

**Required Permissions:** `read:defi`

**Query Parameters:**

| Parameter  | Type   | Description                                      | Example                 |
| ---------- | ------ | ------------------------------------------------ | ----------------------- |
| `source`   | string | Filter by data sources (comma-separated, max 30) | `debank,zapper`         |
| `protocol` | string | Filter by protocols (comma-separated, max 30)    | `aave,compound,uniswap` |
| `chain`    | string | Filter by blockchain (comma-separated)           | `ethereum,polygon`      |
| `limit`    | number | Number of holdings (1-1000, default: 100)        | `50`                    |
| `offset`   | number | Pagination offset (default: 0)                   | `0`                     |

**Response Structure:**

```json
{
  "holdings": [
    {
      "holdingId": "defi_123",
      "owner": {
        "provider": "MetaMask",
        "walletId": "wallet_123",
        "publicAddress": "0x742d35..."
      },
      "protocolName": "Aave V3",
      "chain": "ethereum",
      "logoUrl": "https://...",
      "siteUrl": "https://aave.com",
      "category": "lending",
      "portfolio": {
        "category": "other",
        "positions": [
          {
            "asset": {
              "tokenId": "usd-coin",
              "symbol": "USDC",
              "publicName": "USD Coin"
            },
            "amount": "50000",
            "value": {
              "price": 50000,
              "baseCurrency": "USD",
              "timestamp": 1640995200000
            }
          }
        ],
        "rewardPositions": []
      },
      "totalValue": {
        "price": 52000,
        "baseCurrency": "USD"
      },
      "netValue": {
        "price": 50000,
        "baseCurrency": "USD"
      },
      "createdAt": 1640995200000,
      "updatedAt": 1640995200000,
      "isActive": false
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0
  },
  "user_id": "user_123"
}
```

**Examples:**

<details>
<summary>JavaScript (Axios)</summary>

```javascript
const axios = require("axios");

const response = await axios.get(
  "https://connect-api.kryptos.io/api/v1/defi-holdings",
  {
    headers: {
      "X-API-Key": "your_api_key_here",
    },
    params: {
      chain: "ethereum",
      limit: 10,
    },
  }
);

console.log("DeFi Holdings:", response.data.holdings);
```

</details>

<details>
<summary>Python</summary>

```python
import requests

headers = {'X-API-Key': 'your_api_key_here'}
params = {'chain': 'ethereum', 'limit': 10}

response = requests.get(
    'https://connect-api.kryptos.io/api/v1/defi-holdings',
    headers=headers,
    params=params
)

for holding in response.json()['holdings']:
    print(f"{holding['protocolName']}: ${holding['netValue']['price']}")
```

</details>

---

### NFT Holdings

Get user's NFT collection with metadata.

**Endpoint:**

```
GET /v1/nft-holdings
```

**Required Permissions:** `read:nft`

**Query Parameters:**

| Parameter    | Type   | Description                                      | Example                         |
| ------------ | ------ | ------------------------------------------------ | ------------------------------- |
| `source`     | string | Filter by data sources (comma-separated, max 30) | `opensea,alchemy`               |
| `collection` | string | Filter by collections (comma-separated, max 30)  | `boredapeyachtclub,cryptopunks` |
| `chain`      | string | Filter by blockchain (comma-separated)           | `ethereum,polygon`              |
| `tokenId`    | string | Specific token ID                                | `1234`                          |
| `contract`   | string | Contract address                                 | `0xBC4CA0...`                   |
| `limit`      | number | Number of NFTs (1-1000, default: 100)            | `50`                            |
| `offset`     | number | Pagination offset (default: 0)                   | `0`                             |

**Response Structure:**

```json
{
  "holdings": [
    {
      "id": "nft_123",
      "contractAddress": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      "tokenId": "1234",
      "name": "Bored Ape #1234",
      "description": "A unique NFT from the BAYC collection",
      "contentType": "image/png",
      "nftUrl": "https://...",
      "thumbnailUrl": "https://...",
      "source": {
        "provider": "MetaMask",
        "walletId": "wallet_123",
        "publicAddress": "0x742d35..."
      },
      "ercType": "ERC-721",
      "amount": 1,
      "price": {
        "price": 150000,
        "baseCurrency": "USD"
      },
      "isNftSpam": false,
      "collection": {
        "collectionId": "bayc",
        "name": "Bored Ape Yacht Club",
        "description": "...",
        "imageUrl": "https://...",
        "floorPrice": [
          {
            "price": 50,
            "baseCurrency": "ETH"
          }
        ],
        "ownerCount": 6000,
        "totalQuantity": 10000,
        "socialLinks": [
          {
            "platform": "twitter",
            "url": "https://twitter.com/BoredApeYC"
          }
        ]
      },
      "lastSale": {
        "fromAddress": "0x...",
        "toAddress": "0x742d35...",
        "quantity": 1,
        "timestamp": "2023-01-15T10:30:00Z",
        "transactionHash": "0xdef456...",
        "marketplaceName": "OpenSea",
        "totalPrice": {
          "price": 45,
          "baseCurrency": "ETH"
        }
      }
    }
  ],
  "pagination": {
    "limit": 5,
    "offset": 0
  },
  "user_id": "user_123"
}
```

**Examples:**

<details>
<summary>JavaScript (Axios)</summary>

```javascript
const axios = require("axios");

const response = await axios.get(
  "https://connect-api.kryptos.io/api/v1/nft-holdings",
  {
    headers: {
      "X-API-Key": "your_api_key_here",
    },
    params: {
      chain: "ethereum",
      limit: 10,
    },
  }
);

console.log("NFT Holdings:", response.data.holdings);
```

</details>

<details>
<summary>Python</summary>

```python
import requests

headers = {'X-API-Key': 'your_api_key_here'}
params = {'chain': 'ethereum', 'limit': 10}

response = requests.get(
    'https://connect-api.kryptos.io/api/v1/nft-holdings',
    headers=headers,
    params=params
)

for nft in response.json()['holdings']:
    print(f"{nft['name']}: ${nft['price']['price']}")
```

</details>

---

### Portfolio Insights

Get comprehensive portfolio analytics and user classification.

**Endpoint:**

```
GET /v1/profiling
```

**Required Permissions:** `read:analytics`, `read:holdings`, `read:transactions`, `read:defi`, `read:nft`

**Query Parameters:** None

**Response Structure:**

```json
{
  "user_id": "user_123",
  "base_currency": "USD",
  "user_classification": "Defi Hodler",
  "summary": {
    "classification": "Defi Hodler",
    "portfolio_overview": {
      "total_value": 275000,
      "currency": "USD",
      "size_category": "Medium",
      "dominant_category": "DeFi",
      "dominant_percentage": 54.5,
      "change_24h_percentage": 2.8,
      "unrealized_pnl": 75000,
      "roi_percentage": 37.5
    },
    "asset_breakdown": {
      "regular_crypto": {
        "value": 100000,
        "percentage": 36.4,
        "count": 8
      },
      "nfts": {
        "value": 25000,
        "percentage": 9.1,
        "count": 5
      },
      "defi": {
        "value": 150000,
        "percentage": 54.5,
        "count": 3
      }
    },
    "activity_summary": {
      "total_transactions": 342,
      "activity_level": "High",
      "activity_description": "45 transactions this month",
      "recent_activity": {
        "last_week": 12,
        "last_month": 45,
        "last_year": 342
      },
      "top_transaction_types": [
        {
          "label": "DeFi",
          "count": 156
        }
      ]
    },
    "summary_text": "Defi Hodler with medium portfolio (275,000 USD). DeFi dominant at 54.5%. Portfolio up 2.80% (24h) 📈. High activity - 45 transactions this month."
  },
  "transactions": {},
  "portfolio": {},
  "user_metadata": {}
}
```

**User Classifications:**

- **NFT Maniac** - Heavy NFT portfolio (>30% NFT holdings)
- **DeFi Hodler** - Significant DeFi positions (>40% DeFi holdings)
- **Futures Trader** - Active futures trading patterns
- **BTC Keeper** - Bitcoin-dominant portfolio (>60% BTC)
- **Degen** - High-frequency diverse trading activity
- **Hodler** - Long-term holding with low activity

**Examples:**

<details>
<summary>JavaScript (Axios)</summary>

```javascript
const axios = require("axios");

const response = await axios.get(
  "https://connect-api.kryptos.io/api/v1/profiling",
  {
    headers: {
      "X-API-Key": "your_api_key_here",
    },
  }
);

const summary = response.data.summary;
console.log(`User Type: ${summary.classification}`);
console.log(`Portfolio Value: $${summary.portfolio_overview.total_value}`);
console.log(
  `Dominant Category: ${summary.portfolio_overview.dominant_category}`
);
```

</details>

<details>
<summary>Python</summary>

```python
import requests

headers = {'X-API-Key': 'your_api_key_here'}
response = requests.get(
    'https://connect-api.kryptos.io/api/v1/profiling',
    headers=headers
)

summary = response.json()['summary']
print(f"User Type: {summary['classification']}")
print(f"Portfolio Value: ${summary['portfolio_overview']['total_value']}")
print(f"Activity Level: {summary['activity_summary']['activity_level']}")
```

</details>

---

## Legacy Endpoints (V0)

V0 endpoints return data in the original format. Use V1 endpoints for new integrations.

### V0: Wallets

```
GET /v0/wallets
```

**Query Parameters:** `portfolioId`, `limit`, `offset`, `includeCount`

### V0: Transactions (GET)

```
GET /v0/transactions
```

**Query Parameters:** Same as V1 transactions

### V0: Transactions (POST)

```
POST /v0/transactions
```

**Required Permissions:** `write:transactions`

**Request Body:**

```json
{
  "walletId": "wallet_123",
  "transactions": [
    {
      "timestamp": 1640995200000,
      "transactionType": "trade",
      "transactionId": "manual_001",
      "description": {
        "title": "Manual Trade",
        "desc": "Bought Bitcoin"
      },
      "sentCurrency": {
        "currency": "USD",
        "amount": 50000
      },
      "receivedCurrency": {
        "currency": "BTC",
        "amount": 1.0
      },
      "label": "Purchase"
    }
  ]
}
```

### V0: NFT Holdings

```
GET /v0/nft-holdings
```

**Query Parameters:** `limit`, `sortByHighestValue`

### V0: DeFi Holdings

```
GET /v0/defi-holdings
```

**Query Parameters:** `docId`, `limit`, `sortByHighestValue`

---

## Error Handling

All errors follow a consistent format:

### 400 Bad Request

```json
{
  "error": "invalid_parameters",
  "message": "Invalid query parameters",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "string",
      "path": ["limit"],
      "message": "Expected number, received string"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "error": "unauthorized",
  "message": "Invalid or missing authentication token"
}
```

**Solutions:**

- Check that you're including the `X-API-Key` header
- Verify your API key is correct
- Ensure your API key hasn't been revoked

### 403 Forbidden

```json
{
  "error": "forbidden",
  "message": "Insufficient scopes. Required scopes not met"
}
```

**Solutions:**

- Check your API key's permissions
- Create a new API key with appropriate scopes
- Review the endpoint's required permissions

### 404 Not Found

```json
{
  "error": "not_found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests"
}
```

**Solutions:**

- Implement exponential backoff
- Reduce request frequency
- Upgrade to a higher tier

### 500 Internal Server Error

```json
{
  "error": "internal_server_error",
  "message": "An unexpected error occurred"
}
```

**Solution:** Contact support if persistent

---

## Code Examples

### Complete API Client

<details>
<summary>JavaScript/Node.js Client</summary>

```javascript
const axios = require("axios");

class KryptosAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = "https://connect-api.kryptos.io/api";
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "X-API-Key": apiKey,
      },
    });
  }

  async request(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  }

  // User Info
  async getUserInfo() {
    return this.request("/v1/userinfo");
  }

  // Holdings
  async getHoldings() {
    return this.request("/v1/holdings");
  }

  // Transactions
  async getTransactions(params = {}) {
    return this.request("/v1/transactions", params);
  }

  // DeFi Holdings
  async getDefiHoldings(params = {}) {
    return this.request("/v1/defi-holdings", params);
  }

  // NFT Holdings
  async getNFTHoldings(params = {}) {
    return this.request("/v1/nft-holdings", params);
  }

  // User Profiling
  async getProfiling() {
    return this.request("/v1/profiling");
  }
}

// Usage
const client = new KryptosAPI(process.env.KRYPTOS_API_KEY);

async function main() {
  // Get holdings
  const holdings = await client.getHoldings();
  if (holdings.success) {
    console.log("Total Value:", holdings.data.summary.totalValue);
  }

  // Get recent transactions
  const transactions = await client.getTransactions({
    limit: 10,
    order: "desc",
  });
  if (transactions.success) {
    console.log("Recent Transactions:", transactions.data.data.length);
  }

  // Get user profiling
  const profiling = await client.getProfiling();
  if (profiling.success) {
    console.log("User Type:", profiling.data.summary.classification);
  }
}

main();
```

</details>

<details>
<summary>Python Client</summary>

```python
import requests
from typing import Dict, Any, Optional

class KryptosAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = 'https://connect-api.kryptos.io/api'
        self.session = requests.Session()
        self.session.headers.update({'X-API-Key': api_key})

    def request(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Make an authenticated API request."""
        try:
            response = self.session.get(
                f'{self.base_url}{endpoint}',
                params=params or {}
            )
            response.raise_for_status()
            return {'success': True, 'data': response.json()}
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': e.response.json() if e.response else str(e),
                'status': e.response.status_code if e.response else None
            }

    # User Info
    def get_user_info(self) -> Dict[str, Any]:
        return self.request('/v1/userinfo')

    # Holdings
    def get_holdings(self) -> Dict[str, Any]:
        return self.request('/v1/holdings')

    # Transactions
    def get_transactions(self, **params) -> Dict[str, Any]:
        return self.request('/v1/transactions', params=params)

    # DeFi Holdings
    def get_defi_holdings(self, **params) -> Dict[str, Any]:
        return self.request('/v1/defi-holdings', params=params)

    # NFT Holdings
    def get_nft_holdings(self, **params) -> Dict[str, Any]:
        return self.request('/v1/nft-holdings', params=params)

    # User Profiling
    def get_profiling(self) -> Dict[str, Any]:
        return self.request('/v1/profiling')

# Usage
import os

client = KryptosAPI(os.getenv('KRYPTOS_API_KEY'))

# Get holdings
holdings = client.get_holdings()
if holdings['success']:
    print(f"Total Value: ${holdings['data']['summary']['totalValue']}")

# Get recent transactions
transactions = client.get_transactions(limit=10, order='desc')
if transactions['success']:
    print(f"Recent Transactions: {len(transactions['data']['data'])}")

# Get user profiling
profiling = client.get_profiling()
if profiling['success']:
    print(f"User Type: {profiling['data']['summary']['classification']}")
```

</details>

---

## Support

- **📧 Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **🌐 Website:** [https://kryptos.io](https://kryptos.io)
- **💻 GitHub:** [https://github.com/Kryptoskatt/Kryptos-Standard-Docs](https://github.com/Kryptoskatt/Kryptos-Standard-Docs)
- **📖 Interactive Docs:** [https://connect-api.kryptos.io/docs/](https://connect-api.kryptos.io/docs/)

---

**© 2024 Kryptos. All rights reserved.**
