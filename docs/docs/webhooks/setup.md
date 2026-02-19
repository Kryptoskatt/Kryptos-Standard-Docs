---
id: setup
title: Webhook Setup
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Webhook Setup

Webhooks allow you to receive real-time HTTP POST notifications when integration events occur in your workspace. Instead of polling the API, webhooks push data to your server as events happen.

## Prerequisites

Before you begin, ensure you have:

- A [Kryptos Developer Portal](https://dashboard.kryptos.io/) account
- An existing workspace (see [Developer Portal Setup](/developer-portal))
- A publicly accessible HTTPS endpoint to receive webhook events

## Step 1: Navigate to the Webhooks Section

Log in to the [Kryptos Developer Portal](https://dashboard.kryptos.io/) and open your workspace. Scroll down to the **Webhooks** section.

![Webhook Section](/img/developer-portal/webhook-view.png)

Click **+ Add Webhook** to create a new webhook.

## Step 2: Configure Your Webhook

Fill in the webhook configuration form:

![Add Webhook](/img/developer-portal/webhook-creation.png)

| Field                      | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| **Endpoint URL**           | The HTTPS URL where webhook events will be sent              |
| **Description** (optional) | A brief description to help identify this webhook            |
| **Events**                 | Select at least one event type to subscribe to               |

### Available Events

#### Integration Events

| Event                  | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `integration.created`  | A user connected a new wallet or exchange          |
| `integration.updated`  | An existing integration's settings were updated    |
| `integration.deleted`  | A user removed a wallet or exchange connection     |
| `integration.failed`   | An integration sync encountered an error           |

:::info More Events Coming Soon
Additional event categories will be added in the future. See the [Webhook Events](/webhooks/events) page for the latest list.
:::

Select the events you want to receive and click **Add Webhook**.

## Step 3: Save Your Signing Secret

After creating the webhook, a **signing secret** is displayed. This secret is used to verify that incoming webhook payloads are genuinely from Kryptos.

![Webhook Secret](/img/developer-portal/webhook-secret.png)

:::warning Important
Save your signing secret securely — it will only be shown once! If you lose it, you can rotate the secret from the webhook settings.
:::

## Verifying Webhook Signatures

Every webhook delivery includes an HMAC-SHA256 signature in the `X-Webhook-Signature` header. Use your signing secret to verify the payload authenticity.

### Delivery Headers

Each webhook request includes the following headers:

| Header                  | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `X-Webhook-Signature`   | HMAC-SHA256 hex digest of the request body     |
| `X-Webhook-Event`       | Event type (e.g., `integration.created`)       |
| `X-Webhook-Id`          | Unique delivery ID                             |
| `X-Webhook-Timestamp`   | ISO 8601 timestamp of the delivery             |
| `Content-Type`          | `application/json`                             |

### Signature Verification Examples

<Tabs>
<TabItem value="javascript" label="Node.js" default>

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express.js example
app.post('/webhooks/kryptos', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const event = req.headers['x-webhook-event'];

  if (!verifyWebhookSignature(req.body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  const payload = JSON.parse(req.body);

  switch (event) {
    case 'integration.created':
      console.log('New integration:', payload.data);
      break;
    case 'integration.updated':
      console.log('Integration updated:', payload.data);
      break;
    case 'integration.deleted':
      console.log('Integration removed:', payload.data);
      break;
    case 'integration.failed':
      console.log('Integration failed:', payload.data);
      break;
  }

  res.status(200).send('OK');
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import hmac
import hashlib
from flask import Flask, request, abort

app = Flask(__name__)

def verify_webhook_signature(payload, signature, secret):
    expected = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)

@app.route('/webhooks/kryptos', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Webhook-Signature')
    event = request.headers.get('X-Webhook-Event')

    if not verify_webhook_signature(request.data, signature, WEBHOOK_SECRET):
        abort(401, 'Invalid signature')

    payload = request.get_json()

    if event == 'integration.created':
        print('New integration:', payload['data'])
    elif event == 'integration.updated':
        print('Integration updated:', payload['data'])
    elif event == 'integration.deleted':
        print('Integration removed:', payload['data'])
    elif event == 'integration.failed':
        print('Integration failed:', payload['data'])

    return 'OK', 200
```

</TabItem>
</Tabs>

## Retry Behavior

Kryptos will retry failed webhook deliveries with exponential backoff:

- **Maximum retries:** 2 (3 total attempts)
- **Timeout:** 10 seconds per delivery
- **Retryable status codes:** `429`, `500`, `502`, `503`, `504`

Your endpoint should return a `2xx` status code within 10 seconds to acknowledge receipt. Any other response (or a timeout) triggers a retry.

## Managing Webhooks

From the Developer Portal, you can:

- **Edit** a webhook's URL, description, or subscribed events
- **Rotate the secret** if your signing secret is compromised
- **Disable** a webhook temporarily without deleting it
- **Delete** a webhook when it is no longer needed

## Best Practices

1. **Always verify signatures** — Check the `X-Webhook-Signature` header on every request to ensure payloads are from Kryptos.
2. **Respond quickly** — Return a `200` response immediately and process the event asynchronously. Long-running handlers risk timeouts and unnecessary retries.
3. **Handle duplicates** — Use the `X-Webhook-Id` header to deduplicate events in case of retries.
4. **Use HTTPS** — Your endpoint must use HTTPS to protect webhook data in transit.
5. **Monitor failures** — Track failed deliveries and investigate persistent errors.

## Next Steps

- [Webhook Events Reference](/webhooks/events) — Detailed payload structures for each event type
- [Integrations API](/api/integrations) — Query integration data via the API
- [Developer Portal Setup](/developer-portal) — Workspace and client configuration
