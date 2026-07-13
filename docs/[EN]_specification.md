# Project: Perfume E-Commerce System
## Specification Documentation

This document describes the project structure and development workflow for the perfume store backend system, ensuring professionalism, maintainability, and scalability.

---

## 1. Project Structure

The project employs a Layered Architecture to ensure clear separation of concerns:

```text:
perfume-store-backend/
├── src/
│   ├── config/          # Environment configuration (DB connection, Auth settings)
│   ├── controllers/     # Controller: Handles API requests and responses
│   ├── middlewares/     # Middleware: Authentication (JWT), Validation, Error handling
│   ├── models/          # Model: Database schema definitions (using ORM)
│   ├── routes/          # Route: API endpoint definitions
│   ├── services/        # Service: Business logic implementation
│   ├── utils/           # Utils: Helper functions, constants
│   └── app.js           # Entry point: Application startup
├── tests/               # Unit tests for API modules
├── scripts/             # Database seeding scripts (sample data generation)
├── .env                 # Environment variables (DB_URL, JWT_SECRET, etc.)
├── package.json         # Dependencies management
└── README.md            # Project overview
```

---

## 2. Folder Functionality Details

### 2.1. src/config/
- Purpose: Stores core system configurations.
- Example: Database connection settings (PostgreSQL/MySQL), security configurations, or third-party service integrations (e.g., Amazon Cognito).

### 2.2. src/controllers/
- Purpose: Acts as the entry layer for client requests.
- Responsibility: Extracts data from requests (params, query, body), invokes the Service layer for business logic processing, and returns standardized HTTP responses (200 OK, 201 Created, 400 Bad Request, etc.) in JSON format.

### 2.3. src/middlewares/
- Purpose: Contains intermediary handlers that execute logic before requests reach the Controller.
- Key Functions:
  - JWT Token verification and decoding in the Authorization Header.
  - Input data validation.
  - Request/response logging.

### 2.4. src/models/
- Purpose: Defines data structures and database tables using an ORM (e.g., Prisma or SQLAlchemy).
- Responsibility: Establishes entities, data relationships (ForeignKey, One-to-Many, Many-to-Many), and data integrity constraints at the DB level.

### 2.5. src/routes/
- Purpose: Defines the API routing map.
- Responsibility: Maps endpoints (e.g., /api/products, /api/orders) to corresponding controller handlers, ensuring a structured and organized API design.

### 2.6. src/services/
- Purpose: The core center for pure business logic.
- Example: Calculating total order amounts, checking real-time stock availability before checkout, or handling scent categorization algorithms.

---

## 3. Development Workflow & Best Practices

To ensure high performance and stability, development must adhere to the following rules:

- Data Integrity: Use ON DELETE CASCADE for dependent relationships (e.g., from Orders to Order_Items) to eliminate orphaned data within the system.
- Consistency: Every API response must follow a standardized structure:
  - Success: { "status": "success", "data": {...} }
  - Failure: { "status": "error", "message": "Specific error message" }
- Database Management: Do not modify database schemas manually. All schema changes must be managed through ORM Migrations to ensure synchronization across environments.
- Environment Management: Always isolate sensitive configurations (Database Credentials, API Keys, JWT Secret) in the .env file. Never commit this file to version control (Git).

## 4. Deployment & Environment
- Cloud Infrastructure: [Service name, e.g., Vercel, AWS, Render].
- Database: [e.g., Managed PostgreSQL on Supabase/Neon/RDS].
- Environment Variables: List of variables to configure on the Cloud Dashboard:
  - DATABASE_URL: Database connection string.
  - JWT_SECRET: Security encryption key.
  - PORT: Application runtime port.