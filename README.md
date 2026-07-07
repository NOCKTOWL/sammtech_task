# Sammtech Task API

REST API for board, column, task, and user management built with NestJS, Prisma, and PostgreSQL.

## Overview

The project provides JWT-based authentication, role-aware board access, task management, and Swagger API documentation. Validation is handled through DTOs and request throttling is enabled for auth endpoints.

## Features

- JWT register/login flow
- Board ownership and role-based access control
- Task CRUD with soft delete
- Column update flow with board-scoped creation
- User listing and lookup endpoints
- Swagger documentation
- Global validation and rate limiting

## Core Endpoints

| Module  | Routes                                                                                             |
| ------- | -------------------------------------------------------------------------------------------------- |
| Auth    | `POST /auth/register`, `POST /auth/login`                                                          |
| Users   | `GET /users`, `GET /users/:id`                                                                     |
| Boards  | `GET /boards`, `GET /boards/:id`, `POST /boards`, `DELETE /boards/:id`, `POST /boards/:id/columns` |
| Columns | `GET /columns`, `PATCH /columns/:id`                                                               |
| Tasks   | `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id`             |

## Authentication

Protected routes use a Bearer token in the `Authorization` header.

```text
Authorization: Bearer <token>
```

## Tech Stack

- NestJS
- Prisma
- PostgreSQL
- Swagger
- JWT

## Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run start:dev
```

## Environment Variables

Required variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT` (optional)

## Scripts

- `npm run start:dev` - run the app in development mode
- `npm run build` - build the application
- `npm run start:prod` - run the production build
- `npm run lint` - lint the codebase
- `npm test` - run tests

## API Docs

Swagger UI is available at:

```text
/api
```
