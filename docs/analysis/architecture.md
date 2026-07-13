# Architecture Analysis

## System purpose

The repository specifies a backend for a perfume e-commerce application. It exposes a REST API for account sessions, product discovery, carts, ordering, and product reviews. The target runtime is Node.js on AWS serverless infrastructure, backed by PostgreSQL and Prisma.

## Required architecture

The required style is layered architecture. Each request should flow through API Gateway/Lambda and Express, then route, applicable middleware, controller, service, Prisma model/database, and back through centralized error handling. Controllers orchestrate only; services own every business decision and transactional workflow. Routes contain endpoint wiring only. Prisma schema and database relationship definitions belong in `src/models/`.

```text
Client -> API Gateway -> Lambda/Express app -> Route -> Middleware -> Controller
       -> Service -> Prisma -> PostgreSQL
                                      |
                                   response
```

## Repository placement

| Location | Intended responsibility |
| --- | --- |
| `src/config/` | Environment, Prisma, JWT, and AWS configuration |
| `src/controllers/` | Extract HTTP input, call services, send standardized responses |
| `src/middlewares/` | JWT authentication, authorization, validation, logging, and errors |
| `src/models/` | Prisma schema and data-model definitions only |
| `src/routes/` | Endpoint-to-controller mapping only |
| `src/services/` | Domain logic, persistence operations, stock checks, transactions |
| `src/app.js` | Express application entry point |
| `tests/` | Jest/Supertest tests |
| `scripts/` | Database seeding only |
| `serverless.yml` | AWS deployment configuration |

The specifications also mention `src/utils/`, but the user-provided required structure does not. Do not add or depend on it unless later approved.

## Cross-cutting behavior

All APIs must return the documented envelope: successful results use `{ "status": "success", "data": ... }`; failures use `{ "status": "error", "message": "..." }`. List resources require bounded `limit`/`offset` pagination. Database changes must be Prisma migrations, never manual schema edits.

## Runtime and deployment requirements

The documentation identifies AWS Lambda, API Gateway, S3, Serverless Framework, Prisma, and managed PostgreSQL (Supabase, Neon, or RDS as possible providers). It also names `DATABASE_URL`, `JWT_SECRET`, and `PORT`; credentials and keys must stay in environment configuration and out of version control. The exact AWS/database choice and Lambda Prisma connection strategy remain unspecified.

## Current repository state

No application implementation exists yet: `package.json` and `src/app.js` are empty, and the listed source subdirectories contain no files. This phase adds analysis documentation only.
