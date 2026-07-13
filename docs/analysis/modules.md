# Module Analysis

## Authentication

Supports registration, login, access-token refresh, and logout. Login returns access and refresh tokens; logout invalidates a session. JWT is required by the stated stack, while Amazon Cognito is recommended but not mandated.

## Catalog

Provides paginated product listing, product detail including scent notes, name search, and category/brand discovery. Products have variants for purchasable size/concentration combinations. Filtering is specified for category, scent, and minimum price.

## Cart

Provides a persistent, authenticated user's cart across devices. A cart item selects a product variant and quantity. The API supports retrieve, add, quantity update, and removal operations.

## Orders

Checkout converts the authenticated user's cart to an order. It must calculate the total, validate inventory at checkout, retain a purchase-price snapshot for each order item, and expose a user's order history and individual order detail/status.

## Reviews

Allows public retrieval of product reviews. Creating a review requires authentication and verified purchase of the relevant product. Rating/review fields, uniqueness policy, and moderation are unspecified.

## Supporting modules

Configuration manages database, token, and cloud settings. Middleware covers authentication, authorization, validation, request/response logging, and error handling. Tests should use Jest and Supertest. Scripts seed representative database data.
