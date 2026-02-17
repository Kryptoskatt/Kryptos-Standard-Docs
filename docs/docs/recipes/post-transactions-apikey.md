---
id: post-transactions-apikey
title: Post Transactions with API Key
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Post Transactions with API Key Authentication

:::warning Enterprise Only
API key authentication is available for **Enterprise customers only**. Contact [support@kryptos.io](mailto:support@kryptos.io) for more information.
:::

This guide walks you through posting manual transactions to Kryptos using API key authentication.

## Prerequisites

Before you begin, ensure you have:

- An Enterprise Kryptos account
- An API key with `write:transactions` permission
- At least one connected wallet in your Kryptos account

## Step-by-Step Guide

### Step 1: Get Your API Key

1. Log in to [enterprise.kryptos.io](https://enterprise.kryptos.io)
2. Navigate to **Settings** → **API Keys**
3. Click **"Create New API Key"**
4. Configure your key:
   - Name your key (e.g., "Production API")
   - Select `write:transactions` permission
   - Optional: Set IP restrictions
   - Optional: Set expiration date
5. **Copy your API key** (shown only once!)

:::warning Keep Your API Key Safe
Never expose your API key in client-side code or public repositories. Store it securely using environment variables.
:::

### Step 2: Retrieve Your Wallet ID

Call the `/api/v1/integrations` endpoint to get your connected wallets:

```bash
curl -X GET "https://connect.kryptos.io/api/v1/integrations" \
  -H "X-API-Key: kryptos_live_xxxxxxxxxxxxxxxxxxxx"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "walletId": "wallet_abc123",
      "name": "My Ethereum Wallet",
      "type": "ethereum",
      "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
    }
  ]
}
```

Copy the `walletId` you want to use for your transaction.

### Step 3: (Optional) Get Integration Details for Sender/Receiver

:::info
The `sender` and `receiver` fields are **optional**. Include them only if you want to track the source/destination of funds.
:::

If your transaction involves a known exchange or platform, retrieve integration details:

```bash
curl -X GET "https://connect-api.kryptos.io/integrations/public/list"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "binance",
      "name": "binance",
      "publicName": "Binance",
      "logo": "https://storage.googleapis.com/kryptos-public/logos/binance.png",
      "type": "exchange"
    },
    {
      "id": "ethereum",
      "name": "ethereum",
      "publicName": "Ethereum",
      "logo": "https://storage.googleapis.com/kryptos-public/logos/ethereum.png",
      "type": "wallet"
    }
  ]
}
```

Note the integration details if you want to use `sender` or `receiver` fields (optional).

### Step 4: Prepare Your Transaction Data

Create a JSON payload with your transaction details:

<details style={{backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '6px'}}>
<summary style={{cursor: 'pointer', color: 'var(--ifm-color-primary)', fontWeight: '600'}}>📄 Example: Simple Deposit Transaction</summary>

```json
{
  "walletId": "wallet_abc123",
  "transactions": [
    {
      "timestamp": 1708214400000,
      "transactionType": "deposit",
      "transactionId": "deposit_001",
      "receivedCurrency": {
        "currency": "ETH",
        "amount": 2.5
      },
      "label": "Deposit"
    }
  ]
}
```

</details>

<details style={{backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '6px', marginTop: '1rem'}}>
<summary style={{cursor: 'pointer', color: 'var(--ifm-color-primary)', fontWeight: '600'}}>📄 Example: Deposit with Sender (Optional)</summary>

```json
{
  "walletId": "wallet_abc123",
  "transactions": [
    {
      "timestamp": 1708214400000,
      "transactionType": "deposit",
      "transactionId": "binance_12345678",
      "description": {
        "title": "Deposit from Binance",
        "desc": "Transferred ETH from Binance to my wallet"
      },
      "receivedCurrency": {
        "currency": "ETH",
        "amount": 2.5
      },
      "sender": {
        "name": "BINANCE",
        "publicName": "Binance",
        "walletId": "binance"
      },
      "label": "Deposit"
    }
  ]
}
```

</details>

<details style={{backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '6px', marginTop: '1rem'}}>
<summary style={{cursor: 'pointer', color: 'var(--ifm-color-primary)', fontWeight: '600'}}>📄 Example: Trade Transaction</summary>

```json
{
  "walletId": "wallet_abc123",
  "transactions": [
    {
      "timestamp": 1708214400000,
      "transactionType": "trade",
      "transactionId": "0x789def456abc123...",
      "description": {
        "title": "ETH to USDC Swap",
        "desc": "Swapped ETH for USDC on Uniswap"
      },
      "sentCurrency": {
        "currency": "ETH",
        "amount": 1.0
      },
      "receivedCurrency": {
        "currency": "USDC",
        "amount": 3000
      },
      "fee": {
        "currency": "ETH",
        "amount": 0.005
      },
      "label": "DeFi Swap"
    }
  ]
}
```

</details>

<details style={{backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '6px', marginTop: '1rem'}}>
<summary style={{cursor: 'pointer', color: 'var(--ifm-color-primary)', fontWeight: '600'}}>📄 Example: Withdrawal Transaction</summary>

```json
{
  "walletId": "wallet_abc123",
  "transactions": [
    {
      "timestamp": 1708214400000,
      "transactionType": "withdrawal",
      "transactionId": "0x456abc123def789...",
      "description": {
        "title": "Withdrawal to Coinbase",
        "desc": "Sent BTC to Coinbase exchange"
      },
      "sentCurrency": {
        "currency": "BTC",
        "amount": 0.5
      },
      "receiver": {
        "name": "COINBASE",
        "publicName": "Coinbase",
        "walletId": "coinbase"
      },
      "fee": {
        "currency": "BTC",
        "amount": 0.0001
      },
      "label": "Withdrawal"
    }
  ]
}
```

</details>

### Step 5: Post the Transaction

Send the transaction to the API:

```bash
curl -X POST "https://connect.kryptos.io/api/v0/transactions" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: kryptos_live_xxxxxxxxxxxxxxxxxxxx" \
  -d '{
    "walletId": "wallet_abc123",
    "transactions": [
      {
        "timestamp": 1708214400000,
        "transactionType": "deposit",
        "transactionId": "0xabc123def456789...",
        "receivedCurrency": {
          "currency": "ETH",
          "amount": 2.5
        },
        "label": "Deposit"
      }
    ]
  }'
```

### Step 6: Handle the Response

**Success Response (201 Created):**

```json
{
  "message": "1 transaction(s) created successfully",
  "data": [
    {
      "timestamp": 1708214400000,
      "transactionType": "deposit",
      "transactionId": "deposit_001",
      "source": {
        "walletId": "wallet_abc123",
        "name": "My Ethereum Wallet"
      }
    }
  ],
  "count": 1,
  "user_id": "user_123",
  "timestamp": 1708214567890
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "invalid_parameters",
  "message": "Invalid request body",
  "details": [
    {
      "path": ["transactions", 0, "timestamp"],
      "message": "Required"
    }
  ]
}
```

## Common Use Cases

### Use Case 1: Posting Multiple Transactions

You can post up to multiple transactions in a single request:

```json
{
  "walletId": "wallet_abc123",
  "transactions": [
    {
      "timestamp": 1708214400000,
      "transactionType": "deposit",
      "transactionId": "tx_001",
      "receivedCurrency": { "currency": "ETH", "amount": 1.0 },
      "label": "Deposit"
    },
    {
      "timestamp": 1708214500000,
      "transactionType": "trade",
      "transactionId": "tx_002",
      "sentCurrency": { "currency": "ETH", "amount": 0.5 },
      "receivedCurrency": { "currency": "USDC", "amount": 1500 },
      "label": "Swap"
    }
  ]
}
```

### Use Case 2: External Wallet Transfer

When transferring from an external wallet (not in Kryptos system):

```json
{
  "walletId": "wallet_abc123",
  "transactions": [
    {
      "timestamp": 1708214400000,
      "transactionType": "deposit",
      "transactionId": "0x123abc456def789...",
      "receivedCurrency": {
        "currency": "BTC",
        "amount": 0.1
      },
      "sender": {
        "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        "name": "EXTERNAL EXCHANGE"
      },
      "label": "Deposit"
    }
  ]
}
```

### Use Case 3: Transaction with Fiat Values

Include fiat values for accurate cost basis tracking:

```json
{
  "walletId": "wallet_abc123",
  "transactions": [
    {
      "timestamp": 1708214400000,
      "transactionType": "trade",
      "transactionId": "0x789ghi123jkl456...",
      "sentCurrency": {
        "currency": "ETH",
        "amount": 1.0
      },
      "receivedCurrency": {
        "currency": "USDC",
        "amount": 3000
      },
      "fee": {
        "currency": "ETH",
        "amount": 0.005
      },
      "feeValue": {
        "fiatValue": 15.0,
        "baseCurrency": "USD",
        "priceAccuracy": "high"
      },
      "netValue": {
        "fiatValue": 3000.0,
        "baseCurrency": "USD",
        "priceAccuracy": "high"
      },
      "label": "Swap"
    }
  ]
}
```

## Best Practices

### 1. Transaction IDs

- Use the actual **transaction hash** (for blockchain transactions) or **exchange-specific ID** (for exchange transactions)
- For blockchain: Use the on-chain transaction hash (e.g., `0xabc123...`)
- For exchanges: Use the exchange's transaction/order ID (e.g., Binance order ID)
- For manual entries: Create unique IDs with a prefix (e.g., `manual_20240218_001`)

### 2. Timestamps

- Always use Unix timestamps in milliseconds
- Ensure timestamps are accurate for tax reporting
- Use `Date.now()` in JavaScript or `time.time() * 1000` in Python

### 3. Labels

- Choose appropriate labels from the [supported labels list](/api-legacy/transactions#transaction-labels)
- Consistent labeling helps with accurate tax calculations
- Use specific labels (e.g., `DeFi Swap` instead of `Trade`) when possible

### 4. Integration Matching

- When referencing exchanges/platforms, use exact values from the public integrations list
- `name` should be in UPPERCASE (e.g., "BINANCE")
- `publicName` should match exactly (e.g., "Binance")

### 5. Error Handling

- Implement retry logic for network failures
- Validate your payload before sending
- Log all API responses for debugging

## Troubleshooting

### Error: "Unauthorized" or "Invalid API Key"

**Cause:** API key is missing, invalid, or doesn't have required permissions.

**Solution:**

1. Ensure you're including the `X-API-Key` header
2. Verify your API key has the `write:transactions` permission
3. Check that the API key hasn't expired
4. Confirm you're using the correct API key format: `kryptos_live_xxxx...`

### Error: "Wallet not found"

**Cause:** The `walletId` doesn't exist in your account.

**Solution:**

1. Call `GET /api/v1/integrations` with your API key to get valid wallet IDs
2. Ensure you're using the correct API key

### Error: "Invalid parameters"

**Cause:** Required fields are missing or have invalid values.

**Solution:**

1. Check that `timestamp`, `transactionType`, and `transactionId` are provided
2. Verify `transactionType` is one of: `deposit`, `withdrawal`, `trade`, `payment`
3. Ensure timestamp is a valid Unix timestamp in milliseconds

### Error: "Invalid label"

**Cause:** The label value doesn't match any supported label.

**Solution:**

1. Check the [Transaction Labels](/api-legacy/transactions#transaction-labels) section
2. Ensure the label is spelled exactly as shown (case-sensitive)
3. Verify the label is compatible with your transaction type

## Next Steps

- [View full API reference](/api-legacy/transactions)
- [Learn about OAuth authentication](/authentication/oauth)
- [Explore other API endpoints](/api/transactions)
- [Contact support](mailto:support@kryptos.io) for help

## Code Examples

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
const axios = require('axios');

async function postTransaction() {
  const transaction = {
    walletId: 'wallet_abc123',
    transactions: [
      {
        timestamp: Date.now(),
        transactionType: 'deposit',
        transactionId: '0xabc123def456...', // Use actual transaction hash or exchange ID
        receivedCurrency: {
          currency: 'ETH',
          amount: 2.5
        },
        label: 'Deposit'
      }
    ]
  };

  try {
    const response = await axios.post(
      'https://connect.kryptos.io/api/v0/transactions',
      transaction,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.KRYPTOS_API_KEY
        }
      }
    );

    console.log('Transaction created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

postTransaction();
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import time
import os

def post_transaction():
    transaction = {
        "walletId": "wallet_abc123",
        "transactions": [
            {
                "timestamp": int(time.time() * 1000),
                "transactionType": "deposit",
                "transactionId": "0xabc123def456...",  # Use actual transaction hash or exchange ID
                "receivedCurrency": {
                    "currency": "ETH",
                    "amount": 2.5
                },
                "label": "Deposit"
            }
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": os.getenv("KRYPTOS_API_KEY")
    }

    try:
        response = requests.post(
            "https://connect.kryptos.io/api/v0/transactions",
            json=transaction,
            headers=headers
        )
        response.raise_for_status()

        print("Transaction created:", response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        print("Error:", e.response.json() if e.response else str(e))
        raise

post_transaction()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
#!/bin/bash

# Set your credentials
API_KEY="kryptos_live_xxxxxxxxxxxxxxxxxxxx"
WALLET_ID="wallet_abc123"

# Transaction hash or exchange ID
TRANSACTION_ID="0xabc123def456..."

# Generate timestamp
TIMESTAMP=$(date +%s000)

# Post transaction
curl -X POST "https://connect.kryptos.io/api/v0/transactions" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{
    \"walletId\": \"$WALLET_ID\",
    \"transactions\": [
      {
        \"timestamp\": $TIMESTAMP,
        \"transactionType\": \"deposit\",
        \"transactionId\": \"$TRANSACTION_ID\",
        \"receivedCurrency\": {
          \"currency\": \"ETH\",
          \"amount\": 2.5
        },
        \"label\": \"Deposit\"
      }
    ]
  }"
```

</TabItem>
</Tabs>

## Related Resources

- [API Key Authentication Guide](/authentication/api-key) - Complete API key setup and management
- [Legacy Transactions API](/api-legacy/transactions) - V0 transactions endpoint documentation
- [Transaction Types Reference](/api/transactions) - V1 transactions endpoint
- [Public Integrations List](/public-endpoints/integrations) - All supported integrations for sender/receiver
- [Error Codes Reference](/reference/errors) - API error codes
