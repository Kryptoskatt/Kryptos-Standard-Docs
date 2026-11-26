---
id: developer-portal
title: Developer Portal Setup
sidebar_position: 2
---

# Developer Portal Setup

The [Developer Portal](https://dashboard.kryptos.io/) is where you register your app with Kryptos. You
create a **developer workspace** (your team's space), add **clients** to it (each with a client ID and
secret), and watch the accounts and workspaces your app reaches. Every integration except
[API keys](/docs/authentication/api-key) starts here:

| Integration | What you need from the portal |
| --- | --- |
| [Integrations API](/docs/integrations-api/overview) | A **production** client, with [Integrations API workspaces](#integrations-api-workspaces) enabled |
| [Kryptos Connect](/docs/kryptos-connect/overview) | A client with its allowed origins |
| [OAuth 2.0](/docs/authentication/oauth) | A client with its redirect URIs |

Clients start in **sandbox**. Ask [support@kryptos.io](mailto:support@kryptos.io) to promote a client to
**production** when you're ready to go live.

## Step 1: Sign Up on the Developer Portal

Visit the [Kryptos Developer Portal](https://dashboard.kryptos.io/) and sign up or log in with your account.

![Developer Portal Login](/img/developer-portal/login.png)

## Step 2: Create a Workspace

After logging in, create a new workspace for your application. Workspaces help you organize your OAuth clients and API access.

![Create Workspace](/img/developer-portal/workspace.png)

## Step 3: Access Workspace Details

Navigate inside your workspace to view the dashboard and available options. Here you can manage your clients, view usage statistics, and configure settings.

![Workspace Dashboard](/img/developer-portal/inside-workspace.png)

## Step 4: Create an OAuth Client

Click on **Create Client** to register a new OAuth application. Fill in the required details:

- **Client Name** - A descriptive name for your application
- **Redirect URIs** - The callback URLs where users will be redirected after authorization
- **OAuth & Connect scopes** - The permissions your application can ask users for. Connect sessions
  only ever ask for the read scopes in this list; write scopes apply to OAuth apps.

![Create OAuth Client](/img/developer-portal/client-creation.png)

### Default Client Scopes

When you create a new client, the following scopes are assigned by default:

```
openid profile offline_access email portfolios:read transactions:read 
integrations:read tax:read accounting:read reports:read workspace:read users:read
```

**Default Scopes Explained:**

| Scope                | Description                                    |
| -------------------- | ---------------------------------------------- |
| `openid`             | Required for OpenID Connect authentication     |
| `profile`            | User profile information (name, language, `transaction_limit`) |
| `offline_access`     | Enable refresh tokens for continuous access    |
| `email`              | User email address                             |
| `portfolios:read`    | Read portfolio holdings and balances           |
| `transactions:read`  | Read transaction history                       |
| `integrations:read`  | Read connected wallets and exchanges           |
| `tax:read`           | Read tax calculations and reports              |
| `accounting:read`    | Read accounting ledger entries                 |
| `reports:read`       | Read generated reports and exports             |
| `workspace:read`     | Read workspace settings and configuration      |
| `users:read`         | Read user profile and preferences              |

:::info Future Updates
We will add more granular scope controls in the future, allowing you to request specific permissions for individual features and data types.
:::

## Step 5: Save Your Credentials

After creating the client, you'll receive your **Client ID** and **Client Secret**. 

:::warning Important
Save your Client Secret securely - it will only be shown once! Store it in a secure location like a password manager or environment variables.
:::

![Save Client Credentials](/img/developer-portal/secret-saving.png)

**If your secret leaks**, rotate it from the client's settings (admin role). The old secret stops working
at once, so update your servers right away. Tokens already issued keep working; revoke the affected grants
if they may have leaked too.

**If Kryptos switches your client off** (for example over abuse or an unpaid account), every access token
your client holds stops on its next request, refreshes fail, and no new sessions can start.

## Step 6: Configure Transaction Limits (Optional)

Cap how many transactions each user imports through your app — useful for free tiers, pilots, or trial flows. Configured on the **Connected Accounts** page in your workspace.

Connect distinguishes two grant types:

- **Guest** — accounts created on the fly inside your Connect flow. Limits apply.
- **Linked** — users who signed in with their existing Kryptos account. Limits don't apply because they own their account and manage their own volume across every app they connect to.

**Workspace default** — sets the limit for every *new* Guest user. Capped at 100,000. Click **Edit** on the *Default Transaction Limit* card.

**Per-user override** — raise or lower the cap for a single Guest grant. Expand the user's row and edit the *Transaction Import Limit* section. Overrides are not capped.

**Resolution order:** per-user override → workspace default → platform default (100,000, limiter on). The first defined value wins. Disabling the limiter at any level removes the cap for that scope.

:::tip Programmatic Access
You can also manage transaction limits via the API using your client credentials. See [Update Transaction Limit](/docs/kryptos-connect/backend#update-transaction-limit) in the backend guide.
:::

## Integrations API workspaces

The [Integrations API](/docs/integrations-api/overview) lets your production clients create workspaces
for your own customers. Kryptos enables it per developer workspace. The **Integrations API** card
on the **Connected Accounts** page shows where you stand:

- **Not enabled:** the card explains the product and has a **Request access** button, which emails
  support with your workspace details.
- **Enabled:** the card shows your limits (workspaces per client, transactions per workspace) and the
  endpoints a workspace token can call.

Workspaces your app creates appear in the accounts list with a **API workspace** badge. From there you
can lower its transaction limit, or revoke it. The limit can't go above the one Kryptos set,
and the limiter can't be switched off.

## Next Steps

Pick the guide for what you're building:

- **[Integrations API quickstart →](/docs/integrations-api/quickstart)** - Create a workspace, add a wallet, read its transactions
- **[Kryptos Connect →](/docs/kryptos-connect/overview)** - Embed the widget and exchange its token
- **[OAuth 2.0 →](/docs/authentication/oauth)** - Implement the authorization code flow with PKCE
- **[API keys →](/docs/authentication/api-key)** - Automate your own workspace (paid plans)

## Need Help?

If you encounter any issues during setup, contact our support team:

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Documentation:** [https://docs.kryptos.io](https://docs.kryptos.io)
