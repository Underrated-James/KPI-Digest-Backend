# KPI Digest — Backend

> **Agile KPI tracking platform** built with **NestJS**, **MongoDB (Mongoose)**, and **TypeScript**, following a **Clean Architecture / Layered DDD** approach.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started](#getting-started)
3. [Environment Variables](#environment-variables)
4. [Project Structure](#project-structure)
5. [Architecture Overview](#architecture-overview)
6. [Layered Architecture Per Feature](#layered-architecture-per-feature)
7. [Cross-Cutting Concerns (Common Layer)](#cross-cutting-concerns-common-layer)
8. [Data Models & Schemas](#data-models--schemas)
9. [Enumerations](#enumerations)
10. [API Endpoints](#api-endpoints)
    - [Users](#users-endpoints)
    - [Projects](#projects-endpoints)
    - [Sprints](#sprints-endpoints)
    - [Tickets](#tickets-endpoints)
    - [Teams](#teams-endpoints)
11. [Request / Response Flow](#request--response-flow)
12. [Pagination](#pagination)
13. [Validation & Custom Decorators](#validation--custom-decorators)
14. [Error Handling](#error-handling)
15. [Business Rules](#business-rules)
16. [Module Dependency Graph](#module-dependency-graph)
17. [Scripts](#scripts)

---

## Tech Stack

| Layer           | Technology                                    |
| --------------- | --------------------------------------------- |
| Framework       | NestJS 11                                     |
| Language        | TypeScript 5.7                                |
| Database        | MongoDB (via Mongoose 9 / @nestjs/mongoose)   |
| Validation      | class-validator + class-transformer           |
| Config          | @nestjs/config (dotenv)                       |
| Testing         | Jest 30 + Supertest 7                         |
| Linting         | ESLint 9 + Prettier 3                         |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Make sure MongoDB is running locally (or update .env)

# 3. Start in development mode (hot-reload)
npm run start:dev

# The server starts at http://localhost:3000
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/KPI-Digest
NODE_ENV=development
PORT=3000
```

| Variable       | Description                               | Default     |
| -------------- | ----------------------------------------- | ----------- |
| `MONGODB_URI`  | MongoDB connection string                 | —           |
| `NODE_ENV`     | `development` / `production`              | —           |
| `PORT`         | HTTP listening port                       | `3000`      |

> **Note:** When `NODE_ENV !== 'production'`, Mongoose debug mode is enabled automatically (queries are logged to the console).

---

## Project Structure

```
Backend/
├── src/
│   ├── main.ts                          # Bootstrap & global pipes/filters/interceptors
│   ├── app.module.ts                    # Root module — imports all feature modules
│   ├── app.controller.ts               # Health-check / root controller
│   ├── app.service.ts                   # Root service
│   │
│   ├── core/                            # ── Core Infrastructure ──
│   │   └── database/
│   │       └── database-module.ts       # Global Mongoose connection (async config)
│   │
│   ├── common/                          # ── Cross-Cutting Concerns ──
│   │   ├── decorators/
│   │   │   ├── response-message.decorator.ts
│   │   │   ├── is-real-dates-decorator.ts
│   │   │   ├── is-after-start-decorator.ts
│   │   │   └── is-within-range-decorator.ts
│   │   ├── dtos/
│   │   │   └── pagination-query.dto.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── response.interceptor.ts
│   │   ├── interfaces/
│   │   │   ├── api-response.interface.ts
│   │   │   └── paginated-result.interface.ts
│   │   └── pipes/
│   │       └── parse-mongo-id.pipe.ts
│   │
│   ├── shared/                          # ── Shared Utilities ──
│   │   └── date-utils.ts               # ISO date validation & working-day calculator
│   │
│   └── features/                        # ── Business Feature Modules ──
│       ├── users/
│       ├── project/
│       ├── sprints/
│       ├── tickets/
│       └── teams/
│
├── test/                                # E2E tests
├── .env                                 # Environment variables
├── nest-cli.json                        # NestJS CLI configuration
├── tsconfig.json                        # TypeScript configuration
└── package.json
```

---

## Architecture Overview

The application follows a **Clean Architecture** pattern inspired by Domain-Driven Design, where each feature module is organized into **four layers**:

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                     │
│          (errors/ — domain-specific HTTP exceptions)        │
├─────────────────────────────────────────────────────────────┤
│                      Application Layer                      │
│   controllers/  →  use-cases/  →  service/ (repo impl)     │
│                      api/dto/  (request & response DTOs)    │
├─────────────────────────────────────────────────────────────┤
│                        Domain Layer                         │
│     entities/   │   enums/   │   constants/                 │
├─────────────────────────────────────────────────────────────┤
│                     Infrastructure Layer                    │
│       models/ (Mongoose)  │  repositories/ (interface)      │
│                   mappers/ (doc → entity)                   │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

| Principle                             | Implementation                                                                                       |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Dependency Inversion**              | Repository interfaces live in `infrastructure/`; implementations are injected via DI tokens           |
| **Use-Case Driven**                   | Each CRUD operation is encapsulated in its own injectable use-case class                              |
| **Entity ↔ Document Separation**      | Domain entities are plain classes; Mongoose documents are mapped via dedicated mapper functions        |
| **Standardized API Responses**        | All responses are wrapped by a global `ResponseInterceptor` into `{ status, message, data }`          |
| **Centralized Error Handling**        | A global `HttpExceptionFilter` catches all exceptions and normalizes the error envelope               |

---

## Layered Architecture Per Feature

Each feature module (`users`, `project`, `sprints`, `tickets`, `teams`) follows this internal structure:

```
features/<module>/
├── <module>.module.ts                   # NestJS module declaration
│
├── domain/                              # ── Pure Domain ──
│   ├── entities/                        #   Domain entity (plain TS class with getters/setters)
│   ├── enums/                           #   Domain enumerations
│   └── constants/                       #   DI tokens, model names, collection names, response messages
│
├── application/                         # ── Application Logic ──
│   ├── controllers/                     #   HTTP controllers (route handlers)
│   ├── use-cases/                       #   One class per operation (Create, Get, GetById, Patch, Put, Delete)
│   ├── service/ or services/            #   Repository implementation (Mongoose)
│   └── api/
│       └── dto/
│           ├── request/                 #   Incoming DTOs (validated with class-validator)
│           └── response/               #   Outgoing DTOs (static factory: fromEntity / fromPaginatedResult)
│
├── infrastructure/                      # ── Data Access ──
│   ├── models/                          #   Mongoose @Schema / SchemaFactory classes
│   ├── repositories/                    #   Repository interface (contract)
│   └── mappers/                         #   Document → Entity mapper functions
│
└── presentation/                        # ── HTTP Error Layer ──
    └── errors/                          #   Domain-specific NotFoundException subclasses
```

### DI Token Pattern

Each feature defines DI tokens in `domain/constants/`:

```typescript
export const USER_REPOSITORY = 'UserRepository';        // injection token
export const USER_MODEL      = 'User';                   // Mongoose model name
export const USER_COLLECTION = 'Users';                  // MongoDB collection name
```

Modules bind the interface to the implementation:

```typescript
{
  provide: USER_REPOSITORY,
  useClass: UserMongooseRepository,
}
```

Use-cases then inject via `@Inject(USER_REPOSITORY)`.

---

## Cross-Cutting Concerns (Common Layer)

### Global Pipeline (configured in `main.ts`)

```
Request → ValidationPipe → Controller → ResponseInterceptor → Response
                                ↓ (on error)
                         HttpExceptionFilter → Error Response
```

### 1. `ValidationPipe` (Global)

- **whitelist: true** — strips unknown properties
- **forbidNonWhitelisted: true** — rejects requests containing unknown fields
- **transform: true** — auto-transforms payloads into DTO instances
- **stopAtFirstError: true** — returns the first validation error only
- Custom `exceptionFactory` flattens nested errors into a string array

### 2. `ResponseInterceptor` (Global)

Wraps all successful responses into a standardized envelope:

```json
{
  "status": 200,
  "message": "Users retrieved successfully",
  "data": { ... }
}
```

Uses the `@ResponseMessage()` decorator to set custom messages per route. Falls back to default messages based on HTTP method (`GET` → "Data retrieved successfully", etc.).

### 3. `HttpExceptionFilter` (Global)

Catches **all** exceptions (including non-HTTP errors) and returns:

```json
{
  "status": 400,
  "message": "Validation error message"
}
```

For unknown errors it returns `500` with `"Internal server error"`.

### 4. `ParseMongoIdPipe`

Validates that a route parameter is a valid MongoDB ObjectId. Accepts an entity name for contextual error messages:

```typescript
@Param('id', new ParseMongoIdPipe('User')) id: string
// → "User with id 'abc' not found" (404)
```

### 5. Custom Validation Decorators

| Decorator             | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `@IsRealDate()`       | Validates ISO 8601 format AND real calendar dates (no Feb 30, Apr 31 etc.) |
| `@IsAfterStartDate()` | Ensures end date is at least 1 day after the referenced start date field   |
| `@IsWithinRange()`    | Validates that all day-off dates fall within the sprint date range          |
| `@ResponseMessage()`  | Sets the success message for the response interceptor                      |

### 6. `PaginationQueryDto`

Reusable base DTO for paginated `GET` endpoints:

| Field  | Type     | Default | Constraints           |
| ------ | -------- | ------- | --------------------- |
| `page` | `number` | `1`     | Optional, min 1       |
| `size` | `number` | `10`    | Optional, min 1, max 100 |

### 7. `DateUtils` (Shared)

| Method                  | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `isValidISOFormat()`    | Checks strict ISO 8601 string format                                 |
| `isValidRealDate()`     | Validates format + real calendar date (no date rollover)             |
| `calculateWorkingDays()`| Counts weekdays between two dates, excluding specified day-offs      |

---

## Data Models & Schemas

### User

| Field       | Type       | Constraints            | Notes          |
| ----------- | ---------- | ---------------------- | -------------- |
| `_id`       | `ObjectId` | auto-generated         |                |
| `name`      | `string`   | required               |                |
| `email`     | `string`   | required, unique       |                |
| `role`      | `UserRole` | required, enum         |                |
| `createdAt` | `Date`     | auto (timestamps)      |                |
| `updatedAt` | `Date`     | auto (timestamps)      |                |

**Collection:** `Users`

---

### Project

| Field        | Type             | Constraints         | Notes          |
| ------------ | ---------------- | ------------------- | -------------- |
| `_id`        | `ObjectId`       | auto-generated      |                |
| `name`       | `string`         | required, 2–50 chars|                |
| `status`     | `ProjectStatus`  | required, enum      |                |
| `finishDate` | `Date`           | required            | Must be future |
| `createdAt`  | `Date`           | auto (timestamps)   |                |
| `updatedAt`  | `Date`           | auto (timestamps)   |                |

**Collection:** `Projects`

---

### Sprint

| Field               | Type             | Constraints              | Notes                        |
| ------------------- | ---------------- | ------------------------ | ---------------------------- |
| `_id`               | `ObjectId`       | auto-generated           |                              |
| `projectId`         | `string`         | required                 | References Project           |
| `name`              | `string`         | required, 2–50 chars     | Unique (validated in use-case) |
| `status`            | `SprintStatus`   | required, enum           |                              |
| `startDate`         | `Date`           | required                 |                              |
| `endDate`           | `Date`           | required                 | Must be after startDate      |
| `workingHoursDay`   | `number`         | required                 | Max 24                       |
| `sprintDuration`    | `number`         | required                 | Calculated working days      |
| `dayOff`            | `DayOff[]`       | optional, embedded array | `{ label, date }`            |
| `officialStartDate` | `Date \| null`   | optional                 |                              |
| `officialEndDate`   | `Date \| null`   | optional                 |                              |
| `createdAt`         | `Date`           | auto (timestamps)        |                              |
| `updatedAt`         | `Date`           | auto (timestamps)        |                              |

**Collection:** `Sprints`

**Embedded Sub-document: `DayOff`**

| Field   | Type     | Description                   |
| ------- | -------- | ----------------------------- |
| `label` | `string` | Name/reason (2–50 chars)      |
| `date`  | `string` | ISO date string `YYYY-MM-DD`  |

---

### Ticket

| Field                    | Type             | Constraints              | Notes                         |
| ------------------------ | ---------------- | ------------------------ | ----------------------------- |
| `_id`                    | `ObjectId`       | auto-generated           |                               |
| `projectId`              | `string`         | required, indexed        | References Project            |
| `sprintId`               | `string`         | required, indexed        | References Sprint             |
| `teamId`                 | `string \| null` | optional, indexed        | Auto-derived from sprint team |
| `assignedUserId`         | `string \| null` | optional, indexed        | References User               |
| `ticketNumber`           | `string`         | required, unique         |                               |
| `status`                 | `TicketStatus`   | required, enum           | Default: `open`               |
| `ticketTitle`            | `string`         | required                 |                               |
| `descriptionLink`        | `string`         | required                 |                               |
| `estimationTesting`      | `number`         | required                 | Hours                         |
| `developmentEstimation`  | `number`         | required                 | Hours                         |

**Collection:** `Tickets`  
**Indexes:** `{ sprintId, assignedUserId }` compound index

---

### Team

| Field                  | Type                 | Constraints         | Notes                              |
| ---------------------- | -------------------- | ------------------- | ---------------------------------- |
| `_id`                  | `ObjectId`           | auto-generated      |                                    |
| `projectId`            | `string`             | required            | References Project                 |
| `sprintId`             | `string`             | required            | References Sprint (unique per sprint) |
| `calculatedHoursPerDay`| `number`             | required            |                                    |
| `userIds`              | `ListOfUsers[]`      | required, array     | Embedded user allocations          |
| `createdAt`            | `Date`               | auto (timestamps)   |                                    |
| `updatedAt`            | `Date`               | auto (timestamps)   |                                    |

**Collection:** `Teams`

**Embedded Sub-document: `ListOfUsers`**

| Field                  | Type          | Description                           |
| ---------------------- | ------------- | ------------------------------------- |
| `userId`               | `string`      | References User                       |
| `allocationPercentage` | `number`      | % of time allocated to the sprint     |
| `role`                 | `UserRole`    | DEVS or QA only (ADMIN is rejected)   |
| `leave`                | `LeaveDays[]` | Optional leave entries                |

**Embedded Sub-document: `LeaveDays`**

| Field       | Type          | Description                           |
| ----------- | ------------- | ------------------------------------- |
| `leaveType` | `LeaveTypes[]`| Array of leave type enums             |
| `leaveDate` | `Date`        | Must be within sprint date range      |

> **Note:** The Team repository uses MongoDB **aggregation pipelines** with `$lookup` to join Project, Sprint, and User data at query time, enriching the response with names and statuses.

---

## Enumerations

### `UserRole`
```
ADMIN | DEVS | QA
```

### `ProjectStatus`
```
active | inactive | inProgress
```

### `SprintStatus`
```
active | inactive | draft | completed
```

### `TicketStatus`
```
open | forDevelopment | forTesting | completed
```

### `LeaveTypes`
```
sick | vacation | wholeDayLeave | halfDayLeave | other
```

---

## API Endpoints

### Base URL: `http://localhost:3000`

All responses follow the standardized envelope:

```json
{
  "status": 200,
  "message": "Description of the result",
  "data": { ... }
}
```

---

### Users Endpoints

| Method   | Route           | Description                | Query Params                    |
| -------- | --------------- | -------------------------- | ------------------------------- |
| `GET`    | `/users`        | List all users (paginated) | `page`, `size`, `role?`         |
| `GET`    | `/users/:id`    | Get user by ID             | —                               |
| `POST`   | `/users`        | Create a new user          | —                               |
| `PATCH`  | `/users/:id`    | Partial update             | —                               |
| `PUT`    | `/users/:id`    | Full replacement update    | —                               |
| `DELETE` | `/users/:id`    | Delete user                | —                               |

**Create User — Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "DEVS"
}
```

**User Response:**
```json
{
  "id": "661f...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "DEVS",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### Projects Endpoints

| Method   | Route              | Description                   | Query Params                    |
| -------- | ------------------ | ----------------------------- | ------------------------------- |
| `GET`    | `/projects`        | List all projects (paginated) | `page`, `size`, `status?`       |
| `GET`    | `/projects/:id`    | Get project by ID             | —                               |
| `POST`   | `/projects`        | Create a new project          | —                               |
| `PATCH`  | `/projects/:id`    | Partial update                | —                               |
| `PUT`    | `/projects/:id`    | Full replacement update       | —                               |
| `DELETE` | `/projects/:id`    | Delete project                | —                               |

**Create Project — Request Body:**
```json
{
  "name": "KPI Dashboard",
  "status": "active",
  "finishDate": "2026-12-31T00:00:00.000Z"
}
```

---

### Sprints Endpoints

| Method   | Route             | Description                   | Query Params                             |
| -------- | ----------------- | ----------------------------- | ---------------------------------------- |
| `GET`    | `/sprints`        | List all sprints (paginated)  | `page`, `size`, `status?`, `projectId?`  |
| `GET`    | `/sprints/:id`    | Get sprint by ID              | —                                        |
| `POST`   | `/sprints`        | Create a new sprint           | —                                        |
| `PATCH`  | `/sprints/:id`    | Partial update                | —                                        |
| `PUT`    | `/sprints/:id`    | Full replacement update       | —                                        |
| `DELETE` | `/sprints/:id`    | Delete sprint                 | —                                        |

**Create Sprint — Request Body:**
```json
{
  "projectId": "661f...",
  "name": "Sprint 1",
  "status": "active",
  "startDate": "2026-04-01",
  "endDate": "2026-04-15",
  "workingHoursDay": 8,
  "sprintDuration": 10,
  "officialStartDate": "2026-04-02",
  "officialEndDate": "2026-04-14",
  "dayOff": [
    { "label": "Holiday", "date": "2026-04-09" }
  ]
}
```

---

### Tickets Endpoints

| Method   | Route              | Description                         | Query Params                                     |
| -------- | ------------------ | ----------------------------------- | ------------------------------------------------ |
| `GET`    | `/tickets`         | List all tickets (paginated)        | `page`, `size`, `ticketStatus?`                  |
| `GET`    | `/tickets/:id`     | Get ticket by ID                    | —                                                |
| `POST`   | `/tickets`         | Create ticket(s) — single or bulk   | —                                                |
| `PATCH`  | `/tickets/:id`     | Partial update                      | —                                                |
| `PUT`    | `/tickets/:id`     | Full replacement update             | —                                                |
| `DELETE` | `/tickets/:id`     | Delete ticket                       | —                                                |

**Create Ticket — Request Body (single):**
```json
{
  "projectId": "661f...",
  "sprintId": "662a...",
  "assignedUserId": "663b...",
  "ticketNumber": "KPI-101",
  "ticketTitle": "Implement login page",
  "descriptionLink": "https://jira.example.com/KPI-101",
  "estimationTesting": 4,
  "developmentEstimation": 8
}
```

**Bulk Create — Request Body (array):**
```json
[
  { "projectId": "...", "sprintId": "...", "ticketNumber": "KPI-101", ... },
  { "projectId": "...", "sprintId": "...", "ticketNumber": "KPI-102", ... }
]
```

---

### Teams Endpoints

| Method   | Route           | Description                  | Query Params                              |
| -------- | --------------- | ---------------------------- | ----------------------------------------- |
| `GET`    | `/teams`        | List all teams (paginated)   | `page`, `size`, `sprintId?`, `projectId?` |
| `GET`    | `/teams/:id`    | Get team by ID               | —                                         |
| `POST`   | `/teams`        | Create a new team            | —                                         |
| `PATCH`  | `/teams/:id`    | Partial update               | —                                         |
| `PUT`    | `/teams/:id`    | Full replacement update      | —                                         |
| `DELETE` | `/teams/:id`    | Delete team                  | —                                         |

**Create Team — Request Body:**
```json
{
  "projectId": "661f...",
  "sprintId": "662a...",
  "HoursDay": 8,
  "calculatedHoursPerDay": 6.5,
  "userIds": [
    {
      "userId": "663b...",
      "allocationPercentage": 100,
      "role": "DEVS",
      "leave": [
        {
          "leaveType": ["sick"],
          "leaveDate": "2026-04-10"
        }
      ]
    }
  ]
}
```

---

## Request / Response Flow

```
              ┌─────────────────────────────────────────────────────────────────────┐
              │                           CLIENT REQUEST                            │
              └───────────────────────────────┬─────────────────────────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────────┐
                                    │   ValidationPipe     │
                                    │  (whitelist, transform│
                                    │   forbidNonWhitelisted)│
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  ParseMongoIdPipe    │
                                    │  (route params only) │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │    Controller        │
                                    │  @Get / @Post / etc  │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │    Use Case          │
                                    │  (business logic +   │
                                    │   validation)        │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  Repository (impl)   │
                                    │  Mongoose queries     │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  MongoDB             │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  Mapper (doc→entity) │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  ResponseDTO         │
                                    │  (entity→response)   │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │ ResponseInterceptor  │
                                    │ { status, message,   │
                                    │   data }             │
                                    └──────────┬──────────┘
                                               │
                                               ▼
              ┌─────────────────────────────────────────────────────────────────────┐
              │                          CLIENT RESPONSE                            │
              └─────────────────────────────────────────────────────────────────────┘
```

### Error Path

When any exception is thrown (validation, not-found, conflict, etc.):

```
Exception → HttpExceptionFilter → { status: <code>, message: <error> }
```

---

## Pagination

All list endpoints support server-side pagination via query parameters inherited from `PaginationQueryDto`:

**Request:**
```
GET /users?page=2&size=20&role=DEVS
```

**Response shape:**
```json
{
  "status": 200,
  "message": "Users retrieved successfully",
  "data": {
    "content": [ ... ],
    "page": 2,
    "size": 20,
    "totalElements": 45,
    "totalPages": 3,
    "numberOfElements": 20,
    "firstPage": false,
    "lastPage": false
  }
}
```

| Field              | Type      | Description                                  |
| ------------------ | --------- | -------------------------------------------- |
| `content`          | `T[]`     | Paginated array of items                     |
| `page`             | `number`  | Current page (1-indexed)                     |
| `size`             | `number`  | Requested page size                          |
| `totalElements`    | `number`  | Total count of matching records              |
| `totalPages`       | `number`  | `Math.ceil(totalElements / size)`            |
| `numberOfElements` | `number`  | Actual count in this page                    |
| `firstPage`        | `boolean` | `true` if `page === 1`                       |
| `lastPage`         | `boolean` | `true` if `page >= totalPages`               |

> **Performance:** Count and data queries are executed in **parallel** via `Promise.all` for optimized performance.

---

## Validation & Custom Decorators

### DTO Validation Summary

| DTO                   | Key Validations                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `CreateUserDto`       | `name` required, `email` valid email, `role` must be ADMIN/DEVS/QA                        |
| `PatchUserDto`        | Extends `CreateUserDto` via `PartialType` — all fields optional                            |
| `CreateProjectDto`    | `name` 2–50 chars, `status` enum, `finishDate` valid Date                                  |
| `CreateSprintDto`     | `@IsRealDate` on dates, `@IsAfterStartDate` on endDate, `@IsWithinRange` on dayOff         |
| `CreateTicketDto`     | `ticketNumber` required unique, `estimationTesting` & `developmentEstimation` are numbers  |
| `CreateTeamDto`       | Nested `ListOfUsers[]` with `@ValidateNested`, leave validation with `@IsRealDate`          |

### Custom Decorator Details

**`@IsRealDate()`** — Prevents impossible calendar dates:
- ✅ `2026-04-15` → valid
- ❌ `2026-02-30` → invalid (Feb has no 30th)
- ❌ `2026-04-31` → invalid (April has 30 days)

**`@IsAfterStartDate('startDate')`** — Cross-field date comparison:
- Ensures the decorated field is at least 1 calendar day after the referenced field
- Normalizes both dates to UTC midnight before comparison

**`@IsWithinRange('startDate')`** — Array-level validation:
- Validates each `dayOff[].date` falls between `startDate` and `endDate`

---

## Error Handling

### HTTP Status Codes Used

| Code  | Exception Class                | When                                               |
| ----- | ------------------------------ | -------------------------------------------------- |
| `400` | `BadRequestException`         | Validation errors, business rule violations         |
| `404` | `NotFoundException`            | Resource not found by ID, invalid MongoDB ObjectId  |
| `409` | `ConflictException`            | Duplicate email, name, or ticket number             |
| `422` | `UnprocessableEntityException` | User not in team when assigning to ticket           |
| `500` | (uncaught)                     | Internal server error                               |

### Domain-Specific Error Classes

Each feature defines typed `NotFoundException` subclasses in `presentation/errors/`:

```typescript
// Example: UserNotFoundError
throw new UserNotFoundError(userId);
// → 404: "User with id '<id>' not found"
```

---

## Business Rules

### Users
- **Email uniqueness** — `CreateUserUseCase` checks for duplicate emails before creating
- **Role enum enforcement** — Only `ADMIN`, `DEVS`, `QA` values are accepted

### Projects
- **Name uniqueness** — Duplicate project names are rejected with `409 Conflict`
- **Future finish date** — `finishDate` must be in the future at creation time

### Sprints
- **Belongs to a Project** — `projectId` must reference an existing project
- **Name uniqueness** — Sprint names are unique across the system
- **Date ordering** — `endDate` must be at least 1 day after `startDate`
- **Day-off range** — All day-off dates must fall within `[startDate, endDate]`
- **Minimum working days** — After removing weekends and day-offs, at least 2 working days must remain
- **Real date validation** — All date fields are validated against the calendar (no Feb 30, etc.)

### Tickets
- **Ticket number uniqueness** — `ticketNumber` must be globally unique
- **Sprint validation** — `sprintId` must reference an existing sprint
- **Project-Sprint consistency** — `projectId` must match the sprint's parent project
- **User assignment** — If `assignedUserId` is provided, a team must exist for the sprint and the user must be a member
- **Bulk creation** — The POST endpoint accepts both single objects and arrays, optimizing lookups via maps for bulk operations

### Teams
- **One team per sprint** — Only one team can exist per sprint (enforced at creation)
- **Sprint & Project validation** — Both `sprintId` and `projectId` must reference existing records; the project must match the sprint's parent
- **User existence** — All `userId` entries are batch-validated against the Users collection
- **No ADMIN in teams** — Users with the `ADMIN` role cannot be added to teams
- **Leave date range** — Each user's leave dates are validated against the sprint's date range
- **Aggregation pipeline** — Team queries use MongoDB `$lookup` to join Project, Sprint, and User data for enriched responses

---

## Module Dependency Graph

```
                          AppModule
                         /    |    \      \       \
                        /     |     \      \       \
                ConfigModule  DB   Users  Project  Sprints  Tickets  Teams
                              │                      │         │       │
                              │                      │         │       │
                              └──── Global ──────────┤         │       │
                                                     │         │       │
                                              ProjectModule    │       │
                                                   ▲ ▲         │       │
                                                   │ │         │       │
                                          SprintsModule ◄──────┤       │
                                                   ▲           │       │
                                                   │           │       │
                                                   ├───────────┘       │
                                                   │                   │
                                          TeamsModule ◄────────────────┘
                                          (imports: Project, Sprints, Users)
                                                   ▲
                                                   │
                                          TicketsModule
                                          (imports: Sprints, Teams)
```

**Key dependency chains:**
- `TicketsModule` → `SprintsModule`, `TeamsModule`
- `TeamsModule` → `ProjectModule`, `SprintsModule`, `UsersModule`
- `SprintsModule` → `ProjectModule`
- `ProjectModule` & `UsersModule` — standalone (no feature imports)

---

## Scripts

| Script              | Command                  | Description                           |
| ------------------- | ------------------------ | ------------------------------------- |
| `start`             | `npm run start`          | Start production server               |
| `start:dev`         | `npm run start:dev`      | Start with hot-reload (watch mode)    |
| `start:debug`       | `npm run start:debug`    | Start with debug + hot-reload         |
| `start:prod`        | `npm run start:prod`     | Run compiled `dist/main.js`           |
| `build`             | `npm run build`          | Compile TypeScript to `dist/`         |
| `format`            | `npm run format`         | Format code with Prettier             |
| `lint`              | `npm run lint`           | Lint + auto-fix with ESLint           |
| `test`              | `npm run test`           | Run unit tests                        |
| `test:watch`        | `npm run test:watch`     | Run tests in watch mode               |
| `test:cov`          | `npm run test:cov`       | Run tests with coverage report        |
| `test:e2e`          | `npm run test:e2e`       | Run end-to-end tests                  |

---

> **Postman Collection:** A complete Postman collection is included at [`Agile-Digest.postman_collection.json`](./Agile-Digest.postman_collection.json) for testing all endpoints.
