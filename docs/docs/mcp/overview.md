---
id: mcp-overview
title: MCP Server
sidebar_position: 1
---

# Kryptos MCP Server

Connect your AI assistant — Claude, Cursor, or any other MCP-compatible tool — directly to your Kryptos account. Once connected, you can ask questions about your portfolio, review transactions, and clean up your data in plain English, without leaving your AI chat.

> **What is MCP?** Model Context Protocol (MCP) is a standard that lets AI assistants securely talk to other services. Setting up the Kryptos MCP server is a one-time configuration in your AI app.

## What you can do with it

Once connected, you can ask your AI things like:

- **Check your portfolio** – "What are my top holdings right now?"
- **Search transactions** – "Show me every swap I did in January"
- **Review DeFi positions** – "Where am I staked, and how much am I earning?"
- **Browse NFTs** – "List my Bored Apes with current floor prices"
- **Get insights** – "What kind of crypto investor am I, based on my activity?"
- **Find data issues** – "Are any of my transactions missing prices or cost basis?"
- **Fix labels** – "Recategorize all my Uniswap swaps as DeFi Swap"
- **Add missing trades** – "Add a manual BTC purchase from January 2024"

Under the hood, the server provides 18 tools your AI uses on your behalf.

## How to connect

The Kryptos MCP Server uses OAuth 2.0 login — you paste a short config snippet into your AI tool, and the first time it connects, a Kryptos login page opens in your browser. After you log in, your AI is connected — no API key to copy or store.

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

### What happens behind the scenes

1. Your AI app contacts the Kryptos MCP server
2. A Kryptos login page opens in your browser
3. You log in (just like signing in to the dashboard)
4. Your AI is connected — no key to copy, no extra step

---

## After setup

### Restart your AI app

After saving the config, fully quit and reopen your AI app so it picks up the new tools.

### Check that it worked

Ask your AI:

> "List my available tools"

You should see Kryptos tools in the list — anything starting with `get_`, `update_`, or `create_`.

---

## Available tools

The server provides 18 tools, split into two groups:

| Group | Tools | What they do |
|-------|-------|--------------|
| **Portfolio & Data** | 12 | Read your holdings, transactions, DeFi, NFTs, and account info |
| **Reconciliation** | 6 | Find and fix gaps in your portfolio data |

- **[Portfolio & Data tools →](/docs/mcp/mcp-tools)**
- **[Reconciliation tools →](/docs/mcp/mcp-reconciliation)**

---

## Troubleshooting

**It won't connect:**
- Make sure your internet is working and your firewall isn't blocking `mcp.kryptos.io`
- Test the server directly: open `https://mcp.kryptos.io/health` in your browser — you should get a small "ok" response

**Tools don't show up in my AI:**
- Fully quit and reopen your AI app (a window reload isn't always enough)
- Check that your config file is valid JSON — a missing comma or bracket will silently break it
- Look at your AI app's logs for any MCP-related errors

**Kryptos login fails:**
- Make sure you can sign in normally at [dashboard.kryptos.io](https://dashboard.kryptos.io/)
- Try removing the server from your AI config and adding it again to start a fresh login

<details>
<summary><strong>For developers: technical details</strong></summary>

**Transport:** HTTP over TLS
**Protocol:** Model Context Protocol (MCP)
**Authentication:** OAuth 2.0 / OIDC
**Sessions:** Token-based

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/mcp` | HTTP transport (OIDC auth) |

**Response format:**

Success:
```json
{ "success": true, "data": { ... } }
```

Error:
```json
{ "success": false, "error": "ERROR_CODE", "message": "..." }
```

</details>

---

## Support

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
- **Developer Portal:** [dashboard.kryptos.io](https://dashboard.kryptos.io/)
