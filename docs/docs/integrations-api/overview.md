---
id: overview
title: White-label backend
sidebar_position: 1
---

# White-label backend

:::info Early access
White-label is enabled per developer workspace and needs a **production** client. Request access from
the [Developer Portal](/docs/developer-portal#white-label-workspaces) or at
[support@kryptos.io](mailto:support@kryptos.io).
:::

Run your crypto product on Kryptos. White-label is the whole Kryptos backend behind **your** brand: your
server creates a Kryptos workspace for each of your customers, and Kryptos connects their wallets and
exchanges, keeps them synced, and turns the activity into transactions, holdings, balances and tax
figures that you read through one API. Your customers never see Kryptos and never need a Kryptos account:
the workspaces belong to your app.

## Everything in one backend

| Layer | What Kryptos does for each workspace | Read more |
| --- | --- | --- |
| **Connections** | 5,000+ sources: wallet addresses on 100+ chains, exchange API keys, CSV uploads. First sync on connect, then kept up to date. | [Integrations](/docs/api/integrations) |
| **Transactions** | One normalised model for every source: incoming and outgoing assets, fees, a label (trade, deposit, staking reward…), priced per leg in the workspace's currency. Read and write. | [Transactions](/docs/api/transactions), [Ledgers](/docs/api/ledgers) |
| **Holdings** | Balances, DeFi positions, NFTs and liabilities as each exchange or chain reports them. | [Holdings](/docs/api/holdings) |
| **Balances** | Calculated balances per wallet and asset, portfolio value over time, reconciliation (missing prices, missing purchases, balance gaps). Switched on per workspace. | [Balances and accounting](/docs/integrations-api/white-label) |
| **Accounting and tax** | Cost basis and lots, realised and unrealised gains, disposals per tax year, tax reports. Switched on per workspace. | [Balances and accounting](/docs/integrations-api/white-label) |

You choose per workspace. Switch Balances and Accounting on for customers who need them; leave them off
for customers who need only the data, to run your own calculations: that's the
**[Integrations only](/docs/integrations-api/integrations-only)** setup. Same workspaces, same token,
same API.

## How it works

1. **Create a workspace** for your customer: `POST /developer/workspaces` with your client ID and secret,
   and the `features` you want switched on. You get back a `workspace_id` and a 24-hour `access_token`.
2. **Connect a wallet or exchange:** `POST /v1/integrations` with the workspace token. The first sync
   starts on its own.
3. **Wait for the sync:** poll `GET /v1/integrations/{id}` until `lastSyncStatus` is `completed`, or listen
   for the `integration.updated` webhook.
4. **Read what you need:** transactions, holdings, balances, gains and reports, all with the same token.

The [quickstart](/docs/integrations-api/quickstart) walks through these steps with real requests.

## The workspace token

Creating a workspace returns an **access token for that workspace only**. Use it as a bearer token on
`https://api-v2.kryptos.io/v1`, exactly like any other Kryptos access token.

- **Short-lived, renewable.** The token lasts 24 hours. Get a fresh one any time with
  `POST /developer/workspaces/{workspace_id}/token` and your client ID and secret: your client secret is
  the long-lived credential, so a leaked workspace token is useless within a day, and losing one never
  loses the workspace.
- **Fixed access.** Its scopes are set by Kryptos, whatever scopes your client has. The
  [API Reference](/docs/api-reference/kryptos-api) lists every endpoint it can call; anything else returns
  `403 MACHINE_ROUTE_NOT_ALLOWED`. Members, invites, workspace settings and billing are never available
  to it.
- **Revocable.** Suspect a leak? Get a fresh token with `revoke_existing: true` and every other token of
  that workspace stops at once. `POST /token/revoke` ends the workspace's access for good. If Kryptos
  switches your client off, every token it holds stops working on its next request.

## Limits

Kryptos sets these when it enables your developer workspace; the
[Developer Portal](/docs/developer-portal#white-label-workspaces) shows them.

| Limit | Default |
| --- | --- |
| Live workspaces per client | 100 |
| Transactions per workspace | 100,000 (you can lower it per workspace, not raise it) |
| Workspace creates per client | 30 per minute |
| Token issues per client | 120 per minute |
| Feature changes per client | 30 per minute |

## White-label, Connect or OAuth?

- **White-label:** your customers, your workspaces, your brand. No Kryptos account.
- **[Kryptos Connect](/docs/kryptos-connect/overview):** your users share *their* Kryptos data with you
  through a widget, with consent. Read only.
- **[OAuth](/docs/authentication/oauth):** your app acts for a Kryptos user inside their own account.

See [Pick your use case](/docs/intro#pick-your-use-case) for the full comparison.
