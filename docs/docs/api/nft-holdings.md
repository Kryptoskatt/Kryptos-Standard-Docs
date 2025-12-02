---
id: nft-holdings
title: NFT Holdings
sidebar_position: 6
---

# NFT Holdings

<span className="badge badge--get">GET</span> `/v1/nft-holdings`

Retrieve user's NFT collection with metadata.

**Required Permission:** `read:nft`

## Request

```bash
curl -X GET "https://connect.kryptos.io/api/v1/nft-holdings?chain=ethereum&limit=10" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `source` | string | Filter by data sources (comma-separated, max 30) |
| `collection` | string | Filter by collections (comma-separated, max 30) |
| `chain` | string | Filter by blockchain: `ethereum`, `polygon` |
| `tokenId` | string | Specific token ID |
| `contract` | string | Contract address |
| `limit` | number | Max results (1-1000, default: 100) |
| `offset` | number | Pagination offset (default: 0) |

## Response

```json
{
  "holdings": [
    {
      "id": "nft_123",
      "contractAddress": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      "tokenId": "1234",
      "name": "Bored Ape #1234",
      "description": "A unique NFT from the BAYC collection",
      "contentType": "image/png",
      "nftUrl": "https://...",
      "thumbnailUrl": "https://...",
      "source": {
        "provider": "MetaMask",
        "walletId": "wallet_123",
        "publicAddress": "0x742d35..."
      },
      "ercType": "ERC-721",
      "amount": 1,
      "price": {
        "price": 150000,
        "baseCurrency": "USD"
      },
      "isNftSpam": false,
      "collection": {
        "collectionId": "bayc",
        "name": "Bored Ape Yacht Club",
        "description": "...",
        "imageUrl": "https://...",
        "floorPrice": [
          {
            "price": 50,
            "baseCurrency": "ETH"
          }
        ],
        "ownerCount": 6000,
        "totalQuantity": 10000,
        "socialLinks": [
          {
            "platform": "twitter",
            "url": "https://twitter.com/BoredApeYC"
          }
        ]
      },
      "lastSale": {
        "fromAddress": "0x...",
        "toAddress": "0x742d35...",
        "quantity": 1,
        "timestamp": "2023-01-15T10:30:00Z",
        "transactionHash": "0xdef456...",
        "marketplaceName": "OpenSea",
        "totalPrice": {
          "price": 45,
          "baseCurrency": "ETH"
        }
      }
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0
  },
  "user_id": "user_123"
}
```

## NFT Types

| Type | Description |
|------|-------------|
| `ERC-721` | Standard NFT (unique) |
| `ERC-1155` | Multi-token standard |

