---
id: backend
title: Backend Implementation
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Backend Implementation

This guide covers the server-side implementation required for Kryptos Connect. Your backend is responsible for securely creating link tokens, exchanging public tokens for an access token and a refresh token, refreshing the access token, managing user sessions, and making authenticated API calls on behalf of your users.

## Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │         │    Your     │         │  Kryptos    │
│   App       │         │   Backend   │         │  Connect    │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │ 1. Request link token │                       │
       ├──────────────────────►│                       │
       │                       │ 2. Create link token  │
       │                       ├──────────────────────►│
       │                       │                       │
       │                       │◄──────────────────────┤
       │                       │   link_token          │
       │◄──────────────────────┤                       │
       │   link_token          │                       │
       │                       │                       │
       │ 3. Open widget        │                       │
       ├───────────────────────┼──────────────────────►│
       │                       │   User authenticates  │
       │                       │   and grants consent  │
       │◄──────────────────────┼───────────────────────┤
       │   public_token        │                       │
       │                       │                       │
       │ 4. Exchange token     │                       │
       ├──────────────────────►│                       │
       │                       │ 5. Exchange token     │
       │                       ├──────────────────────►│
       │                       │                       │
       │                       │◄──────────────────────┤
       │                       │ access_token +        │
       │◄──────────────────────┤ refresh_token,grant_id│
       │   Success             │                       │
```

## Step 1: Create Link Token

Create a link token endpoint on your backend that the Web SDK's `generateLinkToken` function will call. The implementation depends on whether the user is new or returning:

**Endpoint:** `POST https://connect-api.kryptos.io/link-token`

**Authentication:** Client credentials via `X-Client-Id` and `X-Client-Secret` headers

**Request body:**

| Field          | Type   | Required | Description                                                                                                                                                                  |
| -------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scopes`       | string | Yes      | Space-separated. Every scope must be one your client has, or the call fails. It does **not** narrow the session: the user is always asked for your client's read scopes. |
| `access_token` | string | No       | The user's current access token, to resume their session (see [Resume Existing Session](#resume-existing-session)).                                                        |
| `state`        | string | No       | Your own value, kept with the link token.                                                                                                                                  |
| `metadata`     | object | No       | Your own data, kept with the link token.                                                                                                                                   |

Returns `201 Created`. Errors: `400` with `Invalid scopes: …` (a scope your client doesn't have),
`400 TOKEN_CLIENT_MISMATCH` (the `access_token` belongs to another client),
`400 CONNECT_API_TOKEN_NOT_RESUMABLE` (a white-label workspace token), and `401` for bad client
credentials. An expired or revoked `access_token` is not an error: you get a plain link token without
`has_existing_grant`.

### Choosing the Right Approach

| Scenario                                | Include `access_token`? | `isAuthorized` | User Flow (UI)                            | Returns `public_token` |
| --------------------------------------- | ----------------------- | -------------- | ----------------------------------------- | ---------------------- |
| First-time user connecting to Kryptos   | No                   | `false`        | AUTH → INTEGRATION → CONSENT              | Yes                 |
| User doesn't have an access token yet   | No                   | `false`        | AUTH → INTEGRATION → CONSENT              | Yes                 |
| Returning user with stored access token | Yes                  | `true`         | INTEGRATION only (account already exists) | No                  |
| Adding more integrations for user       | Yes                  | `true`         | INTEGRATION only (account already exists) | No                  |

### Implementation Examples

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const KRYPTOS_BASE_URL = "https://connect-api.kryptos.io";

// Endpoint for the Web SDK's generateLinkToken function
app.post("/api/kryptos/create-link-token", async (req, res) => {
  try {
    // Check if user has an existing access token stored
    const existingAccessToken = await getUserAccessToken(req.user?.id);

    const payload = {
      scopes:
        "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
    };

    // If user has existing token, include it to skip authentication
    if (existingAccessToken) {
      payload.access_token = existingAccessToken;
    }

    const response = await axios.post(
      `${KRYPTOS_BASE_URL}/link-token`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
          "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
        },
      },
    );

    // `has_existing_grant` is only present when a valid access_token was supplied and
    // accepted. An expired or revoked token silently yields a plain link token, so read the
    // response rather than assuming the token still worked.
    res.json({
      link_token: response.data.data.link_token,
      isAuthorized: !!response.data.data.has_existing_grant, // true = skip auth, false = full flow
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create link token" });
  }
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
from flask import Flask, request, jsonify
import requests
import os
import time

app = Flask(__name__)

KRYPTOS_BASE_URL = "https://connect-api.kryptos.io"

@app.route("/api/kryptos/create-link-token", methods=["POST"])
def create_link_token():
    try:
        # Check if user has an existing access token stored
        existing_access_token = get_user_access_token(request.user_id)

        payload = {
            "scopes": "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
        }

        # If user has existing token, include it to skip authentication
        if existing_access_token:
            payload["access_token"] = existing_access_token

        response = requests.post(
            f"{KRYPTOS_BASE_URL}/link-token",
            json=payload,
            headers={
                "Content-Type": "application/json",
                "X-Client-Id": os.getenv("KRYPTOS_CLIENT_ID"),
                "X-Client-Secret": os.getenv("KRYPTOS_CLIENT_SECRET"),
            },
        )

        data = response.json()["data"]

        # `has_existing_grant` is only present when a valid access_token was supplied and
        # accepted. An expired or revoked token silently yields a plain link token.
        return jsonify({
            "link_token": data["link_token"],
            "isAuthorized": bool(data.get("has_existing_grant")),
        })
    except Exception as e:
        return jsonify({"error": "Failed to create link token"}), 500
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
header('Content-Type: application/json');

$KRYPTOS_BASE_URL = 'https://connect-api.kryptos.io';

// Check if user has an existing access token stored
$existingAccessToken = getUserAccessToken($userId);

$payload = [
    'scopes' => 'openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read',
];

// If user has existing token, include it to skip authentication
if ($existingAccessToken) {
    $payload['access_token'] = $existingAccessToken;
}

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $KRYPTOS_BASE_URL . '/link-token',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'X-Client-Id: ' . getenv('KRYPTOS_CLIENT_ID'),
        'X-Client-Secret: ' . getenv('KRYPTOS_CLIENT_SECRET'),
    ],
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

// `has_existing_grant` is only present when a valid access_token was supplied and
// accepted. An expired or revoked token silently yields a plain link token.
echo json_encode([
    'link_token' => $result['data']['link_token'],
    'isAuthorized' => !empty($result['data']['has_existing_grant']),
]);
?>
```

</TabItem>
</Tabs>

**Your Backend Response (for Web SDK):**

```json
{
  "link_token": "link_abc123xyz789",
  "isAuthorized": false
}
```

**Kryptos API Response (Fresh Session):**

```json
{
  "success": true,
  "data": {
    "link_token": "link_abc123xyz789",
    "expires_at": "2024-01-28T10:30:00Z"
  }
}
```

**Kryptos API Response (Session Resumed with `access_token`):**

```json
{
  "success": true,
  "data": {
    "link_token": "link_abc123xyz789",
    "expires_at": "2024-01-28T10:30:00Z",
    "user_id": "uuid-user-123",
    "workspace_id": "uuid-workspace-456",
    "has_existing_grant": true
  }
}
```

## Step 2: Exchange Public Token

Create an endpoint to exchange the public token for an access token and a refresh token. The Web SDK's `onSuccess` callback will send the `public_token` to this endpoint.

**Endpoint:** `POST https://connect-api.kryptos.io/token/exchange`

**Authentication:** Client credentials via headers

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
// Endpoint for the Web SDK's onSuccess callback
app.post("/api/kryptos/exchange-token", async (req, res) => {
  try {
    const { public_token } = req.body;

    const response = await axios.post(
      `${KRYPTOS_BASE_URL}/token/exchange`,
      { public_token },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
          "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
        },
      },
    );

    const { access_token, refresh_token, expires_in, grant_id, workspace_id } = response.data.data;

    // Store tokens securely (encrypted) for the user
    await saveUserTokens(req.user.id, {
      access_token,
      refresh_token,
      access_token_expires_at: Date.now() + expires_in * 1000,
      grant_id,
      workspace_id,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to exchange token" });
  }
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
@app.route("/api/kryptos/exchange-token", methods=["POST"])
def exchange_token():
    try:
        public_token = request.json.get("public_token")

        response = requests.post(
            f"{KRYPTOS_BASE_URL}/token/exchange",
            json={"public_token": public_token},
            headers={
                "Content-Type": "application/json",
                "X-Client-Id": os.getenv("KRYPTOS_CLIENT_ID"),
                "X-Client-Secret": os.getenv("KRYPTOS_CLIENT_SECRET"),
            },
        )

        data = response.json()["data"]

        # Store tokens securely for the user
        save_user_tokens(
            request.user_id,
            access_token=data["access_token"],
            refresh_token=data["refresh_token"],
            access_token_expires_at=time.time() + data["expires_in"],
            grant_id=data["grant_id"],
            workspace_id=data["workspace_id"],
        )

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": "Failed to exchange token"}), 500
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$publicToken = $input['public_token'];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'https://connect-api.kryptos.io/token/exchange',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode(['public_token' => $publicToken]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'X-Client-Id: ' . getenv('KRYPTOS_CLIENT_ID'),
        'X-Client-Secret: ' . getenv('KRYPTOS_CLIENT_SECRET'),
    ],
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
$data = $result['data'];

// Store tokens securely for the user
saveUserTokens($userId, [
    'access_token' => $data['access_token'],
    'refresh_token' => $data['refresh_token'],
    'access_token_expires_at' => time() + $data['expires_in'],
    'grant_id' => $data['grant_id'],
    'workspace_id' => $data['workspace_id'],
]);

echo json_encode(['success' => true]);
?>
```

</TabItem>
</Tabs>

**Response:**

```json
{
  "success": true,
  "data": {
    "access_token": "cat_abc123xyz789",
    "refresh_token": "crt_abc123xyz789",
    "grant_id": "cgrant_abc123xyz789",
    "token_type": "Bearer",
    "expires_in": 473040000,
    "refresh_token_expires_in": 2592000,
    "scope": "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
    "workspace_id": "uuid-workspace-123"
  }
}
```

:::info Access and refresh tokens
Store the `access_token`, the `refresh_token` (30 days) and the `grant_id` (to revoke access later).
Exchanged access tokens currently last 15 years, so apps that never refresh keep working; this will change
to **24 hours** on an announced date. Build against `expires_in` and refresh as shown in
[Step 3](#step-3-refresh-the-access-token).
:::

:::tip Complete Integration Flow
**First Connection (New User):**

1. Frontend → `generateLinkToken()` returns `{ link_token, isAuthorized: false }`
2. SDK flow: AUTH → INTEGRATION → CONSENT
3. User signs in, connects integrations and consents
4. `onConnectSuccess` receives `{ public_token: "..." }`
5. Backend exchanges `public_token` for `access_token` and `refresh_token`
6. **IMPORTANT:** Store both (encrypted) in your database for future use

**Subsequent Connections (Returning User):**

1. Frontend → `generateLinkToken()` returns `{ link_token, isAuthorized: true }`
2. SDK flow: INTEGRATION (sign-in and consent skipped)
3. User connects more integrations
4. `onConnectSuccess` receives `null` (no new token needed)
5. Integrations are added to user's existing account
:::

## Step 3: Refresh the Access Token

Refresh with the standard OAuth 2.0 refresh flow at the [OAuth](/docs/authentication/oauth) token endpoint,
authenticating with your client ID and secret (HTTP Basic). There is no Connect-specific refresh endpoint.

**Endpoint:** `POST https://oauth.kryptos.io/oidc/token`

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
async function refreshKryptosToken(userId) {
  const { refresh_token } = await loadUserTokens(userId);

  const response = await axios.post(
    "https://oauth.kryptos.io/oidc/token",
    new URLSearchParams({ grant_type: "refresh_token", refresh_token }),
    {
      auth: {
        username: process.env.KRYPTOS_CLIENT_ID,
        password: process.env.KRYPTOS_CLIENT_SECRET,
      },
    },
  );

  const tokens = response.data;
  // Always store the refresh token you get back: it can be a new one.
  await saveUserTokens(userId, {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    access_token_expires_at: Date.now() + tokens.expires_in * 1000,
  });
  return tokens.access_token;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
def refresh_kryptos_token(user_id):
    refresh_token = load_user_tokens(user_id)["refresh_token"]

    response = requests.post(
        "https://oauth.kryptos.io/oidc/token",
        data={"grant_type": "refresh_token", "refresh_token": refresh_token},
        auth=(os.getenv("KRYPTOS_CLIENT_ID"), os.getenv("KRYPTOS_CLIENT_SECRET")),
    )
    response.raise_for_status()
    tokens = response.json()

    # Always store the refresh token you get back: it can be a new one.
    save_user_tokens(
        user_id,
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        access_token_expires_at=time.time() + tokens["expires_in"],
    )
    return tokens["access_token"]
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST https://oauth.kryptos.io/oidc/token \
  -u "$KRYPTOS_CLIENT_ID:$KRYPTOS_CLIENT_SECRET" \
  -d grant_type=refresh_token \
  -d refresh_token=crt_abc123xyz789
```

</TabItem>
</Tabs>

**Response:**

```json
{
  "access_token": "Xk3v...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "refresh_token": "crt_abc123xyz789",
  "scope": "openid profile email offline_access portfolios:read transactions:read ..."
}
```

**Rules:**

- **Refresh shortly before `expires_in` runs out**, or when an API call returns `401`.
- **Always store the `refresh_token` from the response.** It stays the same until it is past 70% of its
  30-day life, then a new one replaces it and the old one stops working.
- **Refresh one at a time per user.** A refresh token that was already replaced, or revoked, fails with
  `400 invalid_grant` and revokes the grant: the user has to reconnect.
- **Refresh from your backend only.** It needs your client secret, so a leaked refresh token alone is
  useless.

## Step 4: Make API Calls

Use the access token to call Kryptos APIs:

```javascript
async function getUserHoldings(accessToken) {
  const response = await axios.get("https://api-v2.kryptos.io/v1/holdings", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return response.data;
}
```

Refreshed access tokens work the same way. The access token is **read-only**: it carries your client's read scopes, and it is meant for reading the
user's data (transactions, ledgers, holdings, balances, accounting, reports, integrations, syncs and
portfolios). Calls that change data fail with `403 insufficient_scope`, because the token carries no
`:write` scope. Account endpoints (invites, members, workspace management, billing) are not meant for
it either: billing refuses it today with `403 MACHINE_ROUTE_NOT_ALLOWED`, and the other account
endpoints are being switched to the same refusal service by service.

---

## Session Management

### Resume Existing Session

Pass the user's current access token when creating a link token to skip the authentication flow for returning users. If it has expired, refresh it first ([Step 3](#step-3-refresh-the-access-token)):

```javascript
async function createLinkTokenWithSession(userId, existingAccessToken) {
  const response = await axios.post(
    "https://connect-api.kryptos.io/link-token",
    {
      scopes:
        "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
      access_token: existingAccessToken, // Pre-authenticate with existing token
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    },
  );

  return response.data.data;
}
```

**Response with existing session:**

```json
{
  "success": true,
  "data": {
    "link_token": "link_xxx...",
    "expires_at": "...",
    "user_id": "user123",
    "workspace_id": "ws123",
    "has_existing_grant": true
  }
}
```

### Check Session Status

Check if a user has an active session before opening the widget:

```javascript
async function checkSession(accessToken) {
  const response = await axios.post(
    "https://connect-api.kryptos.io/link-token/check-session",
    {
      access_token: accessToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    },
  );

  return response.data.data;
}
```

**Response (Valid Session):**

```json
{
  "success": true,
  "data": {
    "has_valid_session": true,
    "user_id": "uuid-user-123",
    "workspace_id": "uuid-workspace-456",
    "workspace_name": "My Workspace",
    "granted_scopes": "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
    "grant_id": "cgrant_abc123",
    "token_expires_at": "2041-11-16T10:15:00.000Z"
  }
}
```

**Response (No Valid Session):**

```json
{
  "success": true,
  "data": {
    "has_valid_session": false,
    "reason": "TOKEN_EXPIRED"
  }
}
```

`reason` is `no_token_provided`, `workspace_not_bound`, or the token error code: `TOKEN_NOT_FOUND`,
`TOKEN_EXPIRED`, `GRANT_INACTIVE` or `TOKEN_PAYLOAD_MISMATCH`. An access token issued to another client
returns `400 TOKEN_CLIENT_MISMATCH`.

### Revoke Grant

Allow users to disconnect their account by revoking the grant:

**Endpoint:** `POST https://connect-api.kryptos.io/token/revoke`

```javascript
async function revokeGrant(grantId) {
  const response = await axios.post(
    "https://connect-api.kryptos.io/token/revoke",
    {
      grant_id: grantId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    },
  );

  return response.data;
}
```

**Response:**

```json
{
  "success": true,
  "message": "Grant revoked successfully"
}
```

:::warning Grant Revocation
When a grant is revoked, all associated access tokens are immediately invalidated. Any subsequent API calls using those tokens will fail.
:::

### List Connected Grants

Get all active grants for your client:

**Endpoint:** `GET https://connect-api.kryptos.io/token/grants`

```javascript
async function listGrants() {
  const response = await axios.get(
    "https://connect-api.kryptos.io/token/grants",
    {
      headers: {
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    },
  );

  return response.data.data;
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "grants": [
      {
        "grant_id": "cgrant_abc123xyz789",
        "workspace_id": "uuid-workspace-123",
        "scopes": "transactions:read balances:read",
        "created_at": "2024-01-15T10:00:00Z",
        "expires_at": "2039-01-15T10:00:00Z"
      }
    ],
    "count": 1
  }
}
```

### Resync Integration

Trigger a resync on a connected user's wallet, exchange, or CSV integration. Useful when you want to re-pull recent transactions on demand (e.g. a "Refresh" button in your app) or fully re-ingest after a data change.

**Endpoint:** `POST https://connect-api.kryptos.io/developer/integrations/{walletId}/resync`

```javascript
async function resyncIntegration(walletId, userId, mode = "latest") {
  const response = await axios.post(
    `https://connect-api.kryptos.io/developer/integrations/${walletId}/resync`,
    {
      user_id: userId,
      mode, // "latest" or "from_start"
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    },
  );

  return response.data;
}
```

**Modes:**

| Mode         | What it does                                                                             |
| ------------ | ---------------------------------------------------------------------------------------- |
| `latest`     | Incremental refresh — re-pull from where the last sync left off.                          |
| `from_start` | Wipe this integration's data and re-pull everything.                                      |

**Behavior by integration type:**

- **Wallet/exchange** — both modes are supported. The resync runs asynchronously on the Kryptos sync workers.
- **CSV** — **not supported in either mode.** `latest` returns `409 CSV_RESYNC_LATEST_UNSUPPORTED` and
  `from_start` returns `409 CSV_RESYNC_UNSUPPORTED`. To re-import a CSV, upload the file again through
  the SDK — there is nothing to re-fetch from.

**Response (202):**

```json
{
  "success": true,
  "data": {
    "mode": "latest",
    "integration_type": "wallet",
    "wallet_id": "wallet-uuid",
    "job_id": "sync_a1b2c3d4e5f6",
    "status": "queued",
    "note": "Resync runs asynchronously. Poll GET /v1/sync/{job_id}, or GET /v1/integrations to observe status transitioning through SYNCING → COMPLETED."
  }
}
```

`job_id` is the sync id — poll it at
`GET /v1/sync/{job_id}` with the user's access token.

**Errors:**

| Status | Code                            | Description                                                              |
| ------ | ------------------------------- | ------------------------------------------------------------------------ |
| 401    | -                               | Invalid client credentials.                                              |
| 403    | `GRANT_NOT_FOUND`               | The user has not granted your client access (or revoked it).             |
| 404    | `INTEGRATION_NOT_FOUND`         | No wallet with this `walletId` exists for the user.                      |
| 409    | `CSV_RESYNC_LATEST_UNSUPPORTED` | `mode: "latest"` is not valid for a CSV integration.                     |
| 409    | `CSV_RESYNC_UNSUPPORTED`        | CSV integrations cannot be resynced — upload the file again instead.      |
| 409    | `SYNC_DISABLED`                 | Syncing is turned off for this integration.                              |

:::info Asynchronous behavior
The endpoint returns 202 immediately and the resync runs in the background. To observe progress:

- Poll `GET /v1/sync/{job_id}` with the user's access token. Wait
  for a terminal status: `completed`, `partially_synced`, `failed` or `cancelled`. Note
  `partially_synced` is a success with some rows dropped, not a failure.
- Or poll [`GET /v1/integrations`](/docs/api/integrations) and watch the integration's `latestSync`.
- Or listen for the [`integration.updated` and `integration.failed`](/docs/webhooks/events) webhook
  events, which saves you polling entirely.
:::

:::tip There are two resync endpoints
This one is a **partner** endpoint: client credentials, addressed by `user_id`, for acting on a user's
integration from your backend. There is also
`POST /v1/integrations/{id}/resync`, which takes the **user's access token** and offers the full option
set (`functions`, time windows, price-only resync). Use this one when you hold only client credentials;
use `/v1` when you hold an access token.
:::

### Update Transaction Limit

Set or update the per-user transaction import limit for a Guest (anonymous) user. Useful for automating billing tier upgrades, free-trial caps, or admin tooling.

**Endpoint:** `PATCH https://connect-api.kryptos.io/developer/grants/{grantId}/transaction-limit`

```javascript
async function updateTransactionLimit(grantId, { transactionLimit, enableLimiter }) {
  const response = await axios.patch(
    `https://connect-api.kryptos.io/developer/grants/${grantId}/transaction-limit`,
    {
      transactionLimit,
      enableLimiter,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    },
  );

  return response.data;
}

// Examples:
// Raise the limit for a user
await updateTransactionLimit("cgrant_abc123", { transactionLimit: 10000 });

// Disable the limiter entirely
await updateTransactionLimit("cgrant_abc123", { enableLimiter: false });
```

**Path Parameters:**

| Parameter | Type   | Description                                                       |
| --------- | ------ | ----------------------------------------------------------------- |
| `grantId` | string | The grant ID returned from token exchange (e.g. `cgrant_abc123`). |

**Request Body:**

| Field              | Type    | Required | Description                                      |
| ------------------ | ------- | -------- | ------------------------------------------------ |
| `transactionLimit` | number  | No*      | Positive integer. Per-user limit. Not capped, except for white-label workspaces (see below). |
| `enableLimiter`    | boolean | No*      | Whether the limiter is active for this user.     |

\* At least one field is required.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "grant_id": "cgrant_abc123xyz789",
    "user_id": "anon_user_uid",
    "transaction_limit": 10000,
    "enable_limiter": true,
    "previous_transaction_limit": 1000,
    "previous_enable_limiter": true,
    "resync": {
      "triggered": [
        { "integration_id": "int_8ad611a78678", "sync_id": "sync_1f2e3d4c5b6a" }
      ],
      "failed": [],
      "skipped": 0
    }
  }
}
```

| Field                        | Type           | Description                                                          |
| ---------------------------- | -------------- | -------------------------------------------------------------------- |
| `transaction_limit`          | number \| null | The cap after this call                                              |
| `enable_limiter`             | boolean \| null | Whether the limiter is active after this call                       |
| `previous_transaction_limit` | number \| null | The cap **before** this call                                         |
| `previous_enable_limiter`    | boolean \| null | The flag before this call                                           |
| `resync`                     | object \| null | Syncs queued by this change; `null` if nothing changed — see below   |

`previous_transaction_limit` and `previous_enable_limiter` mean the response alone tells you both what
the cap became *and* what it was, with no read-back.

#### A limit change re-syncs the user's wallets

Raising a cap does not backfill anything by itself: an incremental sync resumes from the last
transaction it wrote, so history a previous sync dropped at the old cap stays missing. So whenever this
call **actually changes** the cap, every re-syncable integration in the workspace is queued for a full
re-fetch from the start (`resync_from_start` — prior data is deleted, then the complete range is read
again). You do not need to detect the change and request a resync yourself.

`resync` is `null` when the request changed nothing — restating the current values is a no-op.
Otherwise:

| Field       | Description                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `triggered` | One entry per queued sync, as `{ integration_id, sync_id }`. Poll `GET /v1/sync/{sync_id}` for each                                             |
| `failed`    | Integrations whose sync could not be queued, with the reason                                                                                      |
| `skipped`   | Count of integrations not re-synced: custom wallets, sync-disabled accounts, CSV-fed ones (nothing to re-fetch), and anything past the 100-per-call cap |

A non-zero `skipped` means the fan-out was partial — it is reported so that it never reads as
"everything was re-synced".

#### Reading the resulting cap

To read a workspace's cap later, call
[`GET /v1/workspaces/{workspace_id}`](/docs/api/userinfo#one-workspace) with the **user's access
token** — it requires the `workspace:read` scope, which is in the default client scope set. Its
`limits` block reports `effectiveTransactionLimit` (the cap actually enforced),
`currentTransactionCount` and `remainingTransactions`.

`workspace_id` comes from the [token exchange](#step-2-exchange-public-token) response, and is also
listed per grant by [`GET /token/grants`](#list-connected-grants).

**Errors:**

| Status | Code              | Description                                              |
| ------ | ----------------- | -------------------------------------------------------- |
| 400    | `NOT_ANON_USER`   | User is not a Guest account. Limits only apply to Guest users. |
| 401    | -                 | Invalid client credentials.                              |
| 403    | `ACCESS_DENIED`   | Grant does not belong to this client.                    |
| 403    | `WORKSPACE_NOT_BOUND` | The grant has no workspace (an old grant): the user must reconnect. |
| 403    | `LIMIT_ABOVE_CEILING` | White-label workspace: the limit is above the ceiling Kryptos set for your client, or you tried to switch the limiter off. |
| 404    | `GRANT_NOT_FOUND` | No grant found with this ID.                             |

:::info Guest accounts only
Transaction limits only apply to **Guest** (anonymous) accounts created through your Connect flow. Linked users (who signed in with their existing Kryptos account) manage their own volume and are not subject to developer-imposed limits.

**Resolution order:** per-user override (this endpoint) → workspace default (Developer Portal) → platform default (100,000, limiter on). The first defined value wins. Setting `enableLimiter: false` removes the cap entirely for that user.
:::

### Delete Integration

Delete one of a Guest (anonymous) user's integrations, together with all of its data: transactions,
balances, CSV uploads and sync history. Useful for a "Remove wallet" button in your app.

**Endpoint:** `DELETE https://connect-api.kryptos.io/developer/integrations/{walletId}?user_id={userId}`

```javascript
async function deleteIntegration(walletId, userId) {
  const response = await axios.delete(
    `https://connect-api.kryptos.io/developer/integrations/${walletId}`,
    {
      params: { user_id: userId },
      headers: {
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    },
  );

  return response.data;
}
```

**Path Parameters:**

| Parameter  | Type   | Description                                                                   |
| ---------- | ------ | ----------------------------------------------------------------------------- |
| `walletId` | string | The integration ID, as returned by [`GET /v1/integrations`](/docs/api/integrations). |

**Query Parameters:**

| Parameter | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| `user_id` | string | Yes      | The user the integration belongs to.     |

`user_id` goes in the query string, not a request body, because some HTTP clients and proxies drop the
body of a `DELETE`.

**Response (202):**

```json
{
  "success": true,
  "data": {
    "wallet_id": "int_8ad611a78678",
    "job_id": "task_3c1f9e2a7b4d",
    "status": "deleting",
    "note": "Deletion runs asynchronously. Poll GET /v1/tasks/{job_id}, or wait for the integration.deleted webhook; the integration drops out of GET /v1/integrations once its data is wiped."
  }
}
```

**Errors:**

| Status | Code                    | Description                                                                          |
| ------ | ----------------------- | ------------------------------------------------------------------------------------ |
| 400    | `NOT_ANON_USER`         | User is not a Guest account. Linked users remove their own integrations.             |
| 401    | -                       | Invalid client credentials.                                                          |
| 403    | `GRANT_NOT_FOUND`       | The user has not granted your client access (or revoked it).                         |
| 403    | `WORKSPACE_NOT_BOUND`   | The grant predates workspace binding. The user must authorize your app again.        |
| 404    | `INTEGRATION_NOT_FOUND` | No integration with this `walletId` exists for the user.                             |
| 409    | `DELETE_IN_PROGRESS`    | A delete for this integration is already queued or running. Treat it as success.     |
| 503    | `DELETE_NOT_QUEUED`     | The integration was marked for deletion but the job could not be queued. Retry.      |

:::info Asynchronous behavior
The endpoint returns 202 once the delete is queued, not when it has finished. Until then the
integration still appears in [`GET /v1/integrations`](/docs/api/integrations) with
`accountStatus: "deleting"` and can no longer be synced. To know when it is gone:

- Listen for the [`integration.deleted`](/docs/webhooks/events#integration-events) webhook, sent with
  `status: "DELETED"` once the data has been removed. If removal fails you get `integration.failed`
  instead, and the integration stays `deleting`.
- Or poll `GET /v1/integrations` until the integration is no longer listed.
- Or poll `GET /v1/tasks/{job_id}` with the user's access token until `status` is `completed`
  (or `failed`).

Balances and reports for the user are recalculated without the integration afterwards.
:::

:::tip Safe to retry
Calling this again for the same integration never starts a second delete. While one is still queued or
running you get `409 DELETE_IN_PROGRESS`. If the earlier attempt failed (`integration.failed`, or a
`503`), calling again queues it again, and that is how you finish a delete that got stuck.
:::

:::info Guest accounts only
Like transaction limits, this endpoint only acts on **Guest** (anonymous) accounts created through your
Connect flow. A Linked user's workspace belongs to them, so you can't delete their integrations with
client credentials.
:::

---

## Error Handling

Errors look different on each host.

### Connect API (`connect-api.kryptos.io`)

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

| Status | `code`                   | Meaning                                                    | What to do                               |
| ------ | ------------------------ | ---------------------------------------------------------- | ---------------------------------------- |
| 401    | (none)                   | `Invalid client credentials` or `Client is inactive`       | Check your client ID and secret; contact Kryptos if your client was switched off |
| 400    | (none)                   | `Invalid scopes: …` on `/link-token`                       | Request only scopes your client has      |
| 404    | `TOKEN_NOT_FOUND`        | Link, public or access token not found                     | Start a new session                      |
| 401    | `TOKEN_EXPIRED`          | Link, public or access token expired                       | Start a new session, or refresh          |
| 401    | `TOKEN_USED`             | Public or link token already used                          | Start a new session                      |
| 401    | `TOKEN_REVOKED`          | Token revoked                                              | Start a new session                      |
| 401    | `GRANT_INACTIVE`         | The user's grant was revoked                               | The user must reconnect                  |
| 401    | `TOKEN_PAYLOAD_MISMATCH` | Token doesn't match its grant                              | The user must reconnect                  |
| 400    | `TOKEN_CLIENT_MISMATCH`  | The token belongs to another client                        | Use your own client's token              |
| 404    | `GRANT_NOT_FOUND`        | No grant with this ID                                      | Check the `grant_id`                     |
| 403    | `ACCESS_DENIED`          | The grant belongs to another client                        | Use your own grants                      |
| 403    | `WORKSPACE_NOT_BOUND`    | An old grant with no workspace                             | The user must reconnect                  |
| 400    | `NOT_ANON_USER`          | Transaction limits apply to Guest users only               | Don't set limits on linked users         |

### Kryptos API (`api-v2.kryptos.io`)

OAuth-style errors, with no `success` field:

| Status | `error`              | Meaning                                                   | What to do                     |
| ------ | -------------------- | --------------------------------------------------------- | ------------------------------ |
| 401    | `invalid_token`      | The access token expired, was revoked, or doesn't exist   | Refresh, then reconnect        |
| 401    | `invalid_client`     | `Client is inactive`: Kryptos switched your client off    | Contact Kryptos                |
| 403    | `insufficient_scope` | The token lacks the endpoint's scope (every write, for a Connect token) | Read only; see [Step 4](#step-4-make-api-calls) |
| 403    | `forbidden` with `"code": "MACHINE_ROUTE_NOT_ALLOWED"` | The endpoint is not available to Connect tokens | See [Step 4](#step-4-make-api-calls) |

See [Error Codes](/docs/reference/errors) for the full list.

### OAuth token endpoint (`oauth.kryptos.io/oidc/token`)

| Status | `error`          | Meaning                                                              | What to do           |
| ------ | ---------------- | -------------------------------------------------------------------- | -------------------- |
| 400    | `invalid_grant`  | Refresh token expired, replaced, or its grant revoked                | The user must reconnect |
| 401    | `invalid_client` | Wrong client ID or secret, or the client is switched off             | Check credentials    |

### Handling Expired Tokens and Revoked Grants

A `401` from the API means the access token expired or access was revoked. Refresh once; if the refresh
fails with `invalid_grant`, the grant is gone (the user disconnected, you revoked it, a replaced refresh
token was reused, or Kryptos switched your client off) and the user has to reconnect:

```javascript
async function callKryptos(userId, endpoint) {
  let { access_token } = await loadUserTokens(userId);
  try {
    return await makeApiCall(endpoint, access_token);
  } catch (error) {
    if (error.response?.status !== 401) throw error;
  }

  try {
    access_token = await refreshKryptosToken(userId);
  } catch (error) {
    if (error.response?.data?.error === "invalid_grant") {
      await markKryptosDisconnected(userId); // ask the user to reconnect
      throw new Error("Access revoked. Please reconnect your account.");
    }
    throw error;
  }
  return makeApiCall(endpoint, access_token);
}
```

---

## Next Steps

- [Web SDK](./web-sdk) and [Mobile SDK](./mobile-sdk) for frontend integration
- [Examples](./examples) for complete end-to-end examples
- [API Overview](/docs/api/overview) — base URL, auth, response shapes and error codes
- [Webhooks](/docs/webhooks/setup) — get notified instead of polling
