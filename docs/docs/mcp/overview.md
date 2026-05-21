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

There are two ways to connect your AI to Kryptos. Pick the one that matches your situation:

| Your situation | Method | Why |
|----------------|--------|-----|
| Cursor or Claude Code (CLI) | Log in with Kryptos *(recommended)* | Simplest setup — no key to manage |
| Claude Desktop | API key | Claude Desktop doesn't yet support direct login |
| On a paid plan and want centralized control | API key *(recommended)* | Works with managed keys, IP restrictions, and audit logs |

---

## Option 1: Log in with Kryptos *(recommended)*

The easiest way to connect. You paste a short config snippet into your AI tool, and the first time it connects, a Kryptos login page opens in your browser. After you log in, your AI is connected — no API key to copy or store.

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

## Option 2: Use an API key

Use this if you're on Claude Desktop, or if you're on a **paid plan** and want centralized control (managed keys, IP allowlists, and audit logs).

> **Note:** API keys are available on paid plans only. If you're not on a paid plan, use the "Log in with Kryptos" option above.

### Claude Desktop

Open your Claude config file (see paths below) and add the snippet:

```json
{
  "mcpServers": {
    "kryptos": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.kryptos.io/sse?apiKey=YOUR_API_KEY"]
    }
  }
}
```

Replace `YOUR_API_KEY` with your Kryptos API key. See **[API Key authentication →](/authentication/api-key)** for how to generate one.

### Claude Code (VS Code extension / older config)

```json
{
  "mcpServers": {
    "kryptos": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.kryptos.io/sse?apiKey=YOUR_API_KEY"]
    }
  }
}
```

:::tip Using Claude Code CLI?
Use the "Log in with Kryptos" method above (`claude mcp add --transport http`) instead — it's simpler and there's no API key to manage.
:::

### Where to find the config file

| Platform | Path |
|----------|------|
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

### Getting an API key

API keys are created in the Kryptos dashboard. Full instructions, including how to set permissions and (optionally) restrict by IP, are in the **[API Key guide →](/authentication/api-key)**.

When you generate the key, make sure these permissions are turned on:

```
portfolios:read transactions:read transactions:write integrations:read profile
```

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

- **[Portfolio & Data tools →](/mcp/mcp-tools)**
- **[Reconciliation tools →](/mcp/mcp-reconciliation)**

---

## Troubleshooting

**It won't connect:**
- Make sure your internet is working and your firewall isn't blocking `mcp.kryptos.io`
- If using an API key, double-check it's valid and hasn't been revoked
- Test the server directly: open `https://mcp.kryptos.io/health` in your browser — you should get a small "ok" response

**Tools don't show up in my AI:**
- Fully quit and reopen your AI app (a window reload isn't always enough)
- Check that your config file is valid JSON — a missing comma or bracket will silently break it
- Look at your AI app's logs for any MCP-related errors

**API key login fails:**
- Make sure you pasted the full key (no extra spaces)
- Check the key hasn't expired or been revoked in the dashboard
- Confirm the key has the permissions listed above

**Kryptos login fails:**
- Make sure you can sign in normally at [dashboard.kryptos.io](https://dashboard.kryptos.io/)
- Try removing the server from your AI config and adding it again to start a fresh login

<details>
<summary><strong>For developers: technical details</strong></summary>

**Transports:** HTTP (with Kryptos login) and SSE (with API key), both over TLS
**Protocol:** Model Context Protocol (MCP)
**Authentication:** OAuth 2.0 / OIDC, or API key via query parameter
**Sessions:** Token-based

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/sse?apiKey=KEY` | SSE connection (API key auth) |
| `POST` | `/sse` | Client messages (MCP protocol) |
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

