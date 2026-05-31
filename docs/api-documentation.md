# API Documentation

This document describes the API endpoints exposed by the Laravel backend server.

---

## Headers & Authentication
Except for the initial SSO redirect and helper endpoints, all requests require session authentication. 
- **Session Auth**: Managed via HTTP cookies (`laravel_session` and `XSRF-TOKEN`). 
- **CSRF Protection**: Standard Laravel web middleware is active. All state-modifying requests (`POST`, `PUT`, `PATCH`, `DELETE`) must supply the `X-XSRF-TOKEN` header. Axios is pre-configured with `withCredentials = true` to send these headers automatically.
- **Acting As User**: There is no custom headers-based acting token (e.g. `X-Acting-As-User`) required unless running testing mocks.

---

## Public Endpoints (No Auth Required)

| Method | Path | Description | Key Request/Response Fields |
| :--- | :--- | :--- | :--- |
| **GET** | `/auth/redirect` | Redirects user to Microsoft Azure AD SSO portal. | Redirect response. |
| **GET** | `/auth/callback` | Exchanges authorization code for MS Graph tokens. | Handles callback code query params; redirects back to React client on completion. |
| **GET** | `/api/test-cookie` | Generates a mock `pep_cook` cookie for local development. | Response: `OK` string, Cookie: `pep_cook=HRUser=NA&cmpid=4&empcode=123`. |

---

## Authenticated Endpoints

### 1. User & Sessions
| Method | Path | Description | Key Request/Response Fields |
| :--- | :--- | :--- | :--- |
| **GET** | `/auth/user` | Fetches session profile, including user roles, page accesses, and access requests. | Response: User JSON object. |
| **POST** | `/auth/logout` | Terminates active session. | Response: `{"message": "Logged out successfully"}`. |
| **GET** | `/auth/timetrack` | Redirects users to the legacy Timetrack application with active session cookies. | Redirect response to `http://pcs-timetrack.mypricol.in/index.asp` or similar. |

### 2. Task / Todo Manager
| Method | Path | Description | Key Request/Response Fields |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | Retrieves user's tasks. | Response: Array of task records. |
| **POST** | `/tasks` | Adds a new private task. | Request: `{"title": "string"}`. |
| **PUT** | `/tasks/{task}` | Updates/toggles task state. | Request: `{"title": "string", "is_completed": boolean}`. |
| **DELETE** | `/tasks/{task}` | Permanently deletes a task. | Route parameter: `task` (ID of task). |

### 3. Employee Directories
| Method | Path | Description | Key Request/Response Fields |
| :--- | :--- | :--- | :--- |
| **GET** | `/calendar/events` | Fetches Outlook meetings from MS Graph. | Response: Array of meeting records. |
| **GET** | `/api/birthdays` | Retrieves employee birthdays. | Response: Sections for `today`, `tomorrow`, `team_today`, and `team_tomorrow`. |
| **GET** | `/api/new-joiners` | Retrieves new joiners in the past week. | Response: Array of joiner objects. |

### 4. Admin Management Controls
| Method | Path | Description | Key Request/Response Fields |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/admin/sync` | Starts background sync of company hierarchies. | Response: `{"message": "Hierarchy Sync completed successfully"}`. |
| **GET** | `/api/admin/sync-status` | Returns progress logs for the sync. | Response: Sync progress JSON (idle/running/completed status, logs, %). |
| **GET** | `/api/admin/organization` | Returns structured nested hierarchy trees. | Response: Nested companies, plants, locations, divisions, and departments. |
| **POST** | `/api/admin/office-details` | Creates or edits a campus address profile. | Request: Office metadata. Response: Updated record. |
| **DELETE** | `/api/admin/office-details/{id}` | Deletes office metadata. | Route parameter: `id` (Office ID). |
| **GET** | `/api/weather` | Pulls current temperature from Open-Meteo. | Query params: `lat` (latitude), `lon` (longitude). |
| **POST** | `/api/admin/announcements` | Creates a global notice banner. | Request: Banner content, badges, and activation date ranges. |
| **PATCH** | `/api/admin/announcements/{announcement}/toggle` | Pauses or unpauses an active announcement. | Route parameter: `announcement` ID. |
| **DELETE** | `/api/admin/announcements/{announcement}` | Deletes an announcement. | Route parameter: `announcement` ID. |
| **POST** | `/api/track-click` | Records frontend telemetry. | Request: `{"url": "string", "text": "string"}`. |

---

## Schema Examples for Key Endpoints

### 1. User Info (`GET /auth/user`)
#### Response
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane.doe@pricol.com",
  "job_title": "Senior Engineer",
  "company_name": "Pricol Limited",
  "department": "IT Systems",
  "employee_id": "12345",
  "office_location": "Coimbatore Plant 1",
  "manager_name": "John Smith",
  "mobile_phone": "9876543210",
  "avatar": "data:image/png;base64,iVBORw0KG...",
  "role": "admin",
  "page_accesses": [
    {
      "id": 1,
      "user_id": 1,
      "page_name": "dashboard",
      "can_access": 1
    },
    {
      "id": 2,
      "user_id": 1,
      "page_name": "profile",
      "can_access": 1
    }
  ]
}
```

### 2. Task Management (`POST /tasks`)
#### Request Body
```json
{
  "title": "Compile quarterly IT systems report"
}
```
#### Response
```json
{
  "id": 42,
  "user_id": 1,
  "title": "Compile quarterly IT systems report",
  "is_completed": false,
  "created_at": "2026-05-31T06:00:00.000000Z",
  "updated_at": "2026-05-31T06:00:00.000000Z"
}
```

### 3. Sync Status (`GET /api/admin/sync-status`)
#### Response
```json
{
  "status": "running",
  "percentage": 45,
  "logs": [
    {
      "time": "06:40:02",
      "message": "Starting synchronization from master database..."
    },
    {
      "time": "06:40:05",
      "message": "Fetching batch of employee records..."
    },
    {
      "time": "06:40:12",
      "message": "Synced 15 companies."
    },
    {
      "time": "06:40:20",
      "message": "Synced 42 branches."
    }
  ],
  "last_updated": "2026-05-31 06:40:20"
}
```

### 4. Weather Details (`GET /api/weather?lat=11.0168&lon=76.9558`)
#### Response
```json
{
  "latitude": 11.0168,
  "longitude": 76.9558,
  "current_weather": {
    "temperature": 31.4,
    "windspeed": 12.5,
    "winddirection": 240,
    "weathercode": 2,
    "time": "2026-05-31T06:00:00Z"
  }
}
```
