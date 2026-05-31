# Database Schema

This document outlines the local database schemas and relational entities within the `intra_portal` database.

---

## Entity-Relationship (ER) Summary
- `users` is the primary hub of the portal. It has a one-to-many relationship with:
  - `tasks` (`users.id` -> `tasks.user_id`)
  - `page_accesses` (`users.id` -> `page_accesses.user_id`)
  - `access_requests` (`users.id` -> `access_requests.user_id`)
  - `login_logs` (`users.id` -> `login_logs.user_id`)
  - `link_clicks` (`users.id` -> `link_clicks.user_id`)
- `announcements` has a foreign key to `users.id` (`created_by`) tracking the administrator who published the notice.
- `access_requests` references `users.id` twice: once for the applicant (`user_id`) and once for the approver (`approved_by`).
- The synchronized organizational hierarchy tables are linked top-down:
  - `companies` -> `branches` -> `plants` -> `locations` -> `divisions` -> `departments`.
  - `organization_structures` is a mapping junction table that references the foreign keys of all six hierarchical levels simultaneously to speed up composite tree lookups.
- `office_details` is a standalone table containing geolocation mapping. Office listings link to `locations` dynamically by matched office names.

---

## Table Breakdown

### 1. `users`
*Stores employee credentials, synced Azure profile data, active SSO tokens, and system roles.*
- **Unique Constraints**: `email` (string)
- **Soft Deletes**: None

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `name` | varchar(255) | Full display name of the user. |
| `email` | varchar(255) | Corporate email (unique; ends with `@pricol.com`). |
| `email_verified_at` | timestamp | Nullable verification timestamp. |
| `password` | varchar(255) | Hashed password placeholder (standard Laravel stub). |
| `job_title` | varchar(255) | Corporate designation, synced from Microsoft Graph. |
| `company_name` | varchar(255) | Company entity title, synced from Microsoft Graph. |
| `department` | varchar(255) | User's department name, synced from Microsoft Graph. |
| `employee_id` | varchar(255) | Corporate employee code (synced from employeeId/SamAccount). |
| `office_location` | varchar(255) | Synced building office location from Microsoft Graph. |
| `manager_name` | varchar(255) | Name of the user's manager, synced from Microsoft Graph. |
| `mobile_phone` | varchar(255) | Synced phone number from Microsoft Graph. |
| `avatar` | longtext | Base64-encoded profile photo data stream. |
| `role` | varchar(255) | Access control role (`user`, `hr`, `admin`, `superadmin`). |
| `azure_token` | text | Current active Azure OAuth Access Token. |
| `azure_refresh_token`| text | Azure OAuth Refresh Token (nullable). |
| `azure_token_expires_at` | timestamp | Expiry timestamp of the Azure access token. |
| `remember_token` | varchar(100) | Laravel authentication persistence token. |
| `created_at` / `updated_at` | timestamp | Audit timestamps. |

---

### 2. `tasks`
*Stores personal user checklist items/todos.*
- **Foreign Keys**: `user_id` -> `users.id` (cascade on delete)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `user_id` | bigint (unsigned) | Owner user link. |
| `title` | varchar(255) | Checklist item description text. |
| `is_completed` | boolean | Completion flag (default `false`). |
| `created_at` / `updated_at` | timestamp | Audit timestamps. |

---

### 3. `announcements`
*Stores marquee banners visible on the dashboard.*
- **Foreign Keys**: `created_by` -> `users.id` (set null on delete)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `content` | text | Marquee body content. |
| `badge_text` | varchar(255) | Notice tag badge text (e.g. `Urgent`). |
| `is_active` | boolean | Activation toggle switch. |
| `start_date` | datetime | Timestamp when banner should start showing. |
| `end_date` | datetime | Timestamp when banner should stop showing. |
| `created_by` | bigint (unsigned) | Reference to admin creator (nullable). |
| `created_at` / `updated_at` | timestamp | Audit timestamps. |

---

### 4. `page_accesses`
*Explicit granular page-level permissions mapping for user routes.*
- **Foreign Keys**: `user_id` -> `users.id` (cascade on delete)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `user_id` | bigint (unsigned) | Associated user reference. |
| `page_name` | varchar(255) | Name of screen/page (e.g. `birthdays`, `profile`). |
| `can_access` | boolean | Permission flag (default `true`). |
| `created_at` / `updated_at` | timestamp | Audit timestamps. |

---

### 5. `access_requests`
*Role promotion applications filed by users.*
- **Foreign Keys**: 
  - `user_id` -> `users.id` (cascade on delete)
  - `approved_by` -> `users.id` (nullable; tracks processor)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `user_id` | bigint (unsigned) | Applicant user reference. |
| `status` | varchar(255) | Request status (`pending`, `approved`, `rejected`). |
| `requested_role` | varchar(255) | Target role requested (`admin`, `hr`, `superadmin`). |
| `approved_by` | bigint (unsigned) | Reviewing administrator user reference. |
| `created_at` / `updated_at` | timestamp | Audit timestamps. |

---

### 6. `companies`
*First layer of synchronized corporate hierarchy.*
- **Foreign Keys**: `created_by` -> `users.id` (nullable)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `name` | varchar(255) | Registered company name (e.g. `Pricol Limited`). |
| `short_name` | varchar(255) | Abbreviated name (nullable). |
| `created_by` | bigint (unsigned) | Manual creator reference (nullable). |
| `created_at` / `updated_at` | timestamp | Audit timestamps. |

---

### 7. `branches`
*Second layer of organizational hierarchy.*
- **Foreign Keys**: 
  - `company_id` -> `companies.id` (cascade on delete)
  - `created_by` -> `users.id` (nullable)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `name` | varchar(255) | Branch name (e.g. `Coimbatore`). |
| `company_id` | bigint (unsigned) | Parent company reference. |
| `created_by` | bigint (unsigned) | Creator reference (nullable). |
| `created_at` / `updated_at` | timestamp | Audit timestamps. |

---

### 8. `plants`
*Third layer of organizational hierarchy.*
- **Foreign Keys**:
  - `branch_id` -> `branches.id` (cascade on delete)
  - `created_by` -> `users.id` (nullable)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `name` | varchar(255) | Plant name (e.g. `Plant 1`). |
| `branch_id` | bigint (unsigned) | Parent branch reference. |
| `created_by` | bigint (unsigned) | Creator reference (nullable). |
| `created_at` / `updated_at` | timestamp | Audit timestamps. |

---

### 9. `locations`
*Fourth layer of organizational hierarchy.*
- **Foreign Keys**:
  - `plant_id` -> `plants.id` (cascade on delete)
  - `company_id` -> `companies.id` (cascade on delete)
  - `created_by` -> `users.id` (nullable)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `name` | varchar(255) | Local site name. |
| `plant_id` | bigint (unsigned) | Parent plant reference. |
| `company_id` | bigint (unsigned) | Secondary company association reference. |
| `created_by` | bigint (unsigned) | Creator reference (nullable). |
| `created_at` / `updated_at` | timestamp | Audit timestamps. |

---

### 10. `divisions`
*Fifth layer of organizational hierarchy.*
- **Foreign Keys**:
  - `location_id` -> `locations.id` (cascade on delete)
  - `created_by` -> `users.id` (nullable)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `name` | varchar(255) | Division area title. |
| `location_id` | bigint (unsigned) | Parent location reference. |
| `created_by` | bigint (unsigned) | Creator reference (nullable). |
| `created_at` / `updated_at` | timestamp | Audit timestamps. |

---

### 11. `departments`
*Sixth layer of organizational hierarchy.*
- **Foreign Keys**:
  - `division_id` -> `divisions.id` (cascade on delete)
  - `created_by` -> `users.id` (nullable)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `name` | varchar(255) | Department name. |
| `division_id` | bigint (unsigned) | Parent division reference. |
| `created_by` | bigint (unsigned) | Creator reference (nullable). |
| `created_at` / `updated_at` | timestamp | Audit timestamps. |

---

### 12. `organization_structures`
*Flattened mapping table caching company paths to avoid multi-level recursive joins.*
- **Foreign Keys**: Links directly to `company_id`, `branch_id`, `plant_id`, `location_id`, `division_id`, and `department_id` respectively.

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `company_id` | bigint (unsigned) | Company node ID. |
| `branch_id` | bigint (unsigned) | Branch node ID. |
| `plant_id` | bigint (unsigned) | Plant node ID. |
| `location_id` | bigint (unsigned) | Location node ID. |
| `division_id` | bigint (unsigned) | Division node ID. |
| `department_id` | bigint (unsigned) | Department node ID. |
| `created_at` / `updated_at` | timestamp | Mapping logs timestamps. |

---

### 13. `office_details`
*Registered geolocated office campuses.*
- **Unique Constraints**: None

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `office_name` | varchar(255) | Display title of office campus. |
| `image` | varchar(255) | Location cover thumbnail URI/image name (nullable). |
| `address` | text | Street and block address coordinates. |
| `city` | varchar(255) | Location city. |
| `latitude` | decimal(10,8) | Geographic latitude (nullable). |
| `longitude` | decimal(11,8) | Geographic longitude (nullable). |
| `created_at` / `updated_at` | timestamp | Creation and edit timestamps. |

---

### 14. `login_logs`
*Tracks employee login counts.*
- **Foreign Keys**: `user_id` -> `users.id` (cascade on delete)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `user_id` | bigint (unsigned) | User ID. |
| `login_at` | timestamp | The timestamp when sign-in succeeded. |
| `created_at` / `updated_at` | timestamp | Record timestamps. |

---

### 15. `link_clicks`
*Tracks employee interactions with site links.*
- **Foreign Keys**: `user_id` -> `users.id` (cascade on delete, nullable)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | bigint (unsigned) | Primary Key (auto-increment). |
| `user_id` | bigint (unsigned) | User reference (nullable for guests). |
| `url` | varchar(255) | Target URI link clicked. |
| `text` | varchar(255) | Text content of the link or tracking tag. |
| `clicked_at` | timestamp | Timestamp when clicked. |
| `created_at` / `updated_at` | timestamp | Record timestamps. |
