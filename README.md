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

### 2. Use Swagger UI (Interactive Testing)

```bash
cd swagger-ui
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

**Features:**
- 🌐 Try API endpoints directly in browser
- 🔐 Test with your API key
- 📖 See live request/response examples
- 💻 Copy code snippets

### 3. Install TypeScript Types

```typescript
import {
  Asset,
  Transaction,
  HoldingsType,
  DefiHolding,
  NFTBalance,
  TaxPnL
} from "@kryptos/types";
```

---

## 🔑 Creating API Keys

**Step 1:** Log in to [Kryptos.io](https://kryptos.io)

**Step 2:** Navigate to **Settings** → **API Keys**

**Step 3:** Click **"Create New API Key"**

**Step 4:** Configure your key:
- Name your key (e.g., "Production API")
- Select permissions (`read:holdings`, `read:transactions`, etc.)
- Optional: Set IP restrictions
- Optional: Set expiration date

**Step 5:** **Copy your key** (shown only once!)

```
Example: sk_live_1234567890abcdefghijklmnop
```

**Complete Guide:** See [API-DOCUMENTATION.md#creating-api-keys](./API-DOCUMENTATION.md#creating-api-keys)

---

## 📖 API Endpoints

### Base URL
```
https://connect.kryptos.io/api
```

### V1 Endpoints (Modern V2 Format)

| Endpoint | Method | Description | Required Permission |
|----------|--------|-------------|---------------------|
| `/v1/userinfo` | GET | Get user information | `read:profile` |
| `/v1/holdings` | GET | Get cryptocurrency holdings | `read:holdings` |
| `/v1/transactions` | GET | Get transaction history | `read:transactions` |
| `/v1/defi-holdings` | GET | Get DeFi positions | `read:defi` |
| `/v1/nft-holdings` | GET | Get NFT holdings | `read:nft` |
| `/v1/profiling` | GET | Get user analytics | `read:analytics` |

### V0 Endpoints (Legacy Format)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v0/wallets` | GET | Get user wallets |
| `/v0/transactions` | GET/POST | Get/Create transactions |
| `/v0/nft-holdings` | GET | Get NFT holdings |
| `/v0/defi-holdings` | GET | Get DeFi holdings |

**Full API Reference:** [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)

---

## 💻 Quick Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_KEY = 'your_api_key_here';

// Get Holdings
async function getHoldings() {
  const response = await axios.get(
    'https://connect.kryptos.io/api/v1/holdings',
    {
      headers: { 'X-API-Key': API_KEY }
    }
  );

  console.log('Total Value:', response.data.summary.totalValue);
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

## 📦 TypeScript Types

Complete type definitions for all Kryptos data structures.

### Core Types

- **[asset.ts](./types/asset.ts)** - Asset types (crypto, NFT, fiat)
- **[transaction.ts](./types/transaction.ts)** - Transaction and ledger types
- **[holdings.ts](./types/holdings.ts)** - Portfolio holdings types
- **[defi.ts](./types/defi.ts)** - DeFi protocol types (lending, staking, farming)
- **[nft-balance.ts](./types/nft-balance.ts)** - NFT collection types
- **[tax.ts](./types/tax.ts)** - Tax calculation types

### Usage Example

```typescript
import {
  Asset,
  Transaction,
  HoldingsType,
  DefiHolding,
  NFTBalance
} from '@kryptos/types';

// Define an asset
const bitcoin: Asset = {
  tokenId: 'bitcoin',
  symbol: 'BTC',
  publicName: 'Bitcoin',
  chainId: 'bitcoin',
  logoUrl: 'https://...',
  standard: 'Native',
  explorerUrl: 'https://blockchain.com',
  category: 'cryptocurrency',
  type: 'crypto',
  providerId: { coingecko: 'bitcoin' }
};

// Use with API responses
async function getTypedHoldings(): Promise<HoldingsType[]> {
  const response = await fetch('https://connect.kryptos.io/api/v1/holdings', {
    headers: { 'X-API-Key': API_KEY }
  });

  const data = await response.json();
  return data.holdings as HoldingsType[];
}
```

---

## 📂 Project Structure

```
Kryptos-Standard-Docs/
│
├── README.md                     📖 This file - Start here!
├── API-DOCUMENTATION.md          ⭐ Complete API reference
│
├── swagger-ui/                   🌐 Interactive API explorer
│   ├── index.html               (Open in browser to test APIs)
│   ├── README.md
│   └── package.json
│
├── types/                        📦 TypeScript type definitions
│   ├── asset.ts                 (Crypto, NFT, Fiat types)
│   ├── transaction.ts           (Transaction & ledger types)
│   ├── holdings.ts              (Portfolio types)
│   ├── defi.ts                  (DeFi protocol types)
│   ├── nft-balance.ts           (NFT collection types)
│   └── tax.ts                   (Tax calculation types)
│
├── docs/                         📚 Docusaurus site (optional)
└── src/                          🎨 React components (optional)
```

---

## 🎯 Common Use Cases

### 1. Get Portfolio Value

```bash
curl -X GET "https://connect.kryptos.io/api/v1/holdings" \
  -H "X-API-Key: your_api_key_here"
```

### 2. Get Recent Transactions

```bash
curl -X GET "https://connect.kryptos.io/api/v1/transactions?limit=10&order=desc" \
  -H "X-API-Key: your_api_key_here"
```

### 3. Track DeFi Positions

```bash
curl -X GET "https://connect.kryptos.io/api/v1/defi-holdings?chain=ethereum" \
  -H "X-API-Key: your_api_key_here"
```

### 4. View NFT Collection

```bash
curl -X GET "https://connect.kryptos.io/api/v1/nft-holdings?chain=ethereum" \
  -H "X-API-Key: your_api_key_here"
```

### 5. Get User Analytics

```bash
curl -X GET "https://connect.kryptos.io/api/v1/profiling" \
  -H "X-API-Key: your_api_key_here"
```

---

## ⚠️ Error Handling

| Status Code | Meaning | Solution |
|-------------|---------|----------|
| `400` | Bad Request | Check request parameters |
| `401` | Unauthorized | Verify API key |
| `403` | Forbidden | Check API key permissions |
| `404` | Not Found | Verify endpoint URL |
| `429` | Rate Limited | Reduce request frequency |
| `500` | Server Error | Contact support |

**Detailed Error Guide:** [API-DOCUMENTATION.md#error-handling](./API-DOCUMENTATION.md#error-handling)

---

## 🔐 Security Best Practices

1. ✅ **Never commit API keys** to version control
2. ✅ **Use environment variables** to store keys
3. ✅ **Rotate keys regularly** (every 90 days recommended)
4. ✅ **Use minimal permissions** for each key
5. ✅ **Set IP restrictions** when possible
6. ✅ **Delete unused keys** immediately
7. ✅ **Always use HTTPS** for API requests

---

## 🛠️ Available Tools

### 1. Swagger UI (Interactive Docs)
**Location:** `swagger-ui/index.html`

**Start:**
```bash
cd swagger-ui
python3 -m http.server 8000
# Open http://localhost:8000
```

**Features:**
- Test APIs directly in browser
- Try with your API key
- See live responses
- Copy code examples

### 2. Complete API Documentation
**File:** `API-DOCUMENTATION.md`

**Includes:**
- All endpoints with specifications
- Authentication guide
- Code examples (JavaScript, Python, cURL)
- Error handling
- Type definitions

### 3. TypeScript Types
**Location:** `types/` directory

**Usage:**
```typescript
import { Asset, Transaction } from '@kryptos/types';
```

---

## 📞 Support

- **📧 Email:** [support@kryptoskatt.com](mailto:support@kryptoskatt.com)
- **🌐 Website:** [https://kryptos.io](https://kryptos.io)
- **💬 Discord:** [https://discord.gg/kryptos](https://discord.gg/kryptos)
- **💻 GitHub:** [https://github.com/kryptoskatt](https://github.com/kryptoskatt)
- **📖 Documentation:** [https://docs.kryptos.io](https://docs.kryptos.io)

---

## 🎉 Quick Links

| Resource | Description | Link |
|----------|-------------|------|
| **API Documentation** | Complete reference | [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) |
| **Swagger UI** | Interactive testing | [swagger-ui/](./swagger-ui/) |
| **Type Definitions** | TypeScript types | [types/](./types/) |

---

## 📝 What's New

### Version 1.0.0 (Current)

✅ **Complete API Documentation**
- All V0 and V1 endpoints documented
- Step-by-step API key creation guide
- Request/Response examples
- Error handling guide

✅ **Swagger UI Integration**
- Interactive API testing
- Live request/response preview
- Code generation

✅ **TypeScript Type Definitions**
- Complete type coverage
- JSDoc documentation
- Import-ready packages

✅ **Code Examples**
- JavaScript/Node.js examples
- Python examples
- cURL commands
- Complete API clients

---

## 🚀 Getting Started Checklist

- [ ] Create API key at [Kryptos.io](https://kryptos.io)
- [ ] Read [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)
- [ ] Try [Swagger UI](./swagger-ui/) with your key
- [ ] Run example code
- [ ] Integrate with your application

---

**© 2024 Kryptos. All rights reserved.**
