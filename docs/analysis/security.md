# Security Analysis

## Stated requirements

- Use JWT for authentication; middleware verifies and decodes the `Authorization` header.
- Protect logout, cart, order, and review-creation endpoints.
- Restrict review creation to verified purchasers.
- Keep `DATABASE_URL`, `JWT_SECRET`, credentials, API keys, and other sensitive configuration in environment variables; never commit `.env`.
- Amazon Cognito is recommended for scalable, secure authentication but is not a mandatory dependency.
- Middleware is the permitted location for authentication, authorization, validation, logging, and error handling.

## Required enforcement

Authentication must establish the current user identity. Services must use that identity to scope cart and order reads/writes and to evaluate purchase eligibility, preventing insecure direct object references. Error handling should preserve the standard error envelope without exposing secrets, stack traces, tokens, credentials, or raw database details. Logging must avoid credentials and sensitive personal data.

## Gaps requiring decisions

The specifications do not define JWT signing algorithm, token lifetime, refresh-token rotation/storage/revocation, password hashing and reset policy, registration verification, roles/administration, rate limiting, CORS, HTTPS policy, security headers, audit retention, encryption/privacy requirements, AWS IAM boundaries, S3 upload controls, or payment handling. These omissions are recorded in `questions.md`.
