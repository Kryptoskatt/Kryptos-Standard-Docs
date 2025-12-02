---
id: profiling
title: Portfolio Insights
sidebar_position: 7
---

# Portfolio Insights

<span className="badge badge--get">GET</span> `/v1/profiling`

Get comprehensive portfolio analytics and user classification.

**Required Permission:** `read:analytics`

## Request

```bash
curl -X GET "https://connect.kryptos.io/api/v1/profiling" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "X-Client-Id: YOUR_CLIENT_ID" \
  -H "X-Client-Secret: YOUR_CLIENT_SECRET"
```

## Response

```json
{
  "user_id": "user_123",
  "base_currency": "USD",
  "user_classification": "DeFi Hodler",
  "summary": {
    "classification": "DeFi Hodler",
    "portfolio_overview": {
      "total_value": 275000,
      "currency": "USD",
      "size_category": "Medium",
      "dominant_category": "DeFi",
      "dominant_percentage": 54.5,
      "change_24h_percentage": 2.8,
      "unrealized_pnl": 75000,
      "roi_percentage": 37.5
    },
    "asset_breakdown": {
      "regular_crypto": {
        "value": 100000,
        "percentage": 36.4,
        "count": 8
      },
      "nfts": {
        "value": 25000,
        "percentage": 9.1,
        "count": 5
      },
      "defi": {
        "value": 150000,
        "percentage": 54.5,
        "count": 3
      }
    },
    "activity_summary": {
      "total_transactions": 342,
      "activity_level": "High",
      "activity_description": "45 transactions this month",
      "recent_activity": {
        "last_week": 12,
        "last_month": 45,
        "last_year": 342
      },
      "top_transaction_types": [
        { "label": "DeFi", "count": 156 },
        { "label": "Swap", "count": 89 },
        { "label": "Transfer", "count": 67 }
      ]
    },
    "summary_text": "DeFi Hodler with medium portfolio ($275,000 USD). DeFi dominant at 54.5%. Portfolio up 2.80% (24h). High activity with 45 transactions this month."
  }
}
```

## User Classifications

| Classification | Description |
|----------------|-------------|
| **NFT Enthusiast** | Heavy NFT portfolio (>30% NFT holdings) |
| **DeFi Hodler** | Significant DeFi positions (>40% DeFi holdings) |
| **Futures Trader** | Active futures trading patterns |
| **BTC Maximalist** | Bitcoin-dominant portfolio (>60% BTC) |
| **Active Trader** | High-frequency diverse trading activity |
| **Long-term Holder** | Long-term holding with low activity |

## Portfolio Size Categories

| Category | Value Range |
|----------|-------------|
| Small | < $10,000 |
| Medium | $10,000 – $500,000 |
| Large | $500,000 – $5,000,000 |
| Whale | > $5,000,000 |

## Activity Levels

| Level | Description |
|-------|-------------|
| Low | < 5 transactions/month |
| Medium | 5–20 transactions/month |
| High | > 20 transactions/month |

