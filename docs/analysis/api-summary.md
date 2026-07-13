# REST API Summary

All responses use the documented envelope: success `{ "status": "success", "data": ... }`; error `{ "status": "error", "message": "..." }`. Listed baseline status codes are 200, 201, 400, 401, 404, and 500. Exact request/response schemas are not provided.

| Method | Endpoint | Authentication | Purpose / stated input |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Register a user. |
| POST | `/api/auth/login` | No | Log in and return access/refresh tokens. |
| POST | `/api/auth/refresh` | No | Refresh an access token. |
| POST | `/api/auth/logout` | Yes | Log out and invalidate the session. |
| GET | `/api/products` | No | Product list; `category`, `scent`, `min_price`, `limit`, `offset`. |
| GET | `/api/products/{id}` | No | Product detail, including notes. |
| GET | `/api/search` | No | Search name using `q`. |
| GET | `/api/categories` | No | Scent groups/brands/categories. |
| GET | `/api/cart` | Yes | Current user's cart. |
| POST | `/api/cart` | Yes | Add `{ variant_id, quantity }`. |
| PUT | `/api/cart/{itemId}` | Yes | Update a cart item's quantity; body unspecified. |
| DELETE | `/api/cart/{itemId}` | Yes | Remove a cart item. |
| POST | `/api/orders` | Yes | Checkout and convert cart to an order; shipping input unspecified. |
| GET | `/api/orders` | Yes | Current user's order history. |
| GET | `/api/orders/{id}` | Yes | Current user's order detail/status. |
| POST | `/api/products/{id}/reviews` | Yes | Create a verified-purchaser review; body unspecified. |
| GET | `/api/products/{id}/reviews` | No | List product reviews. |

Every list endpoint should enforce `limit` and `offset`. The specifications explicitly call this out for product lists, and describe it as an API-wide best practice; exact defaults and maximum values are undecided.
