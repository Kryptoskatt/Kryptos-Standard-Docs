---
id: api-key
title: API Key
sidebar_position: 2
---

# API Key Authentication

:::info Paid plans only
API key support is available for **paying customers only**. Contact [support@kryptos.io](mailto:support@kryptos.io) for more information.
:::

API keys authenticate your own application against your own workspaces — server-to-server, with no user
in the loop. To access *another* user's data, use [OAuth 2.0](/docs/authentication/oauth) or
[Kryptos Connect](/docs/kryptos-connect/overview) instead.

## Usage

Send the key in the `x-api-key` header, and name the workspace:

```bash
curl -X GET "https://api-v2.kryptos.io/v1/holdings?wid=WORKSPACE_ID" \
  -H "x-api-key: kryptos_live_xxxxxxxxxxxxxxxxxxxx"
```

Two differences from a bearer token:

- **No `Authorization` header.** Send `x-api-key` on its own, not both.
- **The workspace is required.** Unlike an OAuth access token, a key is not bound to a workspace, so
  every request must carry `?wid=` (or `?workspaceId=`, or the equivalent body field). Omitting it
  returns `400 bad_request`. The key's owner must be a member of that workspace, or you get
  `403 forbidden`.

## Creating API Keys

1. Log in to [enterprise.kryptos.io](https://enterprise.kryptos.io)
2. Navigate to **Settings** → **API Keys**
3. Click **"Create New API Key"**
4. Configure your key:
   - Name your key (e.g., "Production API")
   - Select scopes
   - Optional: Set IP restrictions
   - Optional: Set expiration date
5. **Copy your key** (shown only once!)

Keys are created, rotated and revoked from the dashboard only — **a key cannot mint or manage keys,
including itself.** That is deliberate: a leaked key cannot be used to create more.

## Scopes

API keys use the **same scope vocabulary as OAuth tokens**. For the read-only endpoints documented under
[API Reference](/docs/api/overview), these are the ones that matter:

| Scope | Grants access to |
| --- | --- |
| `portfolios:read` | [Holdings](/docs/api/holdings), [calculated balances](/docs/api/holdings), [DeFi](/docs/api/defi), [NFTs](/docs/api/nfts), [portfolios](/docs/api/portfolios) |
| `transactions:read` | [Transactions](/docs/api/transactions), [ledgers](/docs/api/ledgers), [spam](/docs/api/spam) |
| `integrations:read` | [Integrations](/docs/api/integrations) |
| `contacts:read` | [Contacts](/docs/api/contacts), [counterparties](/docs/api/counterparties) |
| `users:read` | [User profile](/docs/api/userinfo) |

Write scopes and further resources (`tax`, `accounting`, `reports`, `invoices`, `swaps`, `workspace`)
exist in the same vocabulary — see [Available Scopes](/docs/authentication/oauth#available-scopes).

Each endpoint page lists the scope it needs as **Required Permission**. A key missing it gets
`403 insufficient_scope` with the missing scope named in `error_description`.

Grant only what you need — a reporting integration wants `portfolios:read` and `transactions:read`, not
their write counterparts.

## Best Practices

1. **Never expose your API key** in client-side code — it is a bearer credential with no user consent step
2. **Use environment variables** to store keys
3. **Rotate keys regularly** from the dashboard
4. **Use IP restrictions** when your callers have stable addresses
5. **Set an expiry** so a forgotten key doesn't live forever
6. **Revoke keys you no longer use** rather than leaving them valid

## Example

```javascript
const axios = require("axios");

const API_KEY = process.env.KRYPTOS_API_KEY;
const WORKSPACE_ID = process.env.KRYPTOS_WORKSPACE_ID;

async function getHoldings() {
  const response = await axios.get("https://api-v2.kryptos.io/v1/holdings", {
    headers: { "x-api-key": API_KEY },
    params: { wid: WORKSPACE_ID },
  });
  return response.data;
}
```
