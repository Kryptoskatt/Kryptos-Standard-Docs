---
id: api-key
title: API Key
sidebar_position: 2
---

# API Key Authentication

:::warning Enterprise Only
API key support is currently available for **Enterprise customers only**. Contact [support@kryptos.io](mailto:support@kryptos.io) for more information.
:::

## Usage

Include your API key in the `X-API-Key` header:

```bash
curl -X GET "https://connect.kryptos.io/api/v1/holdings" \
  -H "X-API-Key: kryptos_live_xxxxxxxxxxxxxxxxxxxx"
```

## Creating API Keys

1. Log in to [enterprise.kryptos.io](https://enterprise.kryptos.io)
2. Navigate to **Settings** → **API Keys**
3. Click **"Create New API Key"**
4. Configure your key:
   - Name your key (e.g., "Production API")
   - Select permissions
   - Optional: Set IP restrictions
   - Optional: Set expiration date
5. **Copy your key** (shown only once!)

## Permissions

| Permission           | Required For            |
| -------------------- | ----------------------- |
| `read:profile`       | `/v1/userinfo`          |
| `read:holdings`      | `/v1/holdings`          |
| `read:transactions`  | `/v1/transactions`      |
| `read:defi`          | `/v1/defi-holdings`     |
| `read:nft`           | `/v1/nft-holdings`      |
| `read:analytics`     | `/v1/profiling`         |
| `write:transactions` | `POST /v0/transactions` |

## Best Practices

1. **Never expose your API key** in client-side code
2. **Use environment variables** to store keys
3. **Rotate keys regularly** for security
4. **Use IP restrictions** when possible
5. **Monitor usage** in the dashboard

## Example

```javascript
const axios = require("axios");

const API_KEY = process.env.KRYPTOS_API_KEY;

async function getHoldings() {
  const response = await axios.get(
    "https://connect.kryptos.io/api/v1/holdings",
    {
      headers: { "X-API-Key": API_KEY },
    }
  );
  return response.data;
}
```
