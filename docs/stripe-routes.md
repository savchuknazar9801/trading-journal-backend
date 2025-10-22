# TrackEdge API - Stripe Integration Guide

## Overview

The TrackEdge API provides subscription management capabilities through Stripe. This document describes the available endpoints, request formats, and expected responses.

## Base URL

```
https://api.trackedge.io
```

## Authentication

All requests (except webhooks) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Create Subscription

Creates a new subscription for the authenticated user.

**Endpoint**: `POST /stripe/subscription`

**Request Body**:
```json
{
  "tier": "pro" | "elite"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "subscriptionId": "sub_xxxxxxxxxxxxx",
    "customerId": "cus_xxxxxxxxxxxxx",
    "status": "active",
    "currentPeriodEnd": 1677684989,
    "plan": "pro"
  }
}
```

**Important Notes**:
- When you create a subscription, TrackEdge immediately stores the `stripeSubscriptionId` in your user record.
- The webhook handler is responsible for actually updating your subscription status and plan tier based on payment confirmation.
- A subscription's status may initially be `incomplete` if payment hasn't been confirmed yet.

**Error Responses**:

- 400 Bad Request:
  ```json
  {
    "success": false,
    "message": "Failed to create new subscription. Tier must be defined"
  }
  ```

- 400 Bad Request:
  ```json
  {
    "success": false,
    "message": "Failed to create new subscription. Tier must only be either \"pro\" or \"elite\""
  }
  ```

- 401 Unauthorized:
  ```json
  {
    "message": "Authentication failed. Ensure token is in headers"
  }
  ```

### Get Subscription (To be implemented)

Retrieves the current user's subscription details.

**Endpoint**: `GET /stripe/subscription`

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_xxxxxxxxxxxxx",
    "customerId": "cus_xxxxxxxxxxxxx",
    "status": "active",
    "plan": "pro",
    "currentPeriodEnd": 1677684989,
    "cancelAtPeriodEnd": false
  }
}
```

### Cancel Subscription (To be implemented)

Cancels the user's subscription at the end of the current billing period.

**Endpoint**: `POST /stripe/subscription/cancel`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Subscription will be canceled at the end of the current billing period",
  "data": {
    "subscriptionId": "sub_xxxxxxxxxxxxx",
    "canceledAt": 1677684989,
    "currentPeriodEnd": 1677684989
  }
}
```

### Upgrade/Downgrade Subscription (To be implemented)

Changes the user's subscription tier.

**Endpoint**: `PUT /stripe/subscription`

**Request Body**:
```json
{
  "tier": "pro" | "elite"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "data": {
    "subscriptionId": "sub_xxxxxxxxxxxxx",
    "status": "active",
    "plan": "elite",
    "currentPeriodEnd": 1677684989
  }
}
```

### Get Payment Methods (To be implemented)

Retrieves the user's saved payment methods.

**Endpoint**: `GET /stripe/payment-methods`

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "paymentMethods": [
      {
        "id": "pm_xxxxxxxxxxxxx",
        "type": "card",
        "card": {
          "brand": "visa",
          "last4": "4242",
          "exp_month": 12,
          "exp_year": 2025
        },
        "isDefault": true
      }
    ]
  }
}
```

### Get Invoices (To be implemented)

Retrieves the user's billing history.

**Endpoint**: `GET /stripe/invoices`

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "in_xxxxxxxxxxxxx",
        "amount": 1500,
        "currency": "usd",
        "status": "paid",
        "created": 1677684989,
        "pdfUrl": "https://pay.stripe.com/invoice/xxx/xxx/pdf"
      }
    ]
  }
}
```

## Webhook Events

The TrackEdge API processes the following Stripe webhook events:

| Event Type | Description | User Impact |
|------------|-------------|-------------|
| `customer.subscription.created` | Triggered when a user subscribes to a plan | User is granted access to the subscription tier if payment succeeds |
| `customer.subscription.updated` | Triggered when a subscription is modified | User's subscription status and details are updated |
| `customer.subscription.deleted` | Triggered when a subscription is canceled | User is downgraded to the free tier |
| `invoice.payment_succeeded` | Triggered when a payment is successful | User's subscription remains active |
| `invoice.payment_failed` | Triggered when a payment fails | User's subscription may be marked as past_due |

## Subscription Workflow

1. **Creation**: When a user initiates a subscription:
   - The API creates a Stripe customer (if needed)
   - The API creates a Stripe subscription
   - The API stores the subscription ID in the user's record
   - The user gets a response with subscription details

2. **Confirmation**: After the subscription is created:
   - Stripe attempts to process payment
   - Stripe sends webhook events to the API
   - The webhook handler updates the user's subscription status
   - User access is granted only when payment is confirmed

3. **Maintenance**: Throughout the subscription lifetime:
   - Stripe automatically handles recurring billing
   - Webhook events keep user status in sync with Stripe
   - API endpoints allow users to manage their subscription

## Subscription Statuses

Subscriptions can have the following statuses:

| Status | Description | User Access |
|--------|-------------|-------------|
| `active` | The subscription is in good standing | Full access to subscribed tier |
| `trialing` | User is in trial period | Full access to subscribed tier |
| `past_due` | Payment has failed but the subscription is still active | Full access, but will lose access if payment continues to fail |
| `canceled` | The subscription has been canceled | Access until the end of the current period |
| `unpaid` | Payment has failed and the subscription is no longer active | No access to premium features |
| `incomplete` | The subscription has been created but payment has not been confirmed | No access to premium features yet |
| `incomplete_expired` | The initial payment failed and the subscription creation period expired | No access to premium features |

## Testing

For testing purposes, you can use Stripe's test credit card numbers:

- **Successful payment**: 4242 4242 4242 4242
- **Failed payment**: 4000 0000 0000 0002
- **Requires authentication**: 4000 0025 0000 3155

## Error Handling

All API errors return JSON responses with `success: false` and a descriptive error message.

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

## Webhook Setup

To receive Stripe events:

1. Go to the Stripe Dashboard → Developers → Webhooks
2. Add a new endpoint with URL: `https://api.trackedge.io/stripe/webhook`
3. Select relevant events to listen for (at minimum: `customer.subscription.*` and `invoice.*`)
4. Add the provided webhook secret to your environment variables as `STRIPE_WEBHOOK_SECRET_KEY`

## Environment Variables

The following environment variables must be configured:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ELITE=price_...
STRIPE_WEBHOOK_SECRET_KEY=whsec_...
```

---

This document will be updated as new endpoints and features are implemented.