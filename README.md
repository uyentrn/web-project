# Perfume E-Commerce Backend

Node.js/Express API for a perfume store. The code follows a layered design: routes map HTTP endpoints, middleware handles cross-cutting concerns, controllers translate HTTP requests, services own domain operations, and Prisma persists data in PostgreSQL.

## Project structure

```text
src/
  bootstrap.js       # Production composition root
  handler.js         # AWS Lambda adapter
  server.js          # Local/container HTTP entry point
  controllers/       # HTTP orchestration and response envelopes
  middlewares/       # Authentication, roles, validation, errors, logging
  models/            # Prisma schema
  routes/            # Endpoint registration
  services/          # Domain and persistence operations
tests/               # Jest unit/controller/route tests
Dockerfile           # Production image
docker-compose.yml   # Local PostgreSQL
serverless.yml       # AWS Lambda + HTTP API deployment
```

## Prerequisites

- Node.js 22+
- PostgreSQL 16+ (or a managed PostgreSQL-compatible service)
- Docker and Docker Compose for the local database/container workflow
- AWS credentials and Serverless Framework access for Lambda deployment

## Local development

```bash
npm ci
cp .env.example .env
docker compose up -d database
npm run prisma:generate
npm run dev
```

The API listens on `http://localhost:3000`. Run automated tests with `npm test`, or collect coverage with `npm run test:coverage`.

`DATABASE_URL` and `JWT_SECRET` are mandatory. Never commit `.env`; use a separate secret per environment.

## Database migrations

Use Prisma migrations in CI/CD, never `prisma migrate dev` against production:

```bash
npm run prisma:migrate:deploy
```

This repository currently has a Prisma schema but no committed migration history. Create and review the initial migration in a non-production environment before any deployment; until then, `prisma:migrate:deploy` cannot initialize a fresh production database. Prisma recommends `migrate deploy` in an automated deployment pipeline for production changes. [Prisma migration guidance](https://docs.prisma.io/docs/orm/v6/prisma-migrate/workflows/development-and-production)

## Docker deployment

Build and run the API against a managed PostgreSQL database:

```bash
docker build -t perfume-ecommerce-api .
docker run --rm -p 3000:3000 --env-file .env perfume-ecommerce-api
```

`docker-compose.yml` intentionally starts only PostgreSQL for local development. Run schema migrations separately before starting the API.

## AWS Lambda deployment

Set production secrets through your CI/CD system or AWS Secrets Manager/SSM and expose them as `DATABASE_URL` and `JWT_SECRET` during deployment. Do not put production secrets in `serverless.yml` or a local `.env` file.

```bash
npm ci
npm run prisma:generate
npm run prisma:migrate:deploy
npx serverless deploy --stage prod
```

The Serverless configuration deploys one ARM64 Node.js 22 Lambda behind API Gateway HTTP API, with a 29-second timeout and 30-day log retention. Serverless HTTP API events support a catch-all API handler and produce the endpoint URL on deployment. [Serverless HTTP API reference](https://www.serverless.com/framework/docs/providers/aws/events/http-api)

## Security and operations

- Bearer JWT authentication with issuer/audience verification
- Role middleware for administrative catalog writes
- JSON-body validation plus controller input checks
- Standardized JSON error responses, including malformed JSON and 404s
- Structured request logging that excludes request bodies, headers, tokens, and credentials
- Docker runs as the non-root `node` user
- `.env`, coverage output, dependencies, and deployment artifacts are ignored by Git

## Current limitations

- User, brand, wishlist, and payment domain services/controllers are not implemented. Their registered endpoints return `501 Not Implemented`.
- The data model has no user role field and access tokens currently do not issue role claims, so catalog write endpoints cannot be used until role provisioning is designed.
- There are no committed Prisma migrations yet.
- Production database networking, TLS/CA configuration, backups, monitoring/alerting, rate limiting, CORS policy, WAF, and CI/CD secret integration require environment-specific infrastructure decisions.
- Payment processing, webhook verification, cancellation/refund workflows, and user-profile lifecycle are intentionally out of scope of the implemented services.

## Specifications

- [English API specification](./docs/[EN]_api_spec.md)
- [Vietnamese API specification](./docs/[VI]_api_spec.md)
- [Prisma schema](./src/models/schema.prisma)
