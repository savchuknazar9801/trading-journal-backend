# Trade Routes Documentation

## Base Path: `/api/trades`

All routes related to trade management are accessed through this base path. All trade routes require authentication.

## Authentication

All trade routes require authentication using the `authenticate` middleware. The user must provide a valid JWT token in the Authorization header for all requests.

## Routes

### 1. Create Trade
- **Endpoint:** `POST /`
- **Description:** Create a new trade entry with automatic PnL calculation and strategy integration
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "symbol": "EURUSD",
    "entryPrice": 1.0850,
    "exitPrice": 1.0900,
    "size": 1.0,
    "direction": "buy",
    "strategyId": "optional-strategy-id",
    "notes": "Trade analysis",
    "imageUrls": ["https://example.com/trade-screenshot.png", "https://example.com/chart-analysis.jpg"],
    "tags": ["tag1", "tag2"]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Trade successfully created",
    "tradeId": "string"
  }
  ```
- **Notes:**
  - The tradeId is automatically generated and returned in the response
  - If `strategyId` is provided, PnL is calculated and added to the strategy's totalPnL
  - Uses forex-specific PnL calculation for currency pairs
  - Trade data is stored in the user's trades subcollection in Firestore

### 2. Update Trade
- **Endpoint:** `PUT /:tradeId`
- **Description:** Update an existing trade
- **Authentication:** Required
- **URL Parameters:**
  - `tradeId`: ID of the trade to update
- **Request Body:**
  ```json
  {
    // Updated trade object with all properties
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Trade updated successfully"
  }
  ```
- **Error Response (404):**
  ```json
  {
    "success": false,
    "message": "Trade document not found in database"
  }
  ```

### 3. Get Single Trade
- **Endpoint:** `GET /:tradeId`
- **Description:** Retrieve a specific trade by ID
- **Authentication:** Required
- **URL Parameters:**
  - `tradeId`: ID of the trade to retrieve
- **Response:**
  ```json
  {
    "success": true,
    "message": "Trade retrieved successfully",
    "data": {
      // Trade object properties
    }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "success": false,
    "message": "Trade document not found in database"
  }
  ```

### 4. Get All Trades
- **Endpoint:** `GET /`
- **Description:** Retrieve all trades for the authenticated user
- **Authentication:** Required
- **Response (with trades):**
  ```json
  {
    "success": true,
    "message": "All trades retrieved successfully",
    "data": [
      // Array of trade objects
    ]
  }
  ```
- **Response (no trades):**
  ```json
  {
    "success": true,
    "message": "No trades found for this user",
    "data": []
  }
  ```

### 5. Delete Trade
- **Endpoint:** `DELETE /:tradeId`
- **Description:** Delete a specific trade
- **Authentication:** Required
- **URL Parameters:**
  - `tradeId`: ID of the trade to delete
- **Response:**
  ```json
  {
    "success": true,
    "message": "Trade deleted successfully"
  }
  ```
- **Error Response (404):**
  ```json
  {
    "success": false,
    "message": "Trade document not found in database"
  }
  ```

## Data Structure

Trades are stored in Firestore under the path:
`users/{userId}/trades/{tradeId}`

### Trade Object Structure
```typescript
interface Trade {
  tradeId: string;           // Auto-generated
  symbol: string;            // Trading pair (e.g., "EURUSD")
  entryPrice: number;        // Entry price
  exitPrice: number;         // Exit price
  size: number;              // Position size (lot size)
  direction: 'buy' | 'sell'; // Trade direction
  notes?: string;            // Optional trade analysis
  imageUrls?: string[];      // Optional trade screenshots
  tags?: string[];           // Optional trade tags
  strategyId?: string;       // Optional strategy link
}
```

## Strategy Integration

When a trade includes a `strategyId`:
1. PnL is automatically calculated using the `calculatePnL()` utility
2. The calculated PnL is added to the strategy's `totalPnL`
3. Strategy document is updated via merge operation
4. Validates that the strategy exists before updating

## Notes
- All routes require authentication
- The trade ID is generated automatically when a trade is created
- Error responses follow a standard format:
  ```json
  {
    "success": false,
    "message": "Error description"
  }
  ```