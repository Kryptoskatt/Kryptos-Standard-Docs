---
id: mcp-overview
title: MCP Server
sidebar_position: 1
---

# Kryptos MCP Server

Model Context Protocol (MCP) server for Kryptos Connect API. Enables AI assistants like Claude Desktop, Claude Code, Cursor, and other MCP-compatible clients to access portfolio data, search assets, query transactions, and perform data quality reconciliation.

## Overview

The Kryptos MCP Server exposes 18 MCP tools that allow AI-powered workflows to:

- **Query Portfolio Holdings** – Track crypto assets across multiple wallets and chains
- **Search Transactions** – Complete transaction records with advanced filtering
- **Analyze DeFi Positions** – Lending, staking, farming, and derivatives positions
- **Browse NFT Collections** – Collection tracking with metadata and sales history
- **Profile Users** – Portfolio analytics and user classification
- **Reconcile Data** – Detect missing transactions, prices, cost basis, and uncategorized entries
- **Update Labels** – Recategorize transactions individually or in bulk
- **Create Manual Transactions** – Add missing trades, purchases, or transfers

## Authentication Methods

The Kryptos MCP Server supports two authentication methods:

| Method | Transport | Best For |
|--------|-----------|----------|
| **OIDC (OAuth 2.0)** | HTTP | Cursor, Claude Code, modern MCP clients |
| **API Key** | SSE | Claude Desktop, legacy MCP clients |

---

## OIDC Authentication (Recommended)

The HTTP transport with OIDC authentication is the simplest way to connect. Your AI client connects to the server, which handles authentication via your Kryptos account — no API key needed in the config.

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

### How It Works

1. Your AI client connects to the MCP server via HTTP
2. The server redirects you to authenticate with your Kryptos account (OAuth 2.0)
3. Once authenticated, the server issues an access token for the session
4. All subsequent tool calls use the session token automatically

---

## API Key Authentication (SSE)

For Claude Desktop or other clients that don't support the HTTP transport natively, use SSE with an API key.

### Claude Desktop

Add to your Claude config file:

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

Replace `YOUR_API_KEY` with your Kryptos Connect API key from the [Developer Portal](https://dashboard.kryptos.io/).

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

:::tip Prefer HTTP transport for Claude Code
If you're using the Claude Code CLI, use the OIDC method above (`claude mcp add --transport http`) — it's simpler and doesn't require an API key.
:::

### Configuration File Locations

| Platform | Path |
|----------|------|
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

### Getting an API Key

1. Sign up at the [Kryptos Developer Portal](https://dashboard.kryptos.io/)
2. Create a workspace
3. Generate an API key from the workspace settings
4. Use the API key in your MCP configuration

**Required Scopes** (ensure your API key includes these):

```
portfolios:read transactions:read transactions:write integrations:read profile
```

---

## After Setup

### Restart Your AI Assistant

After updating the configuration, restart your AI assistant to load the MCP server tools.

### Verify Connection

Once connected, your AI assistant will have access to all Kryptos MCP tools. You can verify by asking:

> "List my available tools"

The Kryptos tools (prefixed with `get_`, `update_`, `create_`) should appear in the list.

---

## Architecture

- **Transports**: HTTP (OIDC) and SSE (API Key) over TLS
- **Protocol**: MCP (Model Context Protocol)
- **Authentication**: OAuth 2.0 (OIDC) or API key (query parameter)
- **Session Management**: Token-based sessions

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/sse?apiKey=KEY` | Establish SSE connection (API key auth) |
| `POST` | `/sse` | Send messages to server (MCP client protocol) |
| `POST` | `/mcp` | HTTP transport endpoint (OIDC auth) |

---

## Response Format

All MCP tools return responses in a consistent JSON format:

**Success:**

```json
{
  "success": true,
  "data": {
    ...
  }
}
```

**Error:**

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error description"
}
```

---

## Available Tools

The MCP server provides 18 tools:

| Category | Tools | Description |
|----------|-------|-------------|
| **Portfolio & Data** | 12 tools | Holdings, transactions, DeFi, NFTs, profiling, integrations |
| **Reconciliation** | 6 tools | Missing balances, prices, purchases, uncategorized, high P&L, integrations |

See **[Tools Reference](/mcp/mcp-tools)** for portfolio and data tools.
See **[Reconciliation Tools](/mcp/mcp-reconciliation)** for data quality validation tools.

---

## Troubleshooting

**Connection fails:**
- Verify the server is reachable: `curl https://mcp.kryptos.io/health`
- Ensure no firewall blocks outbound connections to `mcp.kryptos.io`
- For API key auth: verify your API key is valid and not expired

**Tools not appearing:**
- Restart your AI assistant after configuration changes
- Check application logs for MCP errors
- Verify your config file syntax is valid JSON

**Authentication errors (API key):**
- Ensure the `apiKey` query parameter is correctly included
- Check that your API key hasn't expired or been revoked
- Verify the key has the required scopes (see above)

**Authentication errors (OIDC):**
- Ensure you have a valid Kryptos account
- Check that you've completed the OAuth authorization flow
- Try removing and re-adding the MCP server to trigger a fresh auth flow

---

## Support

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
- **Developer Portal:** [dashboard.kryptos.io](https://dashboard.kryptos.io/)

