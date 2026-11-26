---
id: access-matrix
title: Access by credential
sidebar_position: 2
---

# Access by credential

Each kind of credential can reach a different part of the API. Within what it can reach, a token still
needs the endpoint's scope (listed on each endpoint page as **Required Permission**), and an OAuth token
is also limited by the user's role.

| | [Workspace token](/docs/integrations-api/overview) (White-label) | [Connect](/docs/kryptos-connect/overview) | [OAuth](/docs/authentication/oauth) | [API key](/docs/authentication/api-key) |
| --- | --- | --- | --- | --- |
| [Integrations](/docs/api/integrations), syncs | Read, write | Read | Read, write | Read |
| CSV uploads, credentials | Read, write | Read | Read, write | — |
| [Portfolios](/docs/api/portfolios) | Read | Read | Read, write | Read |
| [Transactions](/docs/api/transactions), [ledgers](/docs/api/ledgers) | Read, write | Read | Read, write | Read, write |
| [Labels](/docs/api/labels), [asset search](/docs/api/assets) | Read | Read | Read | — |
| [Holdings](/docs/api/holdings), liabilities, [DeFi](/docs/api/defi), [NFTs](/docs/api/nfts) (as reported by the exchange or chain) | Read | Read | Read | Read |
| Calculated balances, dashboard, graphs, reconciliation (computed from transaction and price history) | Read, with [Balances](/docs/integrations-api/white-label) switched on | Read | Read | Read |
| [Spam](/docs/api/spam), [counterparties](/docs/api/counterparties) | — | Read | Read, write | Read, write |
| [Contacts](/docs/api/contacts) | — | Read | Read, write | — |
| Accounting, reports | Read and generate reports, with [Accounting](/docs/integrations-api/white-label) switched on | Read | Read, write (incl. generating reports) | Read, write (not generating reports) |
| Chart of accounts, recalculation | — | — | Read, write | Read, write |
| The workspace and its tax settings | — | Read | Read; write tax settings | Read, write |
| List the user's workspaces | — | — | Read | — |
| Staking, swaps, quotes | — | — | — | Read, write |
| Background tasks | Read, cancel | Read | Read, cancel | Read, write |
| Invites, members, roles, organizations | — | — | — | — |
| Create, delete or reset workspaces | — | — | — | — |
| Notifications, billing | — | — | — | — |

`—` means the credential is refused with `403` (`MACHINE_ROUTE_NOT_ALLOWED` for tokens,
`This endpoint does not accept API keys` for keys). The exact endpoint list for workspace tokens is the
[API Reference](/docs/api-reference/kryptos-api).

:::note Rolling out
Workspace tokens, API keys and billing are enforced today. For OAuth and Connect tokens, the limits in
this table are being rolled out service by service. Build against them now: an endpoint marked `—` will
refuse those tokens.
:::

## Why the differences

- **Workspace tokens** belong to workspaces your app created. They get the data endpoints the
  White-label backend needs and nothing else, so a leaked token can't reach accounts or billing.
- **Connect tokens** are read-only: a user shared their data with you, they didn't hand you their account.
- **OAuth tokens** act as the user, within the scopes they approved and their role, but account
  management (who has access, billing) always needs the user in the Kryptos app.
- **API keys** automate your own paid workspace, so they reach most of it, but never who has access to it.
