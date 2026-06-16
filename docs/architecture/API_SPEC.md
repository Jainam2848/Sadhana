# API Specification — Sadhana

This document details the API endpoints, data envelopes, rate limiting, and pagination standards for the **Sadhana** mobile app, using Supabase-generated PostgREST structures.

---

## 1. Global Standards

### 1.1 Error Response Envelope
All error payloads returned by the server follow a standardized JSON envelope to prevent exposing database internals while allowing clear diagnostic display:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The provided fields do not meet complexity requirements.",
    "details": [
      {
        "field": "password",
        "issue": "Password must contain at least 8 characters."
      }
    ],
    "request_id": "req_a2b3c4d5e6f7"
  }
}
```

#### Error Codes:
*   `UNAUTHORIZED`: Auth token invalid or expired.
*   `FORBIDDEN`: RLS policy denied the operation.
*   `NOT_FOUND`: Resource does not exist.
*   `RATE_LIMIT_EXCEEDED`: User exceeded access thresholds.
*   `BAD_REQUEST`: Malformed request payloads.
*   `CONFLICT`: Data state collision (e.g. daily plan duplicated).
*   `INTERNAL_SERVER_ERROR`: Server side exception.

---

### 1.2 Pagination Protocol
List endpoints use cursor-based limits to prevent scaling latency on large datasets (e.g. library browse queries).
*   **Parameters:**
    *   `limit`: Integer count of items to retrieve (default: `20`, max: `100`).
    *   `cursor`: Base64 encoded identifier of the last seen item.
*   **Headers (Request):**
    *   `Prefer: count=exact` (returns total matching records without fetching all).
*   **Headers (Response):**
    *   `Content-Range`: E.g. `0-19/245` (indicates offset range and total count).

---

### 1.3 Rate Limiting Strategy
The Kong Gateway enforces a token-bucket rate limiting strategy:
*   **Limits:**
    *   *Anonymous Users:* 60 requests per minute.
    *   *Authenticated (Free/Premium) Users:* 300 requests per minute.
    *   *Auth Endpoints (Login/Signup):* 10 requests per minute per IP.
*   **Response Headers:**
    *   `X-RateLimit-Limit`: Maximum requests per window.
    *   `X-RateLimit-Remaining`: Count of requests remaining.
    *   `X-RateLimit-Reset`: Unix timestamp when the window resets.
    *   HTTP status `429 Too Many Requests` is returned if the bucket empties.

---

## 2. Authentication Router (`GoTrue`)

Built-in Supabase auth engine endpoints.

### 2.1 Sign Up
*   **Method:** `POST`
*   **Path:** `/auth/v1/signup`
*   **Auth Required:** No
*   **Request Body:**
    ```json
    {
      "email": "sarah@example.com",
      "password": "SuperSecurePassword123",
      "options": {
        "data": {
          "username": "Sarah E."
        }
      }
    }
    ```
*   **Response:** `200 OK`
    ```json
    {
      "access_token": "jwt_token_string",
      "refresh_token": "refresh_token_string",
      "user": {
        "id": "e5b8716b-12a4-4df1-b4fa-873fcd0c5fa6",
        "email": "sarah@example.com",
        "user_metadata": {
          "username": "Sarah E."
        }
      }
    }
    ```

### 2.2 Sign In with Password
*   **Method:** `POST`
*   **Path:** `/auth/v1/token?grant_type=password`
*   **Auth Required:** No
*   **Request Body:**
    ```json
    {
      "email": "sarah@example.com",
      "password": "SuperSecurePassword123"
    }
    ```
*   **Response:** `200 OK` (returns token payload same as signup).

### 2.3 Refresh Token
*   **Method:** `POST`
*   **Path:** `/auth/v1/token?grant_type=refresh_token`
*   **Auth Required:** No
*   **Request Body:**
    ```json
    {
      "refresh_token": "refresh_token_string"
    }
    ```
*   **Response:** `200 OK` (returns updated `access_token` and a single-use replacement `refresh_token`).

---

## 3. Core Resource Endpoints (`REST`)

### 3.1 Fetch Profile
*   **Method:** `GET`
*   **Path:** `/rest/v1/profiles`
*   **Auth Required:** Yes
*   **Request Headers:**
    *   `Authorization: Bearer <access_token>`
*   **Response:** `200 OK`
    ```json
    [
      {
        "id": "e5b8716b-12a4-4df1-b4fa-873fcd0c5fa6",
        "username": "Sarah E.",
        "avatar_url": "https://cdn.sadhana.app/avatars/user1.jpg",
        "premium": true,
        "monthly_ad_count": 12,
        "karma_coins": 150,
        "created_at": "2026-06-16T12:00:00Z"
      }
    ]
    ```

### 3.2 Submit Onboarding Responses
*   **Method:** `POST`
*   **Path:** `/rest/v1/onboarding_responses`
*   **Auth Required:** Yes
*   **Request Body:**
    ```json
    {
      "goals": ["stress", "mobility"],
      "tightness": ["neck", "hips"],
      "experience_level": "beginner",
      "habit_anchor": "After morning coffee"
    }
    ```
*   **Response:** `201 Created`
    ```json
    {
      "id": "8c7d6e5f-4b3a-2a1e-0d9c-8b7a6f5e4d3c",
      "user_id": "e5b8716b-12a4-4df1-b4fa-873fcd0c5fa6",
      "goals": ["stress", "mobility"],
      "tightness": ["neck", "hips"],
      "experience_level": "beginner",
      "habit_anchor": "After morning coffee"
    }
    ```

### 3.3 List Sadhana Routines (Catalog)
*   **Method:** `GET`
*   **Path:** `/rest/v1/sadhana_routines`
*   **Query Parameters:**
    *   `category=eq.asana` (filter by type)
    *   `is_premium=eq.false` (filter free content)
*   **Auth Required:** Yes (or Guest session key)
*   **Response:** `200 OK`
    ```json
    [
      {
        "id": "a9a8b7c6-d5e4-f3g2-h1i0-j9k8l7m6n5o4",
        "title": "Restorative Spine Stretching",
        "description": "Gentle floor stretches focusing on lower back alignment.",
        "duration_minutes": 15,
        "category": "asana",
        "is_premium": false,
        "thumbnail_url": "https://cdn.sadhana.app/thumbnails/spinal.jpg",
        "media_url": "https://cdn.sadhana.app/media/spinal_asana.mp4",
        "sanskrit_terms": {
          "Balasana": "Child's Pose",
          "Marjaryasana": "Cat Pose"
        }
      }
    ]
    ```

### 3.4 Get Today's Sadhana Plan
*   **Method:** `GET`
*   **Path:** `/rest/v1/sadhana_plans`
*   **Query Parameters:**
    *   `day_of_week=eq.2` (filtered to current day index, e.g., Tuesday)
*   **Auth Required:** Yes (or Guest session key)
*   **Response:** `200 OK`
    *   *If Premium:* Returns custom query matched row.
    *   *If Free:* RLS defaults to the row containing `user_id = NULL` (the global static fallback plan).
    ```json
    [
      {
        "id": "c1c2c3c4-d5d6-e7e8-f9f0-g1g2g3g4g5g6",
        "user_id": "e5b8716b-12a4-4df1-b4fa-873fcd0c5fa6",
        "asana_routine_id": "a9a8b7c6-d5e4-f3g2-h1i0-j9k8l7m6n5o4",
        "pranayama_routine_id": "b8b7c6d5-e4f3-g2h1-i0j9-k8l7m6n5o4p3",
        "dhyana_routine_id": "d7d6c5b4-a3a2-1a0a-9b8b-7c6c5c4c3c2c",
        "day_of_week": 2
      }
    ]
    ```

### 3.5 Log Completed Session
*   **Method:** `POST`
*   **Path:** `/rest/v1/session_logs`
*   **Auth Required:** Yes
*   **Request Body:**
    ```json
    {
      "routine_id": "a9a8b7c6-d5e4-f3g2-h1i0-j9k8l7m6n5o4",
      "duration_practiced": 15
    }
    ```
*   **Response:** `201 Created`
    ```json
    {
      "id": "e1f2g3h4-i5j6-k7l8-m9n0-o1p2q3r4s5t6",
      "user_id": "e5b8716b-12a4-4df1-b4fa-873fcd0c5fa6",
      "routine_id": "a9a8b7c6-d5e4-f3g2-h1i0-j9k8l7m6n5o4",
      "completed_at": "2026-06-16T12:30:00Z",
      "duration_practiced": 15
    }
    ```
    *(Note: Database triggers automatically increment the streak count in `user_streaks` upon this insertion).*

---

## 4. Custom Procedures (RPC Calls)

Remote Procedure Calls executed inside the database to protect credentials and coins transactions.

### 4.1 Increment Ad Views
*   **Method:** `POST`
*   **Path:** `/rest/v1/rpc/increment_ad_views`
*   **Auth Required:** Yes
*   **Request Body:** `{}` (empty, uses authenticated `auth.uid()`)
*   **Process Flow:**
    1.  Verifies calling user exists.
    2.  Increments `profiles.monthly_ad_count` by 1.
    3.  Checks if milestone limit hit (10, 30, or 50 views).
    4.  If milestone hit, creates a record in `rewards_milestones` and appends corresponding rewards (Karma Coins or single-use unlocks).
*   **Response:** `200 OK`
    ```json
    {
      "success": true,
      "updated_ad_count": 13,
      "milestone_unlocked": false,
      "karma_coins_added": 0
    }
    ```

### 4.2 Redeem Karma Coins (Premium Only)
*   **Method:** `POST`
*   **Path:** `/rest/v1/rpc/redeem_karma_coins`
*   **Auth Required:** Yes
*   **Request Body:**
    ```json
    {
      "amount": 100,
      "transaction_type": "redeem_discount",
      "description": "$5 off subscription renewal"
    }
    ```
*   **Process Flow:**
    1.  Verifies user is premium and has sufficient coin balance (`karma_coins >= amount`).
    2.  Subtracts balance from user's `profiles.karma_coins`.
    3.  Inserts audit row to `karma_coin_transactions`.
*   **Response:** `200 OK`
    ```json
    {
      "success": true,
      "remaining_balance": 50
    }
    ```

### 4.3 Request Account Deletion (GDPR)
*   **Method:** `POST`
*   **Path:** `/rest/v1/rpc/delete_user_account`
*   **Auth Required:** Yes
*   **Request Body:** `{}`
*   **Process Flow:**
    1.  Confirm calling user.
    2.  Deletes user auth record from Supabase `auth.users` system table.
    3.  Foreign key cascading deletes all records in `profiles`, `session_logs`, `user_streaks`, `onboarding_responses`, `rewards_milestones`, `karma_coin_transactions`, and `sadhana_plans`.
*   **Response:** `204 No Content`
