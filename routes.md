# TrackEdge RESTful CRUD Routes Guide

This guide provides a comprehensive overview of all CRUD (Create, Read, Update, Delete) routes for the TrackEdge API, following RESTful naming conventions.

## Table of Contents
- [User Management Routes](#user-management-routes)
- [Trade Routes](#trade-routes)
- [Strategy Routes](#strategy-routes)
- [Trading Plan Routes](#trading-plan-routes)

## User Management Routes

| Operation | HTTP Method | Route | Request Body | Response | Description |
|-----------|-------------|-------|-------------|----------|-------------|
| Register | POST | `/auth/users` | `{ fullName, email, password, subscriptionPlan }` | `{ message }` | Create a new user account |
| Get Profile | GET | `/auth/users/me` | - | `{ user }` | Retrieve current authenticated user profile |
| Update Full Profile | PUT | `/auth/users/me` | `{ fullName, email, subscriptionPlan }` | `{ message }` | Update all user profile fields |
| Update Email | PATCH | `/auth/users/me/email` | `{ email }` | `{ message }` | Update only user's email |
| Update Password | PATCH | `/auth/users/me/password` | `{ password, newPassword }` | `{ message }` | Update user's password |
| Update Name | PATCH | `/auth/users/me/name` | `{ fullName }` | `{ message }` | Update only user's name |
| Update Subscription | PATCH | `/auth/users/me/subscription` | `{ subscriptionPlan }` | `{ message }` | Update only user's subscription plan |
| Delete Account | DELETE | `/auth/users/me` | - | `{ message }` | Delete current user's account |

### Authentication Note
All routes except for `/auth/users` (registration) require authentication, with the JWT token included in the Authorization header:
```
Authorization: Bearer {token}
```

## Trade Routes

| Operation | HTTP Method | Route | Request Body | Response | Description |
|-----------|-------------|-------|-------------|----------|-------------|
| Create Trade | POST | `/trades` | `{ trade }` | `{ message, tradeId }` | Create a new trade |
| Get All Trades | GET | `/trades` | - | `{ message, tradesData }` | Retrieve all trades for the authenticated user |
| Get Trade | GET | `/trades/{tradeId}` | - | `{ message, data }` | Retrieve a specific trade by ID |
| Update Trade | PUT | `/trades/{tradeId}` | `{ newTrade }` | `{ message }` | Update a specific trade completely |
| Update Trade Partially | PATCH | `/trades/{tradeId}` | `{...fieldsToUpdate}` | `{ message }` | Update specific fields of a trade |
| Delete Trade | DELETE | `/trades/{tradeId}` | - | `{ message }` | Delete a specific trade |

### Query Parameters for Filtering Trades
The GET `/trades` endpoint should support the following optional query parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| symbol | string | Filter by trading symbol | `/trades?symbol=EURUSD` |
| direction | string | Filter by trade direction | `/trades?direction=buy` |
| fromDate | number | Filter by entry date (start) | `/trades?fromDate=1620000000000` |
| toDate | number | Filter by entry date (end) | `/trades?toDate=1630000000000` |
| session | string | Filter by trading session | `/trades?session=london` |
| tag | string | Filter by tag | `/trades?tag=breakout` |

## Strategy Routes

| Operation | HTTP Method | Route | Request Body | Response | Description |
|-----------|-------------|-------|-------------|----------|-------------|
| Create Strategy | POST | `/strategies` | `{ strategy }` | `{ message, strategyId }` | Create a new trading strategy |
| Get All Strategies | GET | `/strategies` | - | `{ message, strategiesData }` | Retrieve all strategies for the authenticated user |
| Get Strategy | GET | `/strategies/{strategyId}` | - | `{ message, data }` | Retrieve a specific strategy by ID |
| Update Strategy | PUT | `/strategies/{strategyId}` | `{ newStrategy }` | `{ message }` | Update a specific strategy completely |
| Update Strategy Partially | PATCH | `/strategies/{strategyId}` | `{...fieldsToUpdate}` | `{ message }` | Update specific fields of a strategy |
| Delete Strategy | DELETE | `/strategies/{strategyId}` | - | `{ message }` | Delete a specific strategy |

## Trading Plan Routes

| Operation | HTTP Method | Route | Request Body | Response | Description |
|-----------|-------------|-------|-------------|----------|-------------|
| Create Plan | POST | `/plans` | `{ tradingPlan }` | `{ message, tradingPlanId }` | Create a new trading plan |
| Get All Plans | GET | `/plans` | - | `{ message, plansData }` | Retrieve all trading plans for the authenticated user |
| Get Plan | GET | `/plans/{planId}` | - | `{ message, data }` | Retrieve a specific trading plan by ID |
| Update Plan | PUT | `/plans/{planId}` | `{ newPlan }` | `{ message }` | Update a specific trading plan completely |
| Update Plan Partially | PATCH | `/plans/{planId}` | `{...fieldsToUpdate}` | `{ message }` | Update specific fields of a trading plan |
| Delete Plan | DELETE | `/plans/{planId}` | - | `{ message }` | Delete a specific trading plan |

## Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request succeeded (for GET, PUT, PATCH, DELETE) |
| 201 | Created - Resource successfully created (for POST) |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication failed or not provided |
| 403 | Forbidden - User doesn't have permission |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Something went wrong on the server |

## Response Format

For consistency, all API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful description",
  "data": {
    // Optional data object (e.g. user profile, trade details)
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error information"
  }
}
```

## Implementation Notes

1. All routes (except registration) require authentication via the `authenticate` middleware
2. All operations are automatically scoped to the authenticated user via `user.uid` from the token
3. Routes should return appropriate HTTP status codes
4. Validation should be added for all incoming request data
5. Consistent error handling should be implemented across all routes