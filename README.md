# SammTech Task Management API

A RESTful backend API for a Kanban-style task management system, built with NestJS, TypeScript, Prisma, and PostgreSQL.

The API provides JWT-based authentication, board and column management, task workflows, ownership-based authorization, task assignment, soft deletion, filtering, request validation, login rate limiting, and interactive Swagger documentation.

This project was developed as a backend take-home assignment for SammTech Ltd.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Authentication Flow](#authentication-flow)
- [Authorization Model](#authorization-model)
- [Task Ownership and Assignment](#task-ownership-and-assignment)
- [Soft Delete Strategy](#soft-delete-strategy)
- [Task Positioning](#task-positioning)
- [Column Ordering](#column-ordering)
- [Validation and Error Handling](#validation-and-error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup and Migrations](#database-setup-and-migrations)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Technical Decisions](#technical-decisions)
- [Challenges and Solutions](#challenges-and-solutions)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Overview

The application models the core workflow of a Kanban board:

```text
User
  └── Board
        └── Column
              └── Task
```

A user can authenticate, create boards, organize boards into columns, and create tasks within those columns.

Tasks support additional workflow information such as:

- priority;
- due date;
- position;
- creator;
- assignee;
- soft deletion.

The API follows a modular NestJS architecture. Controllers are responsible for HTTP request handling, services contain business logic, DTOs validate incoming data, guards protect routes, and Prisma handles persistence through PostgreSQL.

---

## Tech Stack

| Technology        | Purpose                            |
| ----------------- | ---------------------------------- |
| NestJS            | Backend application framework      |
| TypeScript        | Type-safe application development  |
| PostgreSQL        | Relational database                |
| Prisma            | Database ORM and schema management |
| JWT               | Stateless authentication           |
| bcrypt            | Password hashing                   |
| class-validator   | DTO validation                     |
| class-transformer | Request data transformation        |
| NestJS Throttler  | Login rate limiting                |
| Swagger / OpenAPI | Interactive API documentation      |

---

## Architecture

The application follows NestJS's modular architecture and separates HTTP handling, business logic, validation, authentication, and persistence.

```text
HTTP Request
      │
      ▼
Controller
      │
      ▼
Guard / Authentication
      │
      ▼
DTO Validation
      │
      ▼
Service
      │
      ▼
Prisma Client
      │
      ▼
PostgreSQL
```

---

## Project Structure

The project is organized by feature rather than placing all application logic in a single module.

```text
sammtech_task/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   │
│   ├── boards/
│   │   ├── dto/
│   │   ├── boards.controller.ts
│   │   ├── boards.module.ts
│   │   └── boards.service.ts
│   │
│   ├── columns/
│   │   ├── dto/
│   │   ├── columns.controller.ts
│   │   ├── columns.module.ts
│   │   └── columns.service.ts
│   │
│   ├── tasks/
│   │   ├── dto/
│   │   ├── tasks.controller.ts
│   │   ├── tasks.module.ts
│   │   └── tasks.service.ts
│   │
│   ├── users/
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   │
│   ├── guards/
│   │   └── auth/
│   │       └── auth.guard.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── .env.example
├── package.json
├── nest-cli.json
└── README.md
```

Each feature owns its controller, service, DTOs, and module configuration. This keeps responsibilities separated and makes the codebase easier to extend.

---

## Database Design

The main resource hierarchy is:

```text
User 1 ──────── N Board
Board 1 ─────── N Column
Column 1 ────── N Task
```

Tasks also maintain relationships with users for creation and assignment.

```text
User 1 ──────── N Created Tasks
User 1 ──────── N Assigned Tasks
```

### User

Represents an authenticated application user.

Important fields include:

```text
id
name
email
password
createdAt
updatedAt
```

Passwords are stored as hashes and are never returned as part of authentication responses.

### Board

Represents a Kanban board.

Important fields include:

```text
id
title
ownerId
deletedAt
createdAt
updatedAt
```

The `ownerId` field determines who owns and can modify the board.

### Column

Represents a workflow stage within a board.

Examples include:

```text
Backlog
Todo
In Progress
Review
Done
```

Important fields include:

```text
id
title
order
boardId
createdAt
updatedAt
```

The `order` field determines the visual order of columns within a board.

### Task

Represents a card within a column.

Important fields include:

```text
id
title
description
priority
dueDate
createdById
assignedId
columnId
position
deletedAt
createdAt
updatedAt
```

---

## Authentication Flow

Authentication uses JWT access tokens.

### Registration

```text
Client
   │
   │ POST /auth/register
   ▼
Auth Controller
   │
   ▼
Validate DTO
   │
   ▼
Check existing email
   │
   ▼
Hash password
   │
   ▼
Create user
```

### Login

```text
Client
   │
   │ POST /auth/login
   ▼
Validate credentials
   │
   ▼
Compare password hash
   │
   ▼
Generate JWT
   │
   ▼
Return access token
```

The client includes the token in protected requests:

```text
Authorization: Bearer <access_token>
```

For a protected request:

```text
Request
   │
   ▼
Auth Guard
   │
   ├── Extract JWT
   ├── Verify signature
   ├── Verify token validity
   └── Decode user information
   │
   ▼
request.user
   │
   ▼
Controller / Service
```

The user ID is therefore obtained from the authenticated request rather than accepted from the client.

This prevents a client from impersonating another user by manually submitting a different creator ID.

---

## Authorization Model

Authentication answers:

> Who is making this request?

Authorization answers:

> Is this user allowed to perform this operation?

The main authorization boundary is board ownership.

The ownership chain is:

```text
Task
  └── Column
        └── Board
              └── ownerId
```

When a protected operation modifies a board resource, the application can determine ownership through the resource hierarchy.

For example, when modifying a task:

```text
Authenticated User
        │
        ▼
       Task
        │
        ▼
      Column
        │
        ▼
       Board
        │
        ▼
Compare board.ownerId with authenticated user ID
```

This prevents a user from modifying another user's board simply by knowing a resource ID.

---

## Soft Delete Strategy

Boards and tasks use soft deletion.

Instead of permanently removing a record:

```text
DELETE FROM Task
```

the application records a deletion timestamp:

```text
deletedAt = current timestamp
```

Active-resource queries exclude records where:

```text
deletedAt IS NOT NULL
```

---

## Task Positioning and Cross-Column Movement

Each task stores two values that determine its location on the Kanban board:

```text
columnId  → the column containing the task
position  → the zero-based position inside that column
```

The intended ordering is:

```text
0, 1, 2, 3, ...
```

Moving a task is not handled as a simple update because changing one task's position can affect multiple tasks around it.

### Moving Within the Same Column

When a task moves upward, every task between the new and old positions is shifted one position down.

```text
Before: [A, B, C, D]

A = 0
B = 1
C = 2
D = 3

Move D from position 3 → 1

After: [A, D, B, C]
```

When a task moves downward, every task in the affected range is shifted one position up.

```text
Before: [A, B, C, D]

Move A from position 0 → 2

After: [B, C, A, D]
```

The implementation uses range-based updates rather than changing only the task occupying the destination position. Updating only one conflicting task can create duplicate positions when a task moves across multiple indexes.

### Moving Between Columns

A cross-column move affects both the source and destination columns.

For example:

```text
Todo:        [A, B, C]
In Progress: [D, E]
```

Moving `B` to position `1` of `In Progress` should produce:

```text
Todo:        [A, C]
In Progress: [D, B, E]
```

The operation is performed in three steps:

1. Close the gap in the source column by decrementing the position of every task after the moved task.
2. Create space in the destination column by incrementing the position of every task at or after the requested destination.
3. Update the moved task with its new `columnId` and `position`.

The requested destination is clamped to the valid range of the target column. For example, moving a task to an empty column results in position `0`, because that is the only valid zero-based position in an empty list.

This keeps task ordering deterministic and avoids duplicate positions or gaps.

---

## Transactional Task Repositioning and Cross-Column Movement

Task movement was intentionally implemented as a business operation rather than a simple update of `columnId` and `position`.

For a same-column move, the API shifts every task in the affected range before assigning the moved task its new position.

For a cross-column move, the API must modify two separate ordered lists:

```text
1. Close the gap in the source column
2. Create space in the destination column
3. Move the task to its new column and position
```

These steps are executed inside a Prisma interactive transaction:

```ts
this.prisma.$transaction(async (tx) => {
  // shift source tasks
  // shift destination tasks
  // update moved task
});
```

I chose a transaction because the three database operations represent one logical action. Without a transaction, an error after updating only one column could leave the board in a partially updated state with duplicate positions or gaps.

With the transaction:

```text
All operations succeed
        ↓
      COMMIT

Any operation fails
        ↓
     ROLLBACK
```

This ensures the move is atomic: either the complete task movement is applied or none of it is.

I initially considered resolving only the task occupying the requested position, but that approach does not correctly handle movement across multiple positions. Range-based shifting keeps the ordering consistent for both same-column and cross-column moves.

---

## Validation and Error Handling

Incoming request data is validated through DTOs using `class-validator`.

The application uses a global validation pipeline to reject invalid input before it reaches business logic.

Validation covers concerns such as:

- required fields;
- valid email addresses;
- string lengths;
- valid enum values;
- numeric IDs;
- optional fields;
- date formats.

This prevents database entities from being used directly as request bodies and reduces the possibility of clients modifying fields they should not control.

The API uses meaningful HTTP exceptions and status codes where applicable.

Examples include:

| Status                  | Meaning                                         |
| ----------------------- | ----------------------------------------------- |
| `200 OK`                | Successful request                              |
| `201 Created`           | Resource created                                |
| `400 Bad Request`       | Invalid request data                            |
| `401 Unauthorized`      | Missing or invalid authentication               |
| `403 Forbidden`         | Authenticated but not permitted                 |
| `404 Not Found`         | Resource does not exist                         |
| `409 Conflict`          | Conflicting resource, such as an existing email |
| `429 Too Many Requests` | Login rate limit exceeded                       |

---

## Rate Limiting

The login endpoint is rate-limited to reduce repeated authentication attempts.

```text
Maximum requests: 5
Window: 60 seconds
```

When the limit is exceeded, the API responds with:

```text
429 Too Many Requests
```

Rate limiting is applied to authentication rather than unnecessarily restricting normal board and task operations.

For a larger distributed deployment, the in-memory throttling store could be replaced with a shared store such as Redis.

---

## API Endpoints

https://sammtech-backend.onrender.com/api

> The interactive Swagger documentation should be treated as the source of truth for exact request schemas and currently available endpoints.

---

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/NOCKTOWL/sammtech_task.git
cd sammtech_task
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sammtech_task"
JWT_SECRET="replace-with-a-secure-random-secret"
JWT_REFRESH_SECRET="replace-with-a-secure-random-refresh-secret"
```

Do not commit the real `.env` file.

---

## Environment Variables

| Variable             | Required | Description                       | Example                                                       |
| -------------------- | -------- | --------------------------------- | ------------------------------------------------------------- |
| `DATABASE_URL`       | Yes      | PostgreSQL connection string      | `postgresql://postgres:password@localhost:5432/sammtech_task` |
| `JWT_SECRET`         | Yes      | Secret used to sign JWTs          | `your-secure-secret`                                          |
| `JWT_REFRESH_SECRET` | Yes      | Secret used to sign refresh token | `your-secure-secret`                                          |

---

## Database Setup and Migrations

After configuring `DATABASE_URL`, generate the Prisma client:

```bash
npx prisma generate
```

Apply existing migrations:

```bash
npx prisma migrate deploy
```

For local development, when creating a new migration:

```bash
npx prisma migrate dev --name <migration-name>
```

Example:

```bash
npx prisma migrate dev --name init
```

To inspect database records visually:

```bash
npx prisma studio
```

---

## Running the Application

### Development

```bash
npm run start:dev
```

### Standard mode

```bash
npm run start
```

### Production build

```bash
npm run build
```

Then:

```bash
npm run start:prod
```

### Linting

```bash
npm run lint
```

### Tests

```bash
npm test
```

---

### Local Swagger UI

```text
http://localhost:3000/api
```

Authentication can be tested by:

1. registering a user;
2. logging in;
3. copying the returned access token;
4. clicking **Authorize** in Swagger;
5. entering the bearer token;
6. calling protected endpoints.

### Live Documentation

```text
https://sammtech-backend.onrender.com/api
```

---

## Technical Decisions

### NestJS over Express

I have been eyeing NestJS for quite a long time but never used it extensively except fiddling with it a few times. So I thought this is a great chance for me to do a project using it and check out what's all the good things about.

Although the whole project coule be done using Express, but the nature of NestJS forcing devs to stay inside architectural boundaries and making errors more explicit, reduces the likelihood of mixing routing, authentication, and database logic.

### Separate Creator and Assignee Relationships

Task creation and task responsibility are intentionally modeled separately.

```text
createdById → who created the task
assignedId  → who is responsible for the task
```

This avoids ambiguity and supports tasks created by one user for another. Although it was a bit for me too.

### Task Repositioning and Column Ordering

Tasks and columns are treated as ordered lists, so moving one item can affect the positions of others. For tasks, I used range-based shifting to keep positions consistent both within the same column and when moving across columns.

Cross-column moves require multiple database updates: the task to move would create an empty space in the source column (no concern if it's the last in the column), closing the gap in the source column, creating space in the target column, and finally moving the task. I wrapped these operations in a Prisma transaction to preserve ACID properties, especially atomicity. Either the entire move succeeds and is committed, or any failure at any stage of the process rolls back all changes, preventing partially updated or inconsistent task positions.

Column ordering follows a similar approach by resolving occupied order values when columns are rearranged.

### Soft Delete for Boards and Tasks

Boards and tasks use `deletedAt` instead of immediate physical deletion.

This preserves records and provides a foundation for future recovery and audit functionality. This was a requirement for the task.

### Route-Specific Login Throttling

Rate limiting to max 5 login attempts per minute is to stop api call abuse.

Also, this was a requirement for the task.

---

## Challenges and Solutions

### Learning NestJS While Building the Assignment

NestJS was new to me at the beginning of this project.

One of the initial challenges was understanding the relationship between:

```text
Module
Controller
Service
Provider
Guard
```

The solution was to keep each responsibility separate and build the project feature by feature. This resulted in a clearer modular structure rather than placing all routes and business logic in a single file.

### Migrating the Persistence Layer to Prisma

The project initially explored TypeORM before being moved to Prisma to align more closely with the preferred technology stack.

This required reconsidering database access from repository injection to Prisma client queries.

The final approach keeps persistence consistent through Prisma rather than mixing multiple ORM patterns.

### Modeling Task Creator and Assignee

A task can be created by one user and assigned to another.

Using a single generic `userId` would make the meaning unclear, so creator and assignee were treated as separate relationships.

This makes the data model easier to understand and extend.

### Prisma Client and Module Configuration

While integrating Prisma, generated-client location and module-format configuration required careful handling to ensure that the generated client and NestJS build output used compatible module settings.

The final configuration keeps database access centralized through the Prisma service.

### Maintaining Task Order Across Columns

Task repositioning became more complex once movement between columns was considered. I didn't notice it first but when I did I realized the challenge. Updating only the moved task could leave a gap in the source column, while inserting it directly into the destination column could create duplicate positions. I was already aware of the ACID properties but never coded it using transaction like this.

I solved this by treating each column as an ordered list. A cross-column move closes the source gap, opens a destination gap, and then updates the moved task. It's a simple three step process if seen like this and the complete operation runs inside a database transaction so that no inconsistencies remain.

---

## Future Improvements

With more time, the next improvements would be:

- complete and extensively test cross-column task movement and reordering;
- add refresh-token rotation;
- add task activity logs;
- record who created, moved, updated, assigned, and deleted tasks;
- add file attachments using cloud object storage;
- add pagination for task and user lists;

I think the first priority would be the bonus features I missed due to my personal time limitations. I think the time given was enough for this but I, personally had like 3 days to do the whole thing while being new to this.

---

## Repository

GitHub:

```text
https://github.com/NOCKTOWL/sammtech_task
```

---

## Deployment

### Live API

```text
https://sammtech-backend.onrender.com
```

### Swagger Documentation

```text
https://sammtech-backend.onrender.com/api
```

---

## Author

**Mehedi Hasan Nabil**

GitHub: `NOCKTOWL`

---

## License

This project was developed as a take-home technical assignment for Sammtech.
