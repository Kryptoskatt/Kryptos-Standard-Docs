---
id: mcp-accounting
title: Accounting & ERP Tools
sidebar_position: 4
---

# Accounting & ERP Tools

These tools turn your crypto activity into accounting journals and push them to your ERP — **Xero** or **QuickBooks**. You connect the ERP, pull in its chart of accounts, categorize your activity (with rules or by hand), then review and sync the resulting journals.

As with every MCP tool, you don't call these directly — you ask your AI in plain English and it picks the right tool.

> **Crypto label vs. accounting code.** A transaction *label* (like "Staking Rewards") describes what happened on-chain. An *accounting code* (a Chart-of-Accounts / COA code, like `4000`) is the GL account it posts to. These tools work with the accounting side — the debit/credit **ledgers** behind each transaction and the **journals** generated from them.

---

## The end-to-end flow

A typical first-time setup, in order:

1. **Connect** your ERP — `connect_erp`, then `get_erp_connection_status`
2. **Pull the chart of accounts** from the ERP — `sync_coa_from_erp`, then `list_chart_of_accounts`
3. **Seed rules** — `create_default_rules` (and `create_custom_rule` for anything specific)
4. **Categorize** — `apply_rules`, or tag manually with `assign_ledger_accounts` / `bulk_assign_ledger_accounts`
5. **Review the journals** — `list_journals` (look for unsynced ones and any errors)
6. **Push to the ERP** — `sync_to_erp`

> **Example prompt:** "Connect Xero, pull the chart of accounts, categorize everything with the default rules, then push the journals as drafts."

---

## Connecting your ERP

### connect_erp

Starts connecting Xero or QuickBooks. Returns an authorization URL — you open it in a browser and approve access; the connection finishes automatically when the provider redirects back.

**Required Scope:** `accounting:write`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | Yes | `xero` or `quickbooks` |
| `returnUrl` | string | No | App path to return to after authorization |
| `organisationId` | string | No | Organisation/tenant hint |

**Example prompt:**

> "Connect my Xero account"

---

### get_erp_connection_status

Checks whether your workspace is connected to an ERP, including the tenant/company, base currency, and last sync time.

**Required Scope:** `accounting:read`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | Yes | `xero` or `quickbooks` |

**Example prompt:**

> "Is my QuickBooks still connected?"

---

## Chart of accounts

### sync_coa_from_erp

Pulls (imports) the Chart of Accounts from the connected ERP into Kryptos, so you know the available GL account codes. Run this after connecting.

**Required Scope:** `accounting:write`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | Yes | `xero` or `quickbooks` |

**Example prompt:**

> "Pull my chart of accounts from Xero"

---

### list_chart_of_accounts

Lists the stored GL accounts (code, class, name). These codes are what you assign to ledgers when categorizing.

**Required Scope:** `accounting:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `platform` | string | No | — | Filter by ERP platform |
| `limit` | number | No | 500 | Max accounts to return |
| `offset` | number | No | 0 | Pagination offset |

**Example prompt:**

> "Show me my chart of accounts"

---

### create_erp_accounts

Creates or updates GL accounts in the connected ERP (pushes chart-of-accounts entries to Xero/QuickBooks).

**Required Scope:** `accounting:write`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | Yes | `xero` or `quickbooks` |
| `accounts` | object[] | Yes | Accounts to create/update |

**Account fields:** `class` (ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE), `name`, `code` (number), `description`, optional `isCustom` / `archived`.

**Example prompt:**

> "Create a 'Crypto Gains' revenue account with code 4100 in Xero"

---

## Categorization rules

Rules auto-assign COA codes to matching ledgers, so you don't have to tag everything by hand.

### create_default_rules

Seeds the default rule set (Digital Assets, Cash Equivalents, Capital Gains, Capital Loss, Fees, Small Errors). Idempotent — only missing defaults are added. Run once when setting up accounting.

**Required Scope:** `accounting:write` · **Parameters:** None

**Example prompt:**

> "Set up the default accounting rules"

---

### list_rules

Lists your COA categorization rules. Optionally filter by category.

**Required Scope:** `accounting:read`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | `DEFAULT`, `ASSETS`, or `CUSTOM` |

**Example prompt:**

> "List my accounting rules"

---

### create_custom_rule

Creates a custom rule that assigns a COA code to ledgers matching your criteria (by asset, label, accounts, counterparty, amount, value, ledger direction, and more).

**Required Scope:** `accounting:write`

**Parameters (common):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `COA` | number | Yes | Target COA code this rule assigns |
| `RuleName` | string | Yes | Human-readable name |
| `rank` | number | No | Priority (lower runs first) |
| `isWorking` | boolean | No | Whether the rule is active (default true) |
| `Assets` | — | No | "All Assets" or specific assets to match |
| `Label` | — | No | Transaction label(s) to match |
| `Ledger_type` | string | No | `Incoming`, `Outgoing`, or `All` |
| `accounts` / `counterParty` | — | No | Source / counterparty matchers |
| `assetAmount` / `netValue` | number | No | Quantity / fiat-value thresholds |
| `conditions` | object | No | Per-field operators (e.g. `IN`, `NOT_IN`, `GREATER_THAN`) |

**Example prompt:**

> "Create a rule that posts all Staking Rewards to COA 4200"

---

### update_rule

Updates a rule — toggle `isWorking`, change `rank`, `COA`, `RuleName`, or match conditions.

**Required Scope:** `accounting:write`

**Parameters:** `ruleId` (required) plus any fields to change.

**Example prompt:**

> "Disable the rule with id rule_123"

---

### delete_rule

Deletes a rule by id.

**Required Scope:** `accounting:write`

**Parameters:** `ruleId` (required).

**Example prompt:**

> "Delete the Staking Rewards rule"

---

### apply_rules

Applies all active rules retroactively: re-categorizes ledgers and regenerates journals. Manual edits are preserved. Runs in the background — wait for it to finish before pushing.

**Required Scope:** `accounting:write` · **Parameters:** None

**Example prompt:**

> "Apply my rules to everything"

---

## Tagging ledgers by hand

When a rule doesn't cover something, assign COA codes directly.

### list_ledgers

Lists the debit/credit ledgers behind your transactions. Pass `missingCoa=true` to find ledgers that still need a code assigned.

**Required Scope:** `accounting:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `missingCoa` | boolean | No | — | Only ledgers missing a debit/credit COA code |
| `trxIds` | string[] | No | — | Ledgers for specific transactions |
| `walletId` | string | No | — | Filter by source wallet |
| `limit` | number | No | 200 | Max results |
| `offset` | number | No | 0 | Pagination offset |

**Example prompt:**

> "Show me the ledgers that still need an accounting code"

---

### assign_ledger_accounts

Assigns a debit and/or credit COA code to a single ledger. Journal regeneration is queued automatically.

**Required Scope:** `accounting:write`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ledgerId` | string | Yes | Ledger id from `list_ledgers` |
| `debitCoaCode` | number | Conditional | COA code for the debit side |
| `creditCoaCode` | number | Conditional | COA code for the credit side |

(At least one of `debitCoaCode` / `creditCoaCode` is required.)

**Example prompt:**

> "Tag ledger led_123 with debit 1000 and credit 4000"

---

### bulk_assign_ledger_accounts

Assigns COA codes to the ledgers of many transactions at once (max 100, all the same type). Fee ledgers are skipped.

**Required Scope:** `accounting:write`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `trxIds` | string[] | Yes | Transaction ids to tag (max 100, same type) |
| `debitCoaCode` | number | Conditional | COA code for the debit side |
| `creditCoaCode` | number | Conditional | COA code for the credit side |

**Example prompt:**

> "Tag all my Coinbase deposits with debit 1000 and credit 4000"

---

## Reviewing & syncing journals

### list_journals

Lists the journals generated from your tagged ledgers, with their sync state, any push error, and external (ERP) ids. Use this before syncing to see which journals are unsynced and to pass specific ids to `sync_to_erp`.

**Required Scope:** `accounting:read`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `synced` | boolean | No | — | `false` = not yet pushed (and prior failures); `true` = already pushed |
| `journalIds` | string[] | No | — | Fetch specific journals |
| `trxDocId` | string | No | — | Journals for one transaction |
| `timeStart` | number | No | — | At/after this transaction timestamp (ms) |
| `timeEnd` | number | No | — | At/before this transaction timestamp (ms) |
| `includeLines` | boolean | No | — | Include each journal's debit/credit lines + COA codes |
| `limit` | number | No | 200 | Max results |
| `offset` | number | No | 0 | Pagination offset |

**Example prompt:**

> "Show me the journals that haven't been pushed to Xero yet"

---

### sync_to_erp

Pushes accounting journals to the connected ERP. Omit `journalIds` to push all currently-unsynced journals, or pass specific ids (from `list_journals`).

**Required Scope:** `accounting:write`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `platform` | string | Yes | — | `xero` or `quickbooks` |
| `journalIds` | string[] | No | — | Specific journals to push. Omit to push all unsynced. |
| `pushType` | string | No | DRAFT | Xero journal status: `DRAFT` or `POSTED` |

> **Categorize first.** Journals are generated from tagged ledgers, and tagging/`apply_rules` regenerates them in the background. If you just made changes, let the regeneration finish before pushing — `sync_to_erp` is briefly rejected (with a "journals regenerating" message) while that's running, so just wait and retry.

**Example prompt:**

> "Push all my unsynced journals to Xero as drafts"

---

## Next steps

- **[Portfolio, transactions & wallet tools →](/docs/mcp/mcp-tools)** – Read holdings, transactions, and connect wallets
- **[Reconciliation tools →](/docs/mcp/mcp-reconciliation)** – Find and fix gaps before you do the books
- **[MCP overview →](/docs/mcp/mcp-overview)** – Setup and configuration
