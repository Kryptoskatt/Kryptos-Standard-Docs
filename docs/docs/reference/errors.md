---
id: errors
title: Error Codes
sidebar_position: 1
---

# Error Codes

Errors come in three shapes depending on where they originate. Handle all three — the API is served by
several services, and which shape you get depends on the endpoint, not the status code.

## HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created |
| `202` | Accepted | Accepted for asynchronous processing |
| `204` | No Content | Success with an empty body |
| `400` | Bad Request | Invalid parameters, or a required workspace id is missing |
| `401` | Unauthorized | Invalid or missing authentication |
| `403` | Forbidden | Insufficient scope, or no access to that workspace |
| `404` | Not Found | Resource doesn't exist in this workspace |
| `409` | Conflict | Duplicate resource, or a locked accounting period |
| `413` | Payload Too Large | File upload over the size limit |
| `422` | Unprocessable Entity | Valid request that cannot be applied — e.g. a price that won't convert |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |
| `502` | Bad Gateway | An upstream exchange, chain or price provider failed |

## Shape 1: authentication and authorization

OAuth 2.0 format, with **no `success` field**. Emitted before your request reaches the endpoint.

```json
{
  "error": "insufficient_scope",
  "error_description": "Missing: portfolios:read"
}
```

| Status | `error` | Cause |
| --- | --- | --- |
| 401 | `unauthorized` | No credentials, or an invalid/expired token |
| 401 | `invalid_client` (`Client is inactive`) | Kryptos switched off the OAuth client this token was issued to |
| 403 | `insufficient_scope` | Valid credential, but it lacks the endpoint's scope |
| 403 | `forbidden` | The request names a workspace other than the one your token or key is bound to |
| 403 | `forbidden` with `"code": "MACHINE_ROUTE_NOT_ALLOWED"` | This endpoint is not available to this kind of token (OAuth, Connect or Integrations API workspace token) |
| 400 | `bad_request` | Workspace id required but not supplied |
| 500 | `server_error` | Failure while authenticating |

**Solutions**

- `unauthorized` — send `Authorization: Bearer …` or `x-api-key`, not both. Check the token hasn't
  expired: OAuth access tokens, Connect tokens from a refresh, and Integrations API workspace tokens last 24
  hours.
  Refresh it (or, for a Integrations API workspace, [get a fresh one](/docs/integrations-api/quickstart#get-a-fresh-token)).
- `invalid_client` — every token of the client stops when Kryptos switches it off. Contact
  [support@kryptos.io](mailto:support@kryptos.io).
- `insufficient_scope` — `error_description` names the missing scope. Request it at authorization time,
  or add it to your API key. Note `contacts:*`, `invoices:*` and `swaps:*` are not in the default client
  scope set.
- `forbidden` — the request names a workspace other than the one your token or key is bound to. Naming
  the same workspace is fine. See [Workspaces](/docs/api/overview#workspaces).
- `bad_request` — a signed-in app session (or a legacy unbound API key) must pass `?wid=`. Tokens and
  bound keys don't need it.
- `MACHINE_ROUTE_NOT_ALLOWED` — not a scope problem, so adding scopes won't help. Integrations API workspace
  tokens reach only the endpoints in the [API Reference](/docs/api-reference/kryptos-api). For OAuth and
  Connect tokens, account management (invites, members, workspaces) and billing are being closed off: see
  [OAuth](/docs/authentication/oauth#what-an-oauth-token-cant-do) and
  [Connect](/docs/kryptos-connect/backend#step-4-make-api-calls).
- Errors from creating and managing Integrations API workspaces are listed in the
  [Integrations API quickstart](/docs/integrations-api/quickstart#errors-when-creating-a-workspace).

### The OAuth token endpoint

`POST https://oauth.kryptos.io/oidc/token` (code exchange and refresh, for OAuth and Connect) answers in
the same shape:

| Status | `error` | Cause |
| --- | --- | --- |
| 400 | `invalid_grant` | The code or refresh token is unknown, expired, already used, or its grant was revoked. A reused code or a replaced refresh token also revokes the grant. |
| 401 | `invalid_client` | Wrong client ID or secret, or the client is switched off |

After `invalid_grant` on a refresh, the user has to connect or sign in again.

## Shape 2: wrapped application errors

Used by integrations, providers, portfolios, credentials, syncs, CSV, user profile, assets, labels, spam
and DeFi metadata.

```json
{
  "success": false,
  "error": "Integration not found",
  "code": "NOT_FOUND",
  "details": {}
}
```

| Code | Status | Cause |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400 | Failed schema validation; `details.issues` lists each field |
| `NOT_FOUND` | 404 | No such resource in this workspace |
| `CONFLICT` | 409 | Would duplicate something unique — e.g. an integration alias |
| `CREDENTIAL_VALIDATION_FAILED` | 400 | The exchange or wallet rejected the credentials |
| `SYNC_ERROR` | 400 | Sync could not be started |
| `FILE_REQUIRED` | 400 | No file attached to a CSV upload |
| `INVALID_FILE_TYPE` | 400 | Not `.csv`, `.xls` or `.xlsx` |
| `TOO_MANY_FILES` | 400 | Over the per-request file limit |
| `FILE_TOO_LARGE` | 413 | Over the per-file size limit |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `EXTERNAL_SERVICE_ERROR` | 502 | An upstream provider failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

Validation errors carry the offending fields:

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "issues": [
      {
        "code": "invalid_type",
        "expected": "number",
        "received": "string",
        "path": ["limit"],
        "message": "Expected number, received string"
      }
    ]
  }
}
```

**Solutions**

- `EXTERNAL_SERVICE_ERROR` and `RATE_LIMIT_EXCEEDED` are transient — retry with exponential backoff.
- `CONFLICT` on integration creation usually means the alias is taken: use another alias, or leave
  it out.
- `CREDENTIAL_VALIDATION_FAILED` is the exchange's verdict, not ours. Validate up front with
  `POST /v1/integrations/test-credentials` rather than discovering it on the first sync.

## Shape 3: nested errors (transactions and ledgers)

Transactions and ledgers nest the error and omit `success`.

```json
{
  "error": { "code": "PERIOD_LOCKED", "message": "Accounting period is locked" }
}
```

| Code | Status | Cause |
| --- | --- | --- |
| `BAD_REQUEST` | 400 | Ineligible merge or split |
| `NOT_FOUND` | 404 | No such transaction or ledger in this workspace |
| `PERIOD_LOCKED` | 409 | Falls in a filed, locked accounting period |
| `CURRENCY_CONVERSION_FAILED` | 422 | A supplied price could not be converted |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

**Both `409` and `422` reject the write whole** — nothing is partially applied, so both are safe to
retry once you've fixed the cause. For `PERIOD_LOCKED`, the period must be unlocked before the edit can
land. For `CURRENCY_CONVERSION_FAILED`, check `price.baseCurrency` is a currency Kryptos can convert on
that date.

## Partial success is not an error

Several endpoints report per-item outcomes with a `2xx` status. Treating them as wholly successful is a
common source of silent data loss:

| Endpoint | Check |
| --- | --- |
| `POST /v1/transactions/batch` | `data.errorCount` |
| `POST /v1/integrations/batch-delete` | `data.failed[]` |
| `POST /v1/integrations/resync-all` | `data.failed[]` |
| `POST /v1/csv/upload` | `data.failures[]` |
| A sync reaching `partially_synced` | `recordsFailed` and `message` |

## Retry guidance

| Situation | Retry? |
| --- | --- |
| `429`, `502`, `500` | Yes, with exponential backoff |
| `422 CURRENCY_CONVERSION_FAILED` | Yes, after correcting the price |
| `409 PERIOD_LOCKED` | Yes, after unlocking the period |
| `401` | Only after refreshing the token — a bare retry will fail identically |
| `400`, `403`, `404` | No — fix the request |
