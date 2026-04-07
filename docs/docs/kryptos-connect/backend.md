---
id: backend
title: Backend Implementation
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Backend Implementation

This guide covers the server-side implementation required for Kryptos Connect. Your backend is responsible for securely creating link tokens, exchanging public tokens for long-lived access tokens, managing user sessions, and making authenticated API calls on behalf of your users.

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
       │                       │ access_token (15 yr)  │
       │◄──────────────────────┤ grant_id              │
       │   Success             │                       │
```

## Step 1: Create Link Token

Create a link token endpoint on your backend that the Web SDK's `generateLinkToken` function will call. The implementation depends on whether the user is new or returning:

**Endpoint:** `POST https://connect-api.kryptos.io/link-token`

**Authentication:** Client credentials via `X-Client-Id` and `X-Client-Secret` headers

### Choosing the Right Approach

| Scenario                                | Include `access_token`? | `isAuthorized` | User Flow (UI)                            | Returns `public_token` |
| --------------------------------------- | ----------------------- | -------------- | ----------------------------------------- | ---------------------- |
| First-time user connecting to Kryptos   | No                   | `false`        | CONNECT → INTEGRATION (account created)   | Yes                 |
| User doesn't have an access token yet   | No                   | `false`        | CONNECT → INTEGRATION (account created)   | Yes                 |
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

    // Return format expected by Web SDK's generateLinkToken
    res.json({
      link_token: response.data.data.link_token,
      isAuthorized: !!existingAccessToken, // true = skip auth, false = full flow
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

        # Return format expected by Web SDK's generateLinkToken
        return jsonify({
            "link_token": data["link_token"],
            "isAuthorized": bool(existing_access_token),
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

// Return format expected by Web SDK's generateLinkToken
echo json_encode([
    'link_token' => $result['data']['link_token'],
    'isAuthorized' => !empty($existingAccessToken),
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

Create an endpoint to exchange the public token for a long-lived access token. The Web SDK's `onSuccess` callback will send the `public_token` to this endpoint.

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

    const { access_token, grant_id, workspace_id } = response.data.data;

    // Store tokens securely for the user
    await saveUserTokens(req.user.id, {
      access_token,
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
    "grant_id": "cgrant_abc123xyz789",
    "token_type": "Bearer",
    "expires_in": 473040000,
    "scope": "openid profile offline_access email portfolios:read transactions:read integrations:read tax:read accounting:read reports:read workspace:read users:read",
    "workspace_id": "uuid-workspace-123"
  }
}
```

:::info Long-Lived Access Tokens
Access tokens are valid for **15 years** (473,040,000 seconds). No refresh tokens are needed. Store the `grant_id` to allow users to revoke access later.
:::

:::tip Complete Integration Flow
**First Connection (New User):**

1. Frontend → `generateLinkToken()` returns `{ link_token, isAuthorized: false }`
2. SDK Flow: INIT → CONNECT → INTEGRATION → STATUS
3. User authenticates and connects integrations
4. `onSuccess` receives `{ public_token: "..." }`
5. Backend exchanges `public_token` for `access_token`
6. **IMPORTANT:** Store `access_token` in database for future use

**Subsequent Connections (Returning User):**

1. Frontend → `generateLinkToken()` returns `{ link_token, isAuthorized: true }`
2. SDK Flow: INIT → INTEGRATION → STATUS (authentication skipped)
3. User connects more integrations
4. `onSuccess` receives `null` (no new token needed)
5. Integrations are added to user's existing account
:::

## Step 3: Make API Calls

Use the access token to call Kryptos APIs:

```javascript
async function getUserHoldings(accessToken) {
  const response = await axios.get(
    "https://connect.kryptos.io/api/v1/holdings",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Client-Id": process.env.KRYPTOS_CLIENT_ID,
        "X-Client-Secret": process.env.KRYPTOS_CLIENT_SECRET,
      },
    },
  );

  return response.data;
}
```

---

## Session Management

### Resume Existing Session

Pass an existing access token when creating a link token to skip the authentication flow for returning users:

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
    "grant_id": "cgrant_abc123"
  }
}
```

**Response (No Valid Session):**

```json
{
  "success": true,
  "data": {
    "has_valid_session": false,
    "reason": "token_expired"
  }
}
```

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

---

## Error Handling

### Common Errors

| Error Code                 | Description                  | Solution                             |
| -------------------------- | ---------------------------- | ------------------------------------ |
| `INVALID_CLIENT`           | Invalid client credentials   | Verify client_id and client_secret   |
| `INVALID_TOKEN`            | Token expired or invalid     | Re-authenticate user                 |
| `TOKEN_EXPIRED`            | Link or public token expired | Create new link token                |
| `TOKEN_ALREADY_USED`       | Token was already consumed   | Create new link token                |
| `INVALID_SCOPE`            | Requested scope not allowed  | Check allowed scopes for your client |
| `INVALID_GRANT`            | Grant revoked or invalid     | Re-authenticate user                 |
| `INSUFFICIENT_PERMISSIONS` | User lacks required role     | User must be owner/admin             |
| `WORKSPACE_NOT_FOUND`      | Workspace doesn't exist      | Verify workspace ID                  |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Handling Revoked Grants

Since access tokens are long-lived, the grant may be revoked before the token expires. Handle this case:

```javascript
async function makeApiCallWithCheck(endpoint, accessToken, grantId) {
  try {
    return await makeApiCall(endpoint, accessToken);
  } catch (error) {
    if (error.response?.status === 401) {
      // Token or grant invalid - user needs to re-authenticate
      throw new Error("Access revoked. Please reconnect your account.");
    }
    throw error;
  }
}
```

---

## Next Steps

- [Web SDK](./web-sdk) and [Mobile SDK](./mobile-sdk) for frontend integration
- [Examples](./examples) for complete end-to-end examples
- [API Endpoints](/docs/api/health) for data API reference
