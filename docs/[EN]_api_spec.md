# API Documentation: Perfume E-Commerce System

## 1. Authentication Module
Handles secure user access and session management. Integration with Amazon Cognito is recommended for scalability and security.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user account | No |
| POST | `/api/auth/login` | Login, returns Access/Refresh Tokens | No |
| POST | `/api/auth/refresh` | Refresh Access Token | No |
| POST | `/api/auth/logout` | Logout/Invalidate session | Yes |

## 2. Product Management Module
Core module for product discovery and filtering. Designed with pagination and filtering best practices.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/products` | Get list of products. Query params: `category`, `scent`, `min_price`, `limit`, `offset` | No |
| GET | `/api/products/{id}` | Get detailed information of a perfume (including notes) | No |
| GET | `/api/search` | Search by name (`?q=name`) | No |
| GET | `/api/categories` | Get list of scent groups/brands | No |

## 3. Cart & Order Modules
Ensures persistent user data across devices and handles transaction flows.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/cart` | Retrieve current user's cart | Yes |
| POST | `/api/cart` | Add product to cart (Body: `variant_id`, `quantity`) | Yes |
| PUT | `/api/cart/{itemId}` | Update quantity of item in cart | Yes |
| DELETE | `/api/cart/{itemId}` | Remove item from cart | Yes |
| POST | `/api/orders` | Checkout: Convert cart to order | Yes |
| GET | `/api/orders` | Get user order history | Yes |
| GET | `/api/orders/{id}` | Get specific order details/status | Yes |

## 4. Reviews Module
User feedback system. Restricted to verified purchasers.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/products/{id}/reviews` | Submit product rating/review | Yes |
| GET | `/api/products/{id}/reviews` | Retrieve all reviews for a product | No |

---
## API Design Best Practices
*   **Response Structure:** Consistent wrapping for all endpoints:
    *   *Success:* `{ "status": "success", "data": {...} }`
    *   *Failure:* `{ "status": "error", "message": "..." }`
*   **Standard Status Codes:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error).
*   **Pagination:** Always enforce `limit` and `offset` on list endpoints to protect system resources.