---
id: white-label
title: Balances and accounting
sidebar_position: 3
---

# Balances and accounting

The computing half of the [White-label backend](/docs/integrations-api/overview): Kryptos's accounting
engine runs on the workspaces you switch it on for, and you read the results with the same workspace
token.

## What you get

| Feature | What your workspace token reads |
| --- | --- |
| **Balances** | Calculated balances per wallet and asset, portfolio totals and value over time, and reconciliation (missing prices, missing purchases, balance gaps). |
| **Accounting** | Cost basis and lots, realised and unrealised gains (also on every transaction and ledger leg), disposals per tax year, tax-loss harvesting, and tax reports. Needs Balances. |

The endpoints are in the **Portfolio & balances** and **Accounting & tax** groups of the
[API Reference](/docs/api-reference/kryptos-api), for example `GET /v1/calculated-balances`,
`GET /v1/accounting/lots` and `POST /v1/reports/generate`. Reports need no Kryptos plan: your agreement
with Kryptos covers them.

## How it works

1. **Kryptos enables the features for your client**: Balances, or Balances and Accounting. The
   [Developer Portal](/docs/developer-portal#white-label-workspaces) shows what you have.
2. **You switch them on per workspace**: with `features` when you
   [create the workspace](/docs/integrations-api/quickstart#1-create-a-workspace), or any time later with
   [`PATCH /developer/workspaces/{workspace_id}/features`](/docs/integrations-api/quickstart#switch-balances-and-accounting).
3. **Kryptos computes.** Switching a feature on runs a calculation over the workspace's whole history
   (you get a task id to poll), then keeps it up to date after every sync.
4. **Read the results** with the same workspace token.

**Switching a feature off** stops computing, and its endpoints return `403 FEATURE_NOT_ENABLED` from the
next request. Cost basis and gains on transactions go back to `null`. Switching it on again recomputes.
If Kryptos stops enabling a feature for your client, every workspace loses it at once.

## Tax settings

Each workspace uses FIFO unless its country requires another method, and the country's fiscal year, set
from the `country_code` you pass when you create it. Read them with `GET /v1/accounting/settings`.

## Not included

- **Chart of accounts and ERP sync** (Xero, QuickBooks).
- **Changing tax settings** with the workspace token.
