---
id: integrations-only
title: Integrations only
sidebar_position: 4
---

# Integrations only

A lighter setup of the [White-label backend](/docs/integrations-api/overview): the same workspaces,
tokens and API, with [Balances and accounting](/docs/integrations-api/white-label) switched off. Kryptos
connects and syncs your customers' wallets and exchanges and gives you their transactions; what you do
with them (display, analysis, your own calculations) is up to your product.

Choose it when you only need the data, for example to feed your own ledger or tax engine. It's what
your workspaces get when Kryptos hasn't enabled Balances or Accounting for your client. To add them,
contact [support@kryptos.io](mailto:support@kryptos.io).

## What you get

- **5,000+ sources:** wallet addresses on 100+ blockchains, exchange API keys, and CSV uploads.
- **Normalised transactions:** one model for every source, with incoming and outgoing assets, fees and a
  label (deposit, trade, staking reward…), priced per leg in the workspace's base currency.
- **Read and write:** besides reading, you can add, edit and delete transactions and their ledgers.
- **Managed syncing:** Kryptos runs the first sync and keeps every integration up to date; you poll the
  status or trigger a sync.

## What the workspace token can call

| Area | Access |
| --- | --- |
| Integrations, syncs, CSV uploads, credentials | Read and write |
| Transactions and ledgers | Read and write |
| Holdings, liabilities, DeFi, NFTs (as each exchange or chain reports them) | Read |
| Labels, asset search, background tasks | Read |

The [API Reference](/docs/api-reference/kryptos-api) lists every endpoint a workspace token can call, with
its parameters.

## What it doesn't include

- **Computed balances, cost basis, gains and reports.** These workspaces don't compute them: see
  [Balances and accounting](/docs/integrations-api/white-label). So holdings come only from what each exchange or
  chain reports: their cost-basis and profit fields are empty (`0` or `null`), and a CSV-only account has no holdings.
- **Account features:** members, invites, workspace settings and billing are never available to a
  workspace token.

## Next

- **[Quickstart](/docs/integrations-api/quickstart):** create a workspace, connect a wallet, read its
  transactions.
- **[Transactions](/docs/api/transactions)** and **[Ledgers](/docs/api/ledgers):** the fields you get back.
