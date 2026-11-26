---
id: api-key
title: API Key
sidebar_position: 2
---

# API Key Authentication

:::info Paid plans only
API key support is available for **paying customers only**. Contact [support@kryptos.io](mailto:support@kryptos.io) for more information.
:::

API keys authenticate your own application against one of your own workspaces — server-to-server, with no user
in the loop. To access *another* user's data, use [OAuth 2.0](/docs/authentication/oauth) or
[Kryptos Connect](/docs/kryptos-connect/overview) instead.

## What a key can reach

A key is bound to **one workspace** and works only while that workspace has an **active paid plan**
(otherwise `403 PAID_PLAN_REQUIRED`). It can call:

| Area | Endpoints (under `/v1`) | Methods |
| --- | --- | --- |
| Portfolio | `holdings`, `calculated-balances`, `liabilities`, `defi`, `nfts`, `dashboard`, `graphs` | All the endpoint supports |
| Transactions | `transactions`, `ledgers`, `spam`, `reconciliation`, `counter-parties` | All |
| Accounting and reports | `accounting`, `reports`, `enterprise/reports`, `coa`, `audit`, `audit-log` | All, except report generation |
| Other | `recompute`, `quote`, `swaps`, `staking`, `tasks`, `POST auto-sync/trigger` | All |
| The key's workspace | `workspaces/{wid}` (GET, PATCH), and its `tax-settings`, `tax-information`, `custom-asset-prices`, `chain-comply/case` | All |
| Integrations | `integrations`, `portfolios`, `sync` | **GET only** |
| Your profile | [`users/me`](/docs/api/userinfo) | GET, PATCH |

Everything else refuses keys with `403 forbidden` (`This endpoint does not accept API keys`). That
includes report generation and AI briefings (they queue work and spend credits), adding or removing
integrations, and creating, deleting or resetting workspaces.

## Usage

Send the key in the `x-api-key` header:

```bash
curl -X GET "https://api-v2.kryptos.io/v1/users/me" \
  -H "x-api-key: sk_live_xxxxxxxxxxxxxxxxxxxx"
```

Two differences from a bearer token:

- **No `Authorization` header.** Send `x-api-key` on its own, not both.
- **The workspace comes from the key.** A key is bound to one workspace when it is created, so you do
  not pass `?wid=`. Passing a *different* workspace id is rejected with `403 forbidden`. Keys issued
  before workspace binding carry no workspace and are refused with `403` (`This API key is not bound to
  a workspace. Create a new key.`): create a new one.

Keys start with `sk_live_` (or `sk_test_` for test keys).

## Creating API Keys

1. Log in to [enterprise.kryptos.io](https://enterprise.kryptos.io)
2. Navigate to **Settings** → **API Keys**
3. Click **"Create New API Key"**
4. Configure your key:
   - Name your key (e.g., "Production API")
   - Select scopes
   - Optional: Set IP restrictions
   - Expiry: 90 days by default, at most 365. Every key expires
5. **Copy your key** (shown only once!)

Keys are created, rotated and revoked from the dashboard only — **a key cannot mint or manage keys,
including itself.** That is deliberate: a leaked key cannot be used to create more.

For the same reason a key can't read or change **who has access** to the workspace: members, invites,
and CPA invitations and licences are not available to keys, not even to read. Manage them in the app.

## Scopes

API keys use the **same scope vocabulary as OAuth tokens** (see
[Available Scopes](/docs/authentication/oauth#available-scopes)), chosen when you create the key. An
endpoint the key can reach still needs the key to carry its scope: `portfolios:read` for holdings,
`transactions:read` for transactions and ledgers, `transactions:write` to edit them, and so on.

Each endpoint page lists the scope it needs as **Required Permission**. A key missing it gets
`403 insufficient_scope` with the missing scope named in `error_description`.

Grant only what you need — a reporting integration wants `portfolios:read` and `transactions:read`, not
their write counterparts.

## Best Practices

1. **Never expose your API key** in client-side code — it is a bearer credential with no user consent step
2. **Use environment variables** to store keys
3. **Rotate keys regularly** from the dashboard
4. **Use IP restrictions** when your callers have stable addresses
5. **Plan for expiry**: every key expires (90 days by default, 365 at most), so rotate before it does
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
