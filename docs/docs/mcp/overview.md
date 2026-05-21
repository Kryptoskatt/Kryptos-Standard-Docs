---
id: mcp-overview
title: MCP Server
sidebar_position: 1
---

# Kryptos MCP Server

Model Context Protocol (MCP) server for Kryptos Connect API. Enables AI assistants like Claude Desktop and Claude Code to access portfolio data, search assets, query transactions, and perform data quality reconciliation.

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

## Quick Start

### 1. Configure Your AI Assistant

Add the MCP server to your AI assistant's configuration:

**Claude Desktop:**

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

**Claude Code (VS Code / CLI):**

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

### 2. Restart Your AI Assistant

After updating the configuration, restart your AI assistant to load the MCP server tools.

### 3. Verify Connection

Once connected, your AI assistant will have access to all Kryptos MCP tools. You can verify by asking:

> "List my available tools"

The Kryptos tools (prefixed with `get_`, `update_`, `create_`) should appear in the list.

## Configuration File Locations

| Platform | Path |
|----------|------|
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

## Architecture

- **Transport**: SSE (Server-Sent Events) over HTTP
- **Protocol**: MCP (Model Context Protocol)
- **Authentication**: API key via query parameter
- **Session Management**: API key-based sessions

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/sse?apiKey=KEY` | Establish SSE connection |
| `POST` | `/sse` | Send messages to server (used by MCP client) |

## Getting an API Key

1. Sign up at the [Kryptos Developer Portal](https://dashboard.kryptos.io/)
2. Create a workspace
3. Generate an API key from the workspace settings
4. Use the API key in your MCP configuration

**Required Scopes** (ensure your API key includes these):

```
portfolios:read transactions:read transactions:write integrations:read profile
```

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

## Available Tools

The MCP server provides 18 tools across 3 categories:

| Category | Tools | Description |
|----------|-------|-------------|
| **Portfolio & Data** | 12 tools | Holdings, transactions, DeFi, NFTs, profiling, integrations |
| **Reconciliation** | 6 tools | Missing balances, prices, purchases, uncategorized, high P&L, integrations |

See **[Tools Reference](/mcp/mcp-tools)** for portfolio and data tools.
See **[Reconciliation Tools](/mcp/mcp-reconciliation)** for data quality validation tools.

## Troubleshooting

**Connection fails:**
- Verify your API key is valid
- Check the server is reachable: `curl https://mcp.kryptos.io/health`
- Ensure no firewall blocks outbound connections to `mcp.kryptos.io`

**Tools not appearing:**
- Restart your AI assistant after configuration changes
- Check application logs for MCP errors
- Verify your config file syntax is valid JSON

**Authentication errors:**
- Ensure the `apiKey` query parameter is correctly included
- Check that your API key hasn't expired or been revoked
- Verify the key has the required scopes (see above)

## Support

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
- **Developer Portal:** [dashboard.kryptos.io](https://dashboard.kryptos.io/)
- **GitHub:** [github.com/Kryptoskatt](https://github.com/Kryptoskatt)
