# Tickets API Endpoints Documentation

This document describes all endpoints under `tickets` based on the current backend implementation.

## Base URL

- Local dev URL: `http://localhost:3001`

## Global API Behavior

### Success response envelope

All successful responses are wrapped as:

```json
{
  "status": 200,
  "message": "Ticket retrieved successfully",
  "data": {}
}
```

- `status`: HTTP status code
- `message`: endpoint message from `@ResponseMessage(...)`
- `data`: endpoint payload

### Error response envelope

Errors are returned as:

```json
{
  "status": 400,
  "message": ["Ticket title is required"]
}
```

- `message` can be a string or an array of strings.

### Validation behavior (global `ValidationPipe`)

- `whitelist: true`: unknown fields are stripped.
- `forbidNonWhitelisted: true`: unknown fields trigger `400`.
- `transform: true`: query/body values are transformed by decorators (for example numbers).
- `stopAtFirstError: true`: first validation error per field is returned.

### Path ID validation

For endpoints with `:id`, `ParseMongoIdPipe` validates Mongo ObjectId format.
- Invalid id returns `404` with message: `TicketModel with id '<value>' not found`.

## Ticket Status Enum

Allowed `status` values:

- `open`
- `inProgress`
- `done`
- `cancelled`

---

## `/tickets` Endpoints

### `GET /tickets`

Get paginated tickets with optional filters.

#### Query params

- `page` (optional, number, default `1`, min `1`)
- `size` (optional, number, default `10`, min `1`, max `100`)
- `status` (optional, enum: `open | inProgress | done | cancelled`)
- `projectId` (optional, string)
- `sprintId` (optional, string)
- `teamId` (optional, string)
- `search` (optional, string)

#### Success response (`200`)

```json
{
  "status": 200,
  "message": "Tickets retrieved successfully",
  "data": {
    "content": [
      {
        "id": "67f0...",
        "projectId": "67e0...",
        "sprintId": "67e1...",
        "teamId": "67e2...",
        "assignedDevId": "67e3...",
        "assignedQaId": "67e4...",
        "ticketNumber": "KPI-101",
        "ticketTitle": "Create dashboard API",
        "status": "open",
        "descriptionLink": "https://jira.example/KPI-101",
        "developmentEstimation": 8,
        "estimationTesting": 3,
        "projectName": "KPI Digest",
        "projectStatus": "active",
        "sprintName": "Sprint 1",
        "sprintStatus": "active",
        "assignedDevName": "Dev One",
        "assignedDevRole": "DEVS",
        "assignedQaName": "QA One",
        "assignedQaRole": "QA",
        "createdAt": "2026-04-13T18:22:00.000Z",
        "updatedAt": "2026-04-13T19:10:00.000Z"
      }
    ],
    "page": 1,
    "size": 10,
    "totalElements": 1,
    "totalPages": 1,
    "numberOfElements": 1,
    "firstPage": true,
    "lastPage": true
  }
}
```

#### Validation / errors

- `400` invalid query values (for example invalid `status`, invalid page size type/range)

---

### `POST /tickets`

Create one ticket or multiple tickets.

#### Request body

Accepts either:
- one object: `CreateTicketDto`
- or array of objects: `CreateTicketDto[]`

Fields:

- `projectId` (required, string)
- `sprintId` (optional, string)
- `assignedDevId` (optional, string)
- `assignedQaId` (optional, string)
- `ticketNumber` (required, string)
- `ticketTitle` (required, string)
- `descriptionLink` (required, string)
- `estimationTesting` (optional, number)
- `developmentEstimation` (optional, number)

#### Example request (single)

```json
{
  "projectId": "67e0...",
  "sprintId": "67e1...",
  "assignedDevId": "67e3...",
  "assignedQaId": "67e4...",
  "ticketNumber": "KPI-102",
  "ticketTitle": "Build sprint summary endpoint",
  "descriptionLink": "https://jira.example/KPI-102",
  "estimationTesting": 2,
  "developmentEstimation": 6
}
```

#### Example request (bulk)

```json
[
  {
    "projectId": "67e0...",
    "ticketNumber": "KPI-103",
    "ticketTitle": "Add filters",
    "descriptionLink": "https://jira.example/KPI-103"
  },
  {
    "projectId": "67e0...",
    "sprintId": "67e1...",
    "ticketNumber": "KPI-104",
    "ticketTitle": "Add sorting",
    "descriptionLink": "https://jira.example/KPI-104"
  }
]
```

#### Success response (`201`)

- Single create: `data` is one `TicketResponseDto`.
- Bulk create: `data` is `TicketResponseDto[]`.
- `status` defaults to HTTP code and message is `Ticket created successfully`.

#### Business validations

- `ticketNumber` must be unique across existing tickets.
- If `sprintId` is provided:
  - sprint must exist.
  - `projectId` must match sprint `projectId`.
- If `assignedDevId` is provided:
  - user must exist.
  - user role must be `DEVS`.
  - if sprint team exists, user must be team member.
- If `assignedQaId` is provided:
  - user must exist.
  - user role must be `QA`.
  - if sprint team exists, user must be team member.
- Initial ticket `status` is set to `open`.

#### Errors

- `400` missing/invalid required fields, sprint not found, project mismatch
- `409` duplicate `ticketNumber`
- `422` assignee not found / wrong role / not in sprint team

---

### `GET /tickets/:id`

Get ticket by id.

#### Success response (`200`)

- `data` is one `TicketResponseDto`.

#### Errors

- `404` invalid ObjectId or ticket not found

---

### `PATCH /tickets/:id`

Partial update of a ticket.

#### Request body

`PatchTicketDto` = partial of create fields + optional status:

- Optional: `projectId`, `sprintId`, `assignedDevId`, `assignedQaId`, `ticketNumber`, `ticketTitle`, `descriptionLink`, `estimationTesting`, `developmentEstimation`
- Optional `status` (enum: `open | inProgress | done | cancelled`)

#### Example request

```json
{
  "status": "inProgress",
  "assignedDevId": "67e3...",
  "developmentEstimation": 10
}
```

#### Success response (`200`)

- `data` is updated `TicketResponseDto`.

#### Business validations

- If `sprintId` or assignees are being changed:
  - sprint must exist.
  - developer role must be `DEVS` and QA role must be `QA`.
  - assignees must belong to sprint team if team exists.

#### Errors

- `400` invalid body / invalid enum / sprint not found
- `404` invalid ObjectId or ticket not found
- `422` assignee checks failed

---

### `PUT /tickets/:id`

Full replacement update.

#### Request body (`PutTicketDto`)

- `projectId` (required, string)
- `sprintId` (optional, string)
- `assignedDevId` (optional, string)
- `assignedQaId` (optional, string)
- `ticketNumber` (required, string)
- `status` (required, enum)
- `ticketTitle` (required, string)
- `descriptionLink` (required, string)
- `estimationTesting` (optional, number)
- `developmentEstimation` (optional, number)

#### Success response (`200`)

- `data` is updated `TicketResponseDto`.

#### Business validations

- ticket id must exist.
- If `sprintId` provided:
  - sprint must exist.
  - `projectId` must match sprint project.
- assignee checks identical to `POST /tickets` (existence, role, team membership).

#### Errors

- `400`, `404`, `422` depending on validation/business rule failure.

---

### `DELETE /tickets/:id`

Delete ticket by id.

#### Success response (`200`)

```json
{
  "status": 200,
  "message": "Ticket deleted successfully"
}
```

#### Errors

- `404` invalid ObjectId or ticket not found

---

### `GET /tickets/:id/available-members`

Returns available team members (devs and qas) for the ticket.

#### Success response (`200`)

```json
{
  "status": 200,
  "message": "Available members retrieved successfully",
  "data": {
    "devs": [
      { "userId": "67e3...", "name": "Dev One" }
    ],
    "qas": [
      { "userId": "67e4...", "name": "QA One" }
    ]
  }
}
```

#### Behavior

- Finds ticket by id.
- If ticket has `teamId`, loads that team.
- Else tries team by ticket `sprintId`.
- If no team found, returns empty arrays.

#### Errors

- `404` invalid ObjectId or ticket not found

---

## Common Error Examples

### Invalid status query/body

```json
{
  "status": 400,
  "message": ["Invalid status value"]
}
```

### Non-whitelisted field

```json
{
  "status": 400,
  "message": ["property unexpectedField is not exist"]
}
```

### Role mismatch

```json
{
  "status": 422,
  "message": "User John is not a Developer (Role: QA)"
}
```

### Ticket not found

```json
{
  "status": 404,
  "message": "Ticket with id '67abc...' not found"
}
```
