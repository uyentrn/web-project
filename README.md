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
npm install
cp .env.example .env
docker compose up -d
npx prisma migrate dev
npx prisma db seed
npm run dev
```

The API listens on `http://localhost:3000`. Run automated tests with `npm test`, or collect coverage with `npm run test:coverage`.

`DATABASE_URL` and `JWT_SECRET` are mandatory. Never commit `.env`; use a separate secret per environment.

The project includes a Prisma seed script that inserts sample users, products, categories, variants, carts, orders, reviews, and related data for development and testing.
## Database management

After running migrations and seeding the database, you can inspect and edit the data using Prisma Studio:

```bash
npx prisma studio
```

Prisma Studio starts a web interface (by default at http://localhost:5555) where you can browse, create, update, and delete records from the PostgreSQL database during development.

## Database migrations

Create new migrations during development with:
```bash
npx prisma migrate dev --name <migration_name>
```

Apply committed migrations in production with:
```bash
npm run prisma:migrate:deploy
```

Never use `prisma migrate dev` against a production database.

## Resetting the local database

To recreate the local database from scratch:
```bash
docker compose down -v
docker compose up -d

npx prisma migrate dev
npx prisma db seed
```
The `-v` option removes the PostgreSQL data volume, resulting in a clean database.

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
- There are no committed Prisma migrations yet.
- Production database networking, TLS/CA configuration, backups, monitoring/alerting, rate limiting, CORS policy, WAF, and CI/CD secret integration require environment-specific infrastructure decisions.
- Payment processing, webhook verification, cancellation/refund workflows, and user-profile lifecycle are intentionally out of scope of the implemented services.

## API Documentation

- [English API Overview](./docs/[EN]_api_overview.md)
- [Vietnamese API Overview](./docs/[VI]_api_overview.md)
- [Prisma Schema](./prisma/schema.prisma)
