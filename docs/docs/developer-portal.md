---
id: developer-portal
title: Developer Portal Setup
sidebar_position: 2
---

# Developer Portal Setup

Follow these steps to set up your developer account and create OAuth clients for the Kryptos Connect API.

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
- **Scopes** - The permissions your application needs (e.g., `portfolios:read`, `transactions:read`)

![Create OAuth Client](/img/developer-portal/client-creation.png)

## Step 5: Save Your Credentials

After creating the client, you'll receive your **Client ID** and **Client Secret**. 

:::warning Important
Save your Client Secret securely - it will only be shown once! Store it in a secure location like a password manager or environment variables.
:::

![Save Client Credentials](/img/developer-portal/secret-saving.png)

## Next Steps

Now that you have your OAuth credentials, you're ready to implement the authentication flow:

- **[OAuth 2.0 Authentication →](/authentication/oauth)** - Learn how to implement the authorization code flow with PKCE
- **[API Key Authentication →](/authentication/api-key)** - Alternative authentication for enterprise customers

## Need Help?

If you encounter any issues during setup, contact our support team:

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Documentation:** [https://docs.kryptos.io](https://docs.kryptos.io)
