---
id: integrations
title: Integrations (Providers)
sidebar_position: 1
---

# Integrations (Providers)

<span className="badge badge--get">GET</span> `/integrations/public/list`

**Base URL:** `https://connect-api.kryptos.io`

Retrieve the complete list of all supported integrations with full details including features, functions, and metadata. This endpoint provides comprehensive information about all available providers, exchanges, and blockchain integrations. **No authentication required.**

## Request

```bash
curl -X GET "https://connect-api.kryptos.io/integrations/public/list"
```

## Response

```json
{
  "success": true,
  "data": [
    {
      "id": "ethereum",
      "name": "ethereum",
      "publicName": "Ethereum",
      "logo": "https://storage.googleapis.com/kryptos-public/logos/ethereum.png",
      "type": "wallet",
      "isAPI": true,
      "isCSV": false,
      "isOAuth": false,
      "isEVM": true,
      "isWorking": true,
      "communityId": 1,
      "importGuide": "Connect your Ethereum wallet by entering your wallet address",
      "functions": [
        {
          "name": "getBalance",
          "publicName": "Get Balance"
        },
        {
          "name": "getTransactions",
          "publicName": "Get Transactions"
        },
        {
          "name": "getNFTs",
          "publicName": "Get NFTs"
        }
      ],
      "integrationInfo": {},
      "walletLimitations": null
    },
    {
      "id": "binance",
      "name": "binance",
      "publicName": "Binance",
      "logo": "https://storage.googleapis.com/kryptos-public/logos/binance.png",
      "type": "exchange",
      "isAPI": true,
      "isCSV": true,
      "isOAuth": false,
      "isEVM": false,
      "isWorking": true,
      "importGuide": "Connect using your Binance API keys",
      "functions": [
        {
          "name": "getBalance",
          "publicName": "Get Balance"
        },
        {
          "name": "getTransactions",
          "publicName": "Get Transactions"
        }
      ],
      "integrationInfo": {
        "apiKeyRequired": true,
        "apiSecretRequired": true
      },
      "walletLimitations": null
    },
    {
      "id": "solana",
      "name": "solana",
      "publicName": "Solana",
      "logo": "https://storage.googleapis.com/kryptos-public/logos/solana.png",
      "type": "wallet",
      "isAPI": true,
      "isCSV": false,
      "isOAuth": false,
      "isEVM": false,
      "isWorking": true,
      "importGuide": "Connect your Solana wallet by entering your wallet address",
      "functions": [
        {
          "name": "getBalance",
          "publicName": "Get Balance"
        },
        {
          "name": "getTransactions",
          "publicName": "Get Transactions"
        },
        {
          "name": "getNFTs",
          "publicName": "Get NFTs"
        }
      ],
      "integrationInfo": {},
      "walletLimitations": null
    }
  ]
}
```

## Response Fields

### Integration Object

| Field               | Type     | Description                                                      |
| ------------------- | -------- | ---------------------------------------------------------------- |
| `id`                | string   | Unique provider identifier (e.g., `ethereum`, `binance`)         |
| `name`              | string   | Internal provider name                                           |
| `publicName`        | string   | Human-readable provider name for display                         |
| `logo`              | string   | Provider logo URL                                                |
| `type`              | string   | Integration type: `wallet`, `exchange`, `blockchain`, etc.       |
| `isAPI`             | boolean  | Whether API/address-based connection is supported                |
| `isCSV`             | boolean  | Whether CSV import is supported                                  |
| `isOAuth`           | boolean  | Whether OAuth authentication is supported                        |
| `isEVM`             | boolean  | Whether this is an EVM-compatible blockchain                     |
| `isWorking`         | boolean  | Whether the integration is currently operational                 |
| `communityId`       | number   | DeBank community ID (optional, for blockchain integrations)      |
| `importGuide`       | string   | Instructions for connecting this integration                     |
| `functions`         | array    | List of available functions (see Function Object below)          |
| `integrationInfo`   | object   | Additional integration metadata (optional)                       |
| `walletLimitations` | object   | Any limitations or restrictions for this integration (optional)  |

### Function Object

| Field        | Type   | Description                           |
| ------------ | ------ | ------------------------------------- |
| `name`       | string | Internal function name                |
| `publicName` | string | Human-readable function name          |

## Integration Types

| Type         | Description                                       | Examples                        |
| ------------ | ------------------------------------------------- | ------------------------------- |
| `wallet`     | Blockchain wallets and addresses                  | Ethereum, Solana, Bitcoin       |
| `exchange`   | Centralized cryptocurrency exchanges              | Binance, Coinbase, Kraken       |
| `blockchain` | Direct blockchain network connections             | Ethereum RPC, Solana RPC        |
| `services`   | Third-party services and integrations             | DeFi protocols, analytics tools |

## Connection Methods

| Field     | Description                                       |
| --------- | ------------------------------------------------- |
| `isAPI`   | Supports API key or address-based connection      |
| `isCSV`   | Supports manual CSV file import                   |
| `isOAuth` | Supports OAuth 2.0 authentication                 |

## Use Cases

This endpoint is useful for:

- **Integration Discovery**: Display all available integrations in your application UI
- **Dynamic UI Building**: Build integration selection interfaces dynamically
- **Metadata Display**: Show provider logos, names, and descriptions

## Notes

- This endpoint does **not** require authentication
- Returns all available integrations regardless of user's connected accounts
- Data is relatively static and can be cached for improved performance
- Use [`/v1/integrations`](/api/integrations) to get a user's connected integrations (requires authentication)
