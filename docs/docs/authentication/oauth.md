---
id: oauth
title: OAuth 2.0
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# OAuth 2.0 Authentication

Use OAuth 2.0 authorization code flow with PKCE to access user portfolio data with their consent.

## Endpoints

| Endpoint          | URL                                                              |
| ----------------- | ---------------------------------------------------------------- |
| **Authorization** | `https://oauth.kryptos.io/oidc/auth`                             |
| **Token**         | `https://oauth.kryptos.io/oidc/token`                            |
| **UserInfo**      | `https://oauth.kryptos.io/oidc/userinfo`                         |
| **Revocation**    | `https://oauth.kryptos.io/oidc/token/revocation`                 |
| **Introspection** | `https://oauth.kryptos.io/oidc/token/introspection`              |
| **Discovery**     | `https://oauth.kryptos.io/oidc/.well-known/openid_configuration` |
| **JWKS**          | `https://oauth.kryptos.io/oidc/jwks`                             |

## Available Scopes

### Core Scopes

| Scope            | Description                                  |
| ---------------- | -------------------------------------------- |
| `openid`         | Basic OpenID Connect access (required)       |
| `profile`        | User profile (name, picture, updated_at)     |
| `email`          | Email address and verified status            |
| `offline_access` | Allow refresh tokens for offline data access |

### Data Scopes (Granular Read/Write)

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

## Authorization Flow

### Step 1: Register Your Client

Register your application on the [Developer Portal](https://dashboard.kryptos.io/) to receive:

- `client_id`
- `client_secret`
- Default scopes assigned to your client

**Default Client Scopes:**

```
openid profile offline_access email portfolios:read transactions:read
integrations:read tax:read accounting:read reports:read workspace:read users:read
```

:::info
More granular scope controls will be added in the future. For custom scope requirements, contact [support@kryptos.io](mailto:support@kryptos.io)
:::

### Step 2: Generate PKCE Parameters

PKCE (Proof Key for Code Exchange) adds security to the authorization flow, protecting against code interception attacks.

<Tabs>
<TabItem value="js" label="JavaScript" default>

```javascript
// Generate code verifier (random string 43-128 chars)
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

// Generate code challenge (SHA-256 hash of verifier)
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(hash));
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import secrets
import hashlib
import base64

def generate_pkce():
    """Generate PKCE code verifier and challenge"""
    verifier = secrets.token_urlsafe(32)
    challenge = base64.urlsafe_b64encode(
        hashlib.sha256(verifier.encode()).digest()
    ).decode().rstrip('=')
    return verifier, challenge
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function generatePKCE() {
    $verifier = bin2hex(random_bytes(32));
    $challenge = rtrim(strtr(base64_encode(
        hash('sha256', $verifier, true)
    ), '+/', '-_'), '=');
    return ['verifier' => $verifier, 'challenge' => $challenge];
}
```

</TabItem>
</Tabs>

| Parameter               | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `code_verifier`         | Random string (43-128 chars) sent during token exchange |
| `code_challenge`        | Base64url encoded SHA-256 hash of the code verifier     |
| `code_challenge_method` | Always `S256` for SHA-256                               |

### Step 3: Redirect to Authorization

Redirect the user to the authorization endpoint:

```
GET https://oauth.kryptos.io/oidc/auth?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  scope=openid profile email portfolios:read transactions:read integrations:read offline_access&
  state=RANDOM_STATE&
  code_challenge=CODE_CHALLENGE&
  code_challenge_method=S256
```

**Example Scope Combinations:**

- **Read-only:** `openid profile portfolios:read transactions:read`
- **Full access:** `openid profile portfolios:read portfolios:write transactions:read transactions:write`

| Parameter               | Required | Description                           |
| ----------------------- | -------- | ------------------------------------- |
| `response_type`         | Yes      | Always `code`                         |
| `client_id`             | Yes      | Your client ID                        |
| `redirect_uri`          | Yes      | Your callback URL                     |
| `scope`                 | Yes      | Space-separated list of scopes        |
| `state`                 | Yes      | Random string to prevent CSRF attacks |
| `code_challenge`        | Yes      | PKCE code challenge                   |
| `code_challenge_method` | Yes      | Always `S256`                         |

### Step 4: Exchange Code for Token

After the user authorizes, they're redirected to your `redirect_uri` with an authorization code. Exchange it for tokens:

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

**Response:**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "refresh_token": "def50200...",
  "id_token": "eyJhbGciOiJSUzI1NiIs...",
  "scope": "openid profile portfolios:read transactions:read"
}
```

:::info Token Lifetimes

- **Access Token:** 24 hours
- **Refresh Token:** 30 days
- **ID Token:** 24 hours
- **Authorization Code:** 10 minutes
  :::

### Step 5: Call APIs

Use the access token to call APIs:

```bash
curl -X GET https://connect.kryptos.io/api/v1/holdings \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Required Headers

| Header            | Description             |
| ----------------- | ----------------------- |
| `Authorization`   | `Bearer {access_token}` |
| `X-Client-Id`     | Your client ID          |
| `X-Client-Secret` | Your client secret      |

## Code Examples

<Tabs>
<TabItem value="js" label="JavaScript" default>

```javascript
class KryptosClient {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.oauthUrl = "https://oauth.kryptos.io";
    this.apiUrl = "https://connect-api.kryptos.io";
    this.accessToken = null;
  }

  // Generate PKCE parameters
  async generatePKCE() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const verifier = this.base64UrlEncode(array);

    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const challenge = this.base64UrlEncode(new Uint8Array(hash));

    return { verifier, challenge };
  }

  base64UrlEncode(buffer) {
    return btoa(String.fromCharCode(...buffer))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  // Get authorization URL
  // Scopes use granular :read and :write format
  getAuthUrl(
    redirectUri,
    codeChallenge,
    scopes = [
      "openid", // Required - basic OIDC
      "profile", // Read: name, picture
      "email", // Read: email address
      "portfolios:read", // Read: portfolio holdings
      "transactions:read", // Read: transaction history
      "integrations:read", // Read: connected wallets/exchanges
      "offline_access", // Enable refresh tokens
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

  // Exchange authorization code for tokens
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

  // Get user holdings
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

  // Get user info
  async getUserInfo() {
    const response = await fetch(`${this.apiUrl}/api/v1/userinfo`, {
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
const client = new KryptosClient("your_client_id", "your_client_secret");

// 1. Generate PKCE and redirect user
const { verifier, challenge } = await client.generatePKCE();
sessionStorage.setItem("code_verifier", verifier);
window.location.href = client.getAuthUrl(
  "http://localhost:3000/callback",
  challenge
);

// 2. Handle callback
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");
const storedVerifier = sessionStorage.getItem("code_verifier");
await client.exchangeCode(
  code,
  "http://localhost:3000/callback",
  storedVerifier
);

// 3. Get data
const holdings = await client.getHoldings();
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import secrets
import hashlib
import base64
from urllib.parse import urlencode

class KryptosClient:
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.oauth_url = 'https://oauth.kryptos.io'
        self.api_url = 'https://connect-api.kryptos.io'
        self.access_token = None

    def generate_pkce(self):
        """Generate PKCE code verifier and challenge"""
        verifier = secrets.token_urlsafe(32)
        challenge = base64.urlsafe_b64encode(
            hashlib.sha256(verifier.encode()).digest()
        ).decode().rstrip('=')
        return verifier, challenge

    def get_auth_url(self, redirect_uri, code_challenge, scopes=['openid', 'profile', 'portfolios:read', 'transactions:read', 'offline_access']):
        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'redirect_uri': redirect_uri,
            'scope': ' '.join(scopes),
            'state': secrets.token_urlsafe(16),
            'code_challenge': code_challenge,
            'code_challenge_method': 'S256'
        }
        return f"{self.oauth_url}/oidc/auth?{urlencode(params)}"

    def exchange_code(self, code, redirect_uri, code_verifier):
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'code_verifier': code_verifier
        }

        response = requests.post(
            f"{self.oauth_url}/oidc/token",
            data=data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
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

    def get_userinfo(self):
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'X-Client-Id': self.client_id,
            'X-Client-Secret': self.client_secret
        }
        response = requests.get(f"{self.api_url}/api/v1/userinfo", headers=headers)
        return response.json()

# Usage
client = KryptosClient('your_client_id', 'your_client_secret')

# 1. Generate PKCE and get authorization URL
verifier, challenge = client.generate_pkce()
auth_url = client.get_auth_url('http://localhost:8000/callback', challenge)
print(f"Visit: {auth_url}")
# Store verifier securely for later use

# 2. After user authorizes, exchange code
# tokens = client.exchange_code(code, 'http://localhost:8000/callback', verifier)

# 3. Get data
# holdings = client.get_holdings()
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
class KryptosClient {
    private $clientId;
    private $clientSecret;
    private $oauthUrl = 'https://oauth.kryptos.io';
    private $apiUrl = 'https://connect-api.kryptos.io';
    private $accessToken;

    public function __construct($clientId, $clientSecret) {
        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;
    }

    public function generatePKCE() {
        $verifier = bin2hex(random_bytes(32));
        $challenge = rtrim(strtr(base64_encode(
            hash('sha256', $verifier, true)
        ), '+/', '-_'), '=');
        return ['verifier' => $verifier, 'challenge' => $challenge];
    }

    public function getAuthUrl($redirectUri, $codeChallenge, $scopes = ['openid', 'profile', 'portfolios:read', 'transactions:read', 'offline_access']) {
        $params = http_build_query([
            'response_type' => 'code',
            'client_id' => $this->clientId,
            'redirect_uri' => $redirectUri,
            'scope' => implode(' ', $scopes),
            'state' => bin2hex(random_bytes(16)),
            'code_challenge' => $codeChallenge,
            'code_challenge_method' => 'S256'
        ]);
        return $this->oauthUrl . '/oidc/auth?' . $params;
    }

    public function exchangeCode($code, $redirectUri, $codeVerifier) {
        $data = [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $redirectUri,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'code_verifier' => $codeVerifier
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->oauthUrl . '/oidc/token');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded'
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        $tokens = json_decode($response, true);
        $this->accessToken = $tokens['access_token'];
        return $tokens;
    }

    public function getHoldings() {
        return $this->makeApiCall('/api/v1/holdings');
    }

    public function getUserInfo() {
        return $this->makeApiCall('/api/v1/userinfo');
    }

    private function makeApiCall($endpoint) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->apiUrl . $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->accessToken,
            'X-Client-Id: ' . $this->clientId,
            'X-Client-Secret: ' . $this->clientSecret
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
}

// Usage
$client = new KryptosClient('your_client_id', 'your_client_secret');

// 1. Generate PKCE and redirect to authorization
$pkce = $client->generatePKCE();
$_SESSION['code_verifier'] = $pkce['verifier'];
header('Location: ' . $client->getAuthUrl('http://localhost/callback.php', $pkce['challenge']));

// 2. In callback.php
// $tokens = $client->exchangeCode($_GET['code'], 'http://localhost/callback.php', $_SESSION['code_verifier']);

// 3. Get data
// $holdings = $client->getHoldings();
?>
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
    "crypto/rand"
    "crypto/sha256"
    "encoding/base64"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/url"
    "strings"
)

type KryptosClient struct {
    ClientID     string
    ClientSecret string
    OAuthURL     string
    APIURL       string
    AccessToken  string
}

func NewKryptosClient(clientID, clientSecret string) *KryptosClient {
    return &KryptosClient{
        ClientID:     clientID,
        ClientSecret: clientSecret,
        OAuthURL:     "https://oauth.kryptos.io",
        APIURL:       "https://connect-api.kryptos.io",
    }
}

func (c *KryptosClient) GeneratePKCE() (verifier, challenge string) {
    b := make([]byte, 32)
    rand.Read(b)
    verifier = base64.RawURLEncoding.EncodeToString(b)

    h := sha256.Sum256([]byte(verifier))
    challenge = base64.RawURLEncoding.EncodeToString(h[:])
    return
}

func (c *KryptosClient) GetAuthURL(redirectURI, codeChallenge string, scopes []string) string {
    params := url.Values{
        "response_type":         {"code"},
        "client_id":             {c.ClientID},
        "redirect_uri":          {redirectURI},
        "scope":                 {strings.Join(scopes, " ")},
        "state":                 {"random_state"},
        "code_challenge":        {codeChallenge},
        "code_challenge_method": {"S256"},
    }
    return fmt.Sprintf("%s/oidc/auth?%s", c.OAuthURL, params.Encode())
}

func (c *KryptosClient) ExchangeCode(code, redirectURI, codeVerifier string) error {
    data := url.Values{
        "grant_type":    {"authorization_code"},
        "code":          {code},
        "redirect_uri":  {redirectURI},
        "client_id":     {c.ClientID},
        "client_secret": {c.ClientSecret},
        "code_verifier": {codeVerifier},
    }

    resp, err := http.PostForm(c.OAuthURL+"/oidc/token", data)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    var tokens map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&tokens)
    c.AccessToken = tokens["access_token"].(string)
    return nil
}

func (c *KryptosClient) GetHoldings() (map[string]interface{}, error) {
    return c.makeAPICall("/api/v1/holdings")
}

func (c *KryptosClient) makeAPICall(endpoint string) (map[string]interface{}, error) {
    req, _ := http.NewRequest("GET", c.APIURL+endpoint, nil)
    req.Header.Set("Authorization", "Bearer "+c.AccessToken)
    req.Header.Set("X-Client-Id", c.ClientID)
    req.Header.Set("X-Client-Secret", c.ClientSecret)

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    var result map[string]interface{}
    json.Unmarshal(body, &result)
    return result, nil
}

// Usage
func main() {
    client := NewKryptosClient("your_client_id", "your_client_secret")

    // 1. Generate PKCE
    verifier, challenge := client.GeneratePKCE()

    // 2. Get auth URL
    authURL := client.GetAuthURL("http://localhost:8080/callback", challenge,
        []string{"openid", "profile", "portfolios:read", "transactions:read", "offline_access"})
    fmt.Println("Visit:", authURL)

    // 3. After callback, exchange code
    // client.ExchangeCode(code, "http://localhost:8080/callback", verifier)

    // 4. Get holdings
    // holdings, _ := client.GetHoldings()
}
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Step 1: Generate PKCE (use a tool or library)
# code_verifier: random 43-128 character string
# code_challenge: base64url(sha256(code_verifier))

# Step 2: Redirect user to authorization URL
# Open in browser:
# https://oauth.kryptos.io/oidc/auth?\
#   response_type=code&\
#   client_id=YOUR_CLIENT_ID&\
#   redirect_uri=YOUR_REDIRECT_URI&\
#   scope=openid%20profile%20portfolios:read%20transactions:read%20offline_access&\
#   state=RANDOM_STATE&\
#   code_challenge=CODE_CHALLENGE&\
#   code_challenge_method=S256

# Step 3: Exchange code for token
curl -X POST https://oauth.kryptos.io/oidc/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTH_CODE_FROM_CALLBACK" \
  -d "redirect_uri=YOUR_REDIRECT_URI" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code_verifier=YOUR_CODE_VERIFIER"

# Step 4: Call API with access token
curl -X GET https://connect.kryptos.io/api/v1/holdings \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"

# Get user info
curl -X GET https://connect.kryptos.io/api/v1/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

</TabItem>
</Tabs>

## Token Refresh

Access tokens expire after 24 hours. Use refresh tokens to get new ones:

```bash
curl -X POST https://oauth.kryptos.io/oidc/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "refresh_token=YOUR_REFRESH_TOKEN"
```

## Token Revocation

Revoke tokens when user logs out:

```bash
curl -X POST https://oauth.kryptos.io/oidc/token/revocation \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "token=TOKEN_TO_REVOKE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

## UserInfo Endpoint

Get user information using access token:

```bash
curl -X GET https://oauth.kryptos.io/oidc/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

**Response:**

```json
{
  "sub": "firebase_user_uid",
  "name": "John Doe",
  "email": "john@example.com",
  "email_verified": true,
  "picture": "https://example.com/avatar.jpg",
  "updated_at": 1642248600,
  "portfolios_access": true,
  "transactions_access": true,
  "integrations_access": true,
  "tax_access": true,
  "accounting_access": false,
  "reports_access": true,
  "workspace_access": false,
  "users_access": false
}
```

## Error Handling

### OIDC Error Codes

| Error Code               | Description                               |
| ------------------------ | ----------------------------------------- |
| `invalid_request`        | Request is missing required parameter     |
| `invalid_client`         | Client authentication failed              |
| `invalid_grant`          | Authorization grant is invalid or expired |
| `unauthorized_client`    | Client not authorized for this grant type |
| `unsupported_grant_type` | Grant type not supported                  |
| `invalid_scope`          | Requested scope is invalid                |
| `access_denied`          | User denied authorization                 |
| `invalid_token`          | Token is invalid or expired               |

### Error Handling Example

```javascript
async function makeApiCall(endpoint, accessToken, refreshToken) {
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 401) {
    // Token expired - try refresh
    const newTokens = await refreshAccessToken(refreshToken);
    return makeApiCall(
      endpoint,
      newTokens.access_token,
      newTokens.refresh_token
    );
  }

  if (response.status === 403) {
    // Insufficient scope
    throw new Error("Insufficient permissions for this resource");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${error.error} - ${error.error_description}`);
  }

  return response.json();
}
```

## Security Best Practices

1. **Always use PKCE** - Protects against authorization code interception
2. **Store secrets securely** - Never expose client secrets in frontend code
3. **Use HTTPS** - Always use secure connections
4. **Validate state parameter** - Prevent CSRF attacks
5. **Handle token expiration** - Implement refresh token logic
6. **Request minimal scopes** - Only request necessary permissions

## Token Response

| Field           | Description                               |
| --------------- | ----------------------------------------- |
| `access_token`  | JWT token for API authentication          |
| `id_token`      | OIDC ID token with user claims            |
| `token_type`    | Always `Bearer`                           |
| `expires_in`    | Token validity in seconds (86400 = 24hrs) |
| `refresh_token` | Token for obtaining new access tokens     |
| `scope`         | Granted scopes                            |

## Rate Limits

| Endpoint Type     | Limit         | Window     |
| ----------------- | ------------- | ---------- |
| Token Endpoint    | 100 requests  | per minute |
| UserInfo Endpoint | 1000 requests | per hour   |
| Other OIDC        | 200 requests  | per hour   |

Rate limits are per client ID. Exceeding limits returns HTTP 429 with `retry_after` header.
