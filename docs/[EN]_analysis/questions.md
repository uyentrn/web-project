# Open Questions and Missing Requirements

## Scope and platform

1. Is the implementation JavaScript or TypeScript? The requested stack names Node.js/Express while README names TypeScript and the entry file is `app.js`.
2. Which managed PostgreSQL provider and AWS services/configuration are required? AWS Lambda/API Gateway/S3 are named, but `serverless.yml` does not exist yet.
3. Is Amazon Cognito required, optional, or excluded in favor of locally issued JWTs?
4. The source specifications include `src/utils/`; should that folder be allowed despite the required structure omitting it?

## Accounts and sessions

5. What registration/login fields, password policy, password hashing method, email verification, reset flow, and duplicate-account behavior are required?
6. What JWT algorithm, issuer/audience, access/refresh expirations, refresh rotation, storage, and logout-revocation behavior are required?
7. Are there user roles (admin, customer) and administrative endpoints outside this phase's API list?

## Catalog and database

8. What are the complete fields, identifiers, uniqueness constraints, timestamps, currency, and decimal scale for each entity?
9. Is a brand a product field, a category, or its own entity? Is product-to-category one-to-many or many-to-many?
10. What are the stock and price fields on a variant; must SKU, size, and concentration combinations be unique?
11. Should products/variants be hard-deleted, soft-deleted, or archived? This determines whether cascade deletion can coexist with retained order history.
12. What fields and lifecycle apply to carts, cart items, reviews, and refresh-token/session records?

## API and validation

13. What exact request and response schemas apply to every endpoint, including login/register, refresh/logout, checkout shipping address, cart update, reviews, and errors?
14. What formats and bounds apply to IDs, quantities, prices, `q`, filters, `limit`, and `offset`? What are pagination defaults and maximums?
15. Does `/api/categories` return categories, scent groups, brands, or a combined taxonomy? How are `category` and `scent` filters matched?
16. Which additional HTTP status codes should be used for conflicts, authorization failures, validation failures, and rate limits?

## Commerce rules

17. At what point is inventory reserved/decremented, and how are concurrent checkouts handled atomically?
18. What happens to the cart after checkout failure or success? Is an empty cart checkout allowed?
19. What order-status transitions, cancellation/refund rules, payment integration, tax, shipping, discounts, and currency rules are required?
20. Which completed/purchased order status qualifies a customer to review; may a customer submit or edit more than one review per product; is moderation required?

## Security and operations

21. Which CORS origins, rate limits, HTTPS/security headers, logging/auditing policy, data-retention/privacy controls, and AWS IAM/S3 controls are required?
22. What test coverage and test-database strategy are required for Jest/Supertest?
