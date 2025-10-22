# Strategy Routes Documentation

## Base Path: `/api/strategies`

All routes related to strategy management are accessed through this base path. All strategy routes require authentication.

## Authentication

All strategy routes require authentication using the `authenticate` middleware. The user must provide a valid JWT token in the Authorization header for all requests.

## Routes

### 1. Create Strategy
- **Endpoint:** `POST /`
- **Description:** Create a new trading strategy with automatic PnL tracking initialization
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "name": "Breakout Strategy",
    "entryStrategy": "Enter on resistance break with volume confirmation",
    "holdingStrategy": "Hold until trend reversal signals", 
    "exitStrategy": "Exit on 50% retracement or stop loss",
    "imageUrls": ["https://example.com/strategy-chart.jpg", "https://example.com/backtest-analysis.png"]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Strategy successfully created",
    "strategyId": "string"
  }
  ```
- **Notes:**
  - The strategyId is automatically generated and returned in the response
  - `totalPnL` is automatically initialized to 0
  - Strategy data is stored in the user's strategies subcollection in Firestore

### 2. Get All Strategies
- **Endpoint:** `GET /`
- **Description:** Retrieve all strategies for the authenticated user
- **Authentication:** Required
- **Response (with strategies):**
  ```json
  {
    "success": true,
    "message": "All strategies retrieved successfully", 
    "data": [
      // Array of strategy objects
    ]
  }
  ```
- **Response (no strategies):**
  ```json
  {
    "success": true,
    "message": "No strategies found for this user",
    "data": []
  }
  ```

### 3. Get Single Strategy
- **Endpoint:** `GET /:strategyId`
- **Description:** Retrieve a specific strategy by ID
- **Authentication:** Required
- **URL Parameters:**
  - `strategyId`: ID of the strategy to retrieve
- **Response:**
  ```json
  {
    "success": true,
    "message": "Strategy retrieved successfully",
    "data": {
      // Strategy object with current totalPnL
    }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "success": false,
    "message": "Strategy document not found in database"
  }
  ```

### 4. Update Strategy
- **Endpoint:** `PUT /:strategyId`
- **Description:** Update an existing strategy (replaces entire document)
- **Authentication:** Required
- **URL Parameters:**
  - `strategyId`: ID of the strategy to update
- **Request Body:**
  ```json
  {
    "newStrategy": {
      "name": "Updated Strategy Name",
      "entryStrategy": "New entry rules",
      "holdingStrategy": "New holding rules", 
      "exitStrategy": "New exit rules",
      "totalPnL": 1250.75,
      "imageUrls": ["https://example.com/updated-strategy-chart.jpg"]
    }
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Strategy updated successfully"
  }
  ```
- **Error Response (404):**
  ```json
  {
    "success": false,
    "message": "Strategy document not found in database"
  }
  ```

### 5. Delete Strategy
- **Endpoint:** `DELETE /:strategyId`
- **Description:** Delete a specific strategy
- **Authentication:** Required
- **URL Parameters:**
  - `strategyId`: ID of the strategy to delete
- **Response:**
  ```json
  {
    "success": true,
    "message": "Strategy deleted successfully"
  }
  ```
- **Error Response (404):**
  ```json
  {
    "success": false,
    "message": "Strategy document not found in database"
  }
  ```

## Data Structure

Strategies are stored in Firestore under the path:
`users/{userId}/strategies/{strategyId}`

### Strategy Object Structure
```typescript
interface Strategy {
  strategyId: string;        // Auto-generated
  name: string;              // Strategy name
  entryStrategy: string;     // Entry rules and criteria
  holdingStrategy: string;   // Position management rules
  exitStrategy: string;      // Exit rules and criteria
  totalPnL?: number;         // Cumulative PnL from linked trades
  imageUrls?: string[];      // Strategy analysis image/chart URLs
}
```

## PnL Integration

### Automatic PnL Tracking
- New strategies initialize with `totalPnL: 0`
- When trades are created with a `strategyId`, their PnL is automatically added
- `totalPnL` maintains a running sum of all linked trade profits/losses

### Manual PnL Management
- `totalPnL` can be manually updated via PUT endpoint
- Useful for adjustments or corrections

## Usage Workflow

1. **Create Strategy** → Gets unique `strategyId` and `totalPnL: 0`
2. **Create Trades** → Include `strategyId` to automatically update strategy PnL
3. **Monitor Performance** → View strategy with updated `totalPnL`
4. **Update Strategy** → Modify rules or manually adjust PnL if needed

## Notes
- All routes require authentication
- The strategy ID is generated automatically when a strategy is created
- imageUrls arrays support multiple image URLs for strategy documentation
- Error responses follow a standard format:
  ```json
  {
    "success": false,
    "message": "Error description"
  }
  ```