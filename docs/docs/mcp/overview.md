---
id: mcp-overview
title: MCP Integration
sidebar_position: 1
---

# MCP Integration

Connect your AI assistant — ChatGPT, Claude, Cursor, or any other MCP-compatible tool — directly to your
Kryptos account. Once connected, you can ask questions about your portfolio, review transactions, and clean up
your data in plain English, without leaving your AI chat.

> **What is MCP?** Model Context Protocol (MCP) is a standard that lets AI assistants securely talk to
> other services. Setting up the Kryptos MCP server is a one-time configuration in your AI app.

## What you can do with it

Once connected, you can ask your AI things like:

- **Check your portfolio** — "What are my top holdings right now?"
- **Search transactions** — "Show me every swap I did in January"
- **Review DeFi positions** — "Where am I staked, and how much am I earning?"
- **Browse NFTs** — "List my Bored Apes with current floor prices"
- **Find data issues** — "Are any of my transactions missing prices or cost basis?"
- **Fix labels** — "Recategorize all my Uniswap swaps as DeFi Swap"
- **Add missing trades** — "Add a manual BTC purchase from January 2024"
- **Connect wallets** — "Connect my Binance account" or "Add my Ethereum address"
- **Do your accounting** — "Categorize my transactions and push the journals to Xero"

The server exposes its tools to your AI automatically, covering portfolio and transaction reads,
reconciliation checks, wallet and portfolio management, and accounting/ERP workflows. You don't need to
learn the tool names — describe what you want and your assistant picks the right ones. To see what is
available in your session, ask it to *"list my available tools"*.

## Installation

The Kryptos MCP Server uses OAuth 2.0 login. In ChatGPT you install a plugin; in other AI tools you paste
a short config snippet. The first time it connects, a Kryptos login page opens in your browser. **There is
no API key to copy or store.**

**Plan:** you can connect any workspace. Without a Kryptos **Pro** membership or a paid **Enterprise**
subscription, only adding a wallet works (`add_wallet`, plus the two lookups it needs:
`get_integration_metadata` and `list_portfolios`); every other tool answers with what a plan unlocks.
Free accounts, the 14-day Enterprise trial and one-off tax-year reports don't count as a plan.

**Server URL:** `https://mcp.kryptos.io`

### ChatGPT

No config needed: open **Plugins** in ChatGPT, search for **Kryptos** and click **Install plugin**. See
[Connect Kryptos to ChatGPT](/docs/mcp/chatgpt) for the seven steps and a video walkthrough.

### Cursor

1. Open Cursor **Settings** → **MCP**
2. Add to `mcp.json`:

```json
{
  "mcpServers": {
    "kryptos": {
      "type": "url",
      "url": "https://mcp.kryptos.io"
    }
  }
}
```

### Claude Code (CLI)

```bash
claude mcp add --transport http kryptos https://mcp.kryptos.io
```

### Other MCP clients

Any client supporting MCP over HTTP works — point it at `https://mcp.kryptos.io` and let it complete the
OAuth flow in your browser.

### What happens on first connect

1. Your AI app contacts the Kryptos MCP server
2. A Kryptos login page opens in your browser
3. You log in, exactly as you would at the dashboard
4. Your AI is connected — no key to copy, no extra step

### After setup

**Restart your AI app** (not needed in ChatGPT). Fully quit and reopen it so it picks up the new tools — a window reload is often
not enough.

Then ask *"list my available tools"*. You should see Kryptos tools in the response.

## Troubleshooting

**It won't connect**

- Check your internet, and that your firewall isn't blocking `mcp.kryptos.io`
- Test the server directly: open `https://mcp.kryptos.io/health` in a browser. You should get JSON with
  `"status": "healthy"` (`"degraded"` means it is up but can't reach Kryptos's login server)

**Tools don't show up**

- Fully quit and reopen your AI app
- Validate your config file as JSON — a missing comma or bracket fails silently
- Check your AI app's logs for MCP errors

**"… unlocks this and every other Kryptos tool"** (code `PLAN_REQUIRED`)

- The workspace you connected isn't on a paid plan, so only adding a wallet works. Upgrade it (the answer
  includes an upgrade link), or remove the server and add it again, choosing a workspace on Pro or a paid
  Enterprise plan.

**Kryptos login fails**

- Confirm you can sign in normally at [dashboard.kryptos.io](https://dashboard.kryptos.io/)
- Remove the server from your config and add it again to start a fresh login

<details>
<summary><strong>For developers: technical details</strong></summary>

**Transport:** HTTP over TLS
**Protocol:** Model Context Protocol (MCP)
**Authentication:** OAuth 2.0 / OIDC
**Sessions:** Token-based

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check: `{ "status": "healthy" \| "degraded", ... }` |
| `POST` | `/` | Streamable HTTP transport (bearer token from the OAuth login) |
| `DELETE` | `/` | Ends an MCP session (`mcp-session-id` header) |
| `GET` | `/` | Not supported (`405`): the server sends no unprompted messages |

Requests and responses are MCP JSON-RPC. A tool's result is text content holding JSON; a tool that needs
a plan returns `{ "success": false, "code": "PLAN_REQUIRED", "message": "…", "upgradeUrl": "…" }`.

The MCP server calls the same API documented under [API Reference](/docs/api/overview) with the
workspace bound to your OAuth grant, so anything it reports is reproducible with a direct API call.

</details>

## Support

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
- **Developer Portal:** [dashboard.kryptos.io](https://dashboard.kryptos.io/)
