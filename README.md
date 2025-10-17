# ProjectWIT API Documentation

## 📋 API Endpoints

### Base URL
```
http://localhost:3000/api
```

---

## 🔐 Authentication Endpoints

### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user"
  }
}
```

### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👥 User Management Endpoints

### GET `/api/users`
Get all users (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user"
  }
]
```

### GET `/api/users/me`
Get current user's profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "user"
}
```

---

## 🏭 Factory Management Endpoints

### GET `/api/factories`
Get all factories with filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `governorate` (optional): Filter by governorate
- `industryType` (optional): Filter by industry type
- `establishedYear` (optional): Filter by establishment year
- `status` (optional): Filter by status (active/paused)
- `q` (optional): Search by factory name

**Example:**
```
GET /api/factories?page=1&limit=10&governorate=Cairo&industryType=Textile&q=textile
```

**Response:**
```json
{
  "total": 50,
  "data": [
    {
      "id": 1,
      "name": "Textile Factory",
      "logoUrl": "https://example.com/logo.jpg",
      "governorate": "Cairo",
      "industryType": "Textile",
      "establishedYear": 2020,
      "status": "active",
      "phone": "123-456-7890",
      "location": {
        "lat": 30.0444,
        "lng": 31.2357
      },
      "description": "Leading textile manufacturer"
    }
  ]
}
```

### GET `/api/factories/:id`
Get factory details by ID (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "Textile Factory",
  "logoUrl": "https://example.com/logo.jpg",
  "governorate": "Cairo",
  "industryType": "Textile",
  "establishedYear": 2020,
  "status": "active",
  "phone": "123-456-7890",
  "location": {
    "lat": 30.0444,
    "lng": 31.2357
  },
  "description": "Leading textile manufacturer"
}
```

**Note:** If user doesn't have an active subscription, phone and location data will be masked.

---

## 📅 Subscription Management Endpoints

### POST `/api/subscriptions/create`
Create a new subscription (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "planId": 1
}
```

**Response:**
```json
{
  "msg": "Subscription created successfully",
  "subscription": {
    "id": 1,
    "userId": 1,
    "planId": 1,
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "currentPeriodStart": "2024-01-01T00:00:00.000Z",
    "currentPeriodEnd": "2024-02-01T00:00:00.000Z",
    "trialEnd": null
  }
}
```

### POST `/api/subscriptions/cancel`
Cancel current subscription (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "msg": "Subscription cancelled successfully"
}
```

### GET `/api/subscriptions/my-subscription`
Get current user's subscription (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "subscription": {
    "id": 1,
    "userId": 1,
    "planId": 1,
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "currentPeriodStart": "2024-01-01T00:00:00.000Z",
    "currentPeriodEnd": "2024-02-01T00:00:00.000Z",
    "trialEnd": null,
    "plan": {
      "id": 1,
      "name": "Basic Plan",
      "price_cents": 1000,
      "currency": "USD",
      "interval": "month",
      "features": ["Feature 1", "Feature 2"],
      "trial_days": 7
    }
  }
}
```

---

## 💳 Payment Endpoints

### POST `/api/payments/create-payment`
Create a new payment record.

**Request Body:**
```json
{
  "planType": "monthly",
  "amount": 100.00,
  "description": "Monthly subscription payment"
}
```

**Response:**
```json
{
  "message": "Payment created successfully",
  "paymentId": "payment_1704067200000",
  "data": {
    "planType": "monthly",
    "amount": 100.00,
    "description": "Monthly subscription payment",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🏥 Health Check

### GET `/health`
Check server health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔒 Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Format
- **Type:** JWT (JSON Web Token)
- **Expiration:** 7 days
- **Algorithm:** HS256

### Getting a Token
1. Register a new user with `/api/auth/register`
2. Login with `/api/auth/login` to get a token
3. Use the token in subsequent requests

