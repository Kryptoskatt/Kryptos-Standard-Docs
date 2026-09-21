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

## What a key can reach

:::caution `/v1/users/*` only
API keys authenticate against the user endpoints — `GET /v1/users/me` and the profile writes.
**Every other endpoint in this reference accepts a bearer token and rejects `x-api-key` with
`401 unauthorized`**, including `/v1/holdings`, `/v1/transactions` and `/v1/integrations`.

For portfolio, transaction and integration data use an [access token](/docs/authentication/oauth) or
[Kryptos Connect](/docs/kryptos-connect/overview). Broader API-key coverage is on the roadmap — talk
to [support@kryptos.io](mailto:support@kryptos.io) if it blocks you.
:::

## Usage

Send the key in the `x-api-key` header:

```bash
curl -X GET "https://api-v2.kryptos.io/v1/users/me" \
  -H "x-api-key: kryptos_live_xxxxxxxxxxxxxxxxxxxx"
```

Two differences from a bearer token:

- **No `Authorization` header.** Send `x-api-key` on its own, not both.
- **The workspace comes from the key.** A key is bound to one workspace when it is created, so you do
  not pass `?wid=`. Passing a *different* workspace id is rejected with `403 forbidden`. Keys issued
  before workspace binding carry no workspace and resolve it from `?wid=` instead; those are rejected
  outright once binding is enforced, so reissue them.

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

API keys use the **same scope vocabulary as OAuth tokens**. Given the surface a key can reach today,
one pair matters:

| Scope | Grants access to |
| --- | --- |
| `users:read` | [`GET /v1/users/me`](/docs/api/userinfo) |
| `users:write` | The profile writes |

The rest of the vocabulary (`portfolios`, `transactions`, `integrations`, `contacts`, …) applies to
access tokens — see [Available Scopes](/docs/authentication/oauth#available-scopes). A key may carry
them, but no endpoint currently accepts a key for those resources.

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

async function getProfile() {
  const response = await axios.get("https://api-v2.kryptos.io/v1/users/me", {
    headers: { "x-api-key": API_KEY },
  });
  return response.data;
}
```
