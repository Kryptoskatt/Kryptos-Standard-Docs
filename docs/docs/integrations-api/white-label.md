---
id: white-label
title: Balances and accounting
sidebar_position: 3
---

# Balances and accounting

The computing half of the [White-label backend](/docs/integrations-api/overview): when Kryptos enables
it for your client, Kryptos's accounting engine runs on your workspaces, and you read the results with the
same workspace token.

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

1. **Kryptos enables the features for your client**: Balances, or Balances and Accounting. Ask
   [support@kryptos.io](mailto:support@kryptos.io); the
   [Developer Portal](/docs/developer-portal#white-label-workspaces) shows what you have.
2. **Every workspace you create gets them.** The create response's `features` shows which.
3. **Kryptos computes** after every sync, and you read the results with the same workspace token.

You don't switch features yourself. If Kryptos stops enabling a feature for your client, its endpoints
return `403 FEATURE_NOT_ENABLED` for every workspace from the next request, and cost basis and gains on
transactions go back to `null`. A feature enabled later applies to workspaces you create after that:
ask Kryptos about existing ones.

## Tax settings

Each workspace uses FIFO unless its country requires another method, and the country's fiscal year, set
from the `country_code` you pass when you create it. Read them with `GET /v1/accounting/settings`.

## Not included

- **Chart of accounts and ERP sync** (Xero, QuickBooks).
- **Changing tax settings** with the workspace token.
