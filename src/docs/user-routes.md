# User Routes Documentation

## Base Path: `/api/users`

All routes related to user management are accessed through this base path.

## Routes

### 1. Create User
- **Endpoint:** `POST /`
- **Description:** Register a new user
- **Authentication:** None
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "subscription": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User successfully created",
    "data": {
      "userId": "string"
    }
  }
  ```
- **Notes:**
  - Creates user in Firebase Auth and Firestore
  - Sends verification email automatically

### 2. Get User Profile
- **Endpoint:** `GET /me`
- **Description:** Retrieve current user's profile information
- **Authentication:** Required
- **Response:**
  ```json
  {
    "success": true,
    "message": "User profile retrieved successfully",
    "data": {
      "email": "string",
      "emailVerified": boolean,
      "creationTime": "string",
      "lastSignInTime": "string",
      "name": "string",
      "subscription": "string",
      "photo": "string" // Optional, only if exists
    }
  }
  ```

### 3. Update Email
- **Endpoint:** `PATCH /me/email`
- **Description:** Update user's email address
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "newEmail": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Email updated successfully"
  }
  ```

### 4. Update Password
- **Endpoint:** `PATCH /me/password`
- **Description:** Update user's password
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "newPassword": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Password updated successfully"
  }
  ```

### 5. Update Name
- **Endpoint:** `PATCH /me/name`
- **Description:** Update user's name
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "newName": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Name updated successfully"
  }
  ```

### 6. Update Subscription
- **Endpoint:** `PATCH /me/subscription`
- **Description:** Update user's subscription status
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "newSubscription": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Subscription updated successfully"
  }
  ```

### 7. Update Profile Photo
- **Endpoint:** `PATCH /me/photo`
- **Description:** Update user's profile photo
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "newPhoto": "string" // URL or base64 string
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User photo updated successfully"
  }
  ```

### 8. Delete User
- **Endpoint:** `DELETE /me`
- **Description:** Delete user account (both Auth and Firestore data)
- **Authentication:** Required
- **Response:**
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

### 9. User Verified
- **Endpoint:** `GET /verified/:firstName/:email`
- **Description:** Endpoint called after email verification to send welcome email
- **Authentication:** None
- **Response:**
  ```json
  {
    "success": true,
    "message": "User verified successfully"
  }
  ```

## Notes
- All routes except User Creation and User Verified require authentication
- Authentication is handled via JWT token in the Authorization header
- Error responses follow a standard format:
  ```json
  {
    "success": false,
    "message": "Error description"
  }
  ```