# CLAUDE.md

## 1. Security Notice
> [!WARNING]
> **CRITICAL SECURITY RISK**: The backend database credentials and Azure client secrets are currently committed to the codebase inside `backend/.env`. Never log, output, or push production credentials. In production settings, make sure `backend/.env` is ignored by `.gitignore` and credentials are fed via secure vault or server environment variables.

## 2. Project Overview
Pricol Employee Portal (PEP-UI) is an intranet dashboard application for Pricol Group employees. It integrates Azure Active Directory SSO, syncs organizational data from a central MSSQL master database, allows administrative control over company announcements and office addresses, tracks user telemetry, and hosts employee feeds (birthdays, new joiners, and calendar events).
- **Backend Path**: `backend/` (Laravel 11 API)
- **Frontend Path**: `./` (React 19 / Vite 6 SPA)

## 3. Project Stage
- **Current Status**: Active Development
- **In Progress**: Active code auditing and performance validation.
- **Completed**: Core features (Azure SSO, Graph profile metadata sync, organization sync, office detail CRUD, task checklists, Outlook calendar integrations, feeds, analytics tracking, admin panels) and comprehensive codebase documentation suite (2026-05-31).

## 4. Project Structure
```
.
├── backend
│   ├── app
│   │   ├── Http/Controllers    # REST controllers (AuthController, CompanyLocationController, etc.)
│   │   ├── Models              # Database models (User, AccessRequest, OfficeDetail, etc.)
│   │   └── Traits              # Shared logic (HasTimetrackCookies)
│   ├── config                  # Laravel configurations
│   ├── database/migrations     # SQLite/MySQL migration schemas
│   ├── routes
│   │   ├── api.php             # Public routes (Cookie helper)
│   │   └── web.php             # Authenticated routes & catch-all SPA router
│   └── .env                    # COMMITTED ENVIRONMENT ENVIRONMENT VALUES
├── src
│   ├── components
│   │   ├── admin               # Admin manager components (AnnouncementManager, AdminDashboard)
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── WelcomeCard.jsx     # Greeting panel with profile avatar
│   │   └── QuickDock.jsx       # Floating panel at bottom
│   ├── context
│   │   ├── AuthContext.jsx     # Controls SSO authentication and session check
│   │   └── TaskContext.jsx     # State manager for user todo tasks
│   ├── App.jsx                 # Routes registration and layout wrapper
│   └── main.jsx                # DOM mounting entrypoint
```

## 5. Development Commands
- **Backend (Laravel)**:
  - Serve API: `php artisan serve` (Starts on `http://localhost:8000`)
  - DB Migration: `php artisan migrate`
  - Seed DB: `php artisan db:seed`
  - Run Tests: `php artisan test` or `./vendor/bin/phpunit`
- **Frontend (React)**:
  - Start Dev Server: `npm run dev` (Starts on `http://localhost:5173`)
  - Production Build: `npm run build`
  - Run Linter: `npm run lint`

## 6. Architecture
- **Auth Flow**: Users visit frontend `->` AuthContext triggers redirect `->` `AuthController@redirectToAzure` `->` Microsoft SSO sign-in `->` `AuthController@handleAzureCallback` `->` user token exchange and MS Graph API queries `->` Laravel authenticates session + sets Timetrack cookies `->` redirect back to frontend.
- **User/Permission Model**: Role-based access control. Valid roles are standard user, `hr`, `admin`, and `superadmin`. Some components/routes verify access rights via `user.page_accesses` array containing specific page permissions.
- **Key Decisions**: Double database connections (`mysql` for local portal data, read-only `common_db` on SQL Server for corporate staff syncs). Local frontend proxies `/auth` and `/api` requests to backend via Vite dev server proxy configurations.

## 7. Key Models

| Model | Table | Important Fields and Notes |
| :--- | :--- | :--- |
| `User` | `users` | Contains employee ID, Azure tokens, job titles, department, manager name, avatar blob, and roles (`admin`/`superadmin`/`hr`). |
| `Task` | `tasks` | Private user tasks. Fields: `user_id`, `title`, `is_completed`. |
| `Announcement` | `announcements` | Global banner notifications. Fields: `badge_text`, `content`, `is_active`, `start_date`, `end_date`. |
| `AccessRequest` | `access_requests` | Requests for role upgrades. Fields: `user_id`, `requested_role`, `status`, `approved_by`. |
| `OfficeDetail` | `office_details` | Metadata for buildings. Fields: `office_name`, `address`, `city`, `latitude`, `longitude`, `image`. |
| `OrganizationStructure` | `organization_structures` | Lookup table mapping `company_id`, `branch_id`, `plant_id`, `location_id`, `division_id`, `department_id`. |

## 8. API Endpoints

### Public Endpoints
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/test-cookie` | Generates a mock `pep_cook` cookie for testing purposes. |
| `GET` | `/auth/redirect` | Redirects client to Microsoft Azure AD SSO portal. |
| `GET` | `/auth/callback` | Callback endpoint for Azure AD validation, user creation, and local login redirect. |

### Authenticated Endpoints
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/auth/user` | Returns the currently authenticated user with permissions and requests. |
| `POST` | `/auth/logout` | Clears the Laravel user session. |
| `GET` | `/tasks` | Retrieves user's tasks. |
| `POST` | `/tasks` | Creates a new task. |
| `PUT` | `/tasks/{task}` | Toggles or edits a task. |
| `DELETE` | `/tasks/{task}` | Deletes a task. |
| `GET` | `/calendar/events` | Fetches Outlook upcoming events via Microsoft Graph. |
| `GET` | `/api/birthdays` | Returns employees celebrating birthdays today/tomorrow. |
| `GET` | `/api/new-joiners` | Returns new corporate joiners from past 7 days. |
| `POST` | `/api/admin/sync` | Starts master SQL Server hierarchy sync. |
| `GET` | `/api/admin/sync-status` | Gets caching progress status of the master database sync. |
| `GET` | `/api/weather` | Pulls current forecast based on location query coordinates. |

## 9. Frontend Pages / Screens

| Route or Screen | Component | Notes |
| :--- | :--- | :--- |
| `/` | `Dashboard` (App.jsx) | Main portal displaying announcements, birthday list, quick docks, calendar, and task widget. |
| `/profile` | `ProfilePage` | Shows user company details, role permissions, and active session telemetry. |
| `/birthdays` | `BirthdayPage` | Detailed tab listing all team and company-wide birthdays for today and tomorrow. |
| `/admin/dashboard` | `AdminDashboard` | Shows analytics chart (Recharts) for logins, page clicks, and task ratios. |
| `/admin/access-request` | `AccessRequestStatus` | Approvals queue dashboard for processing role promotion requests. |
| `/admin/company-location` | `CompanyLocationManager` | Master data sync management and hierarchical tree view visualization. |
| `/admin/announcements` | `AnnouncementManager` | Board to create, preview, pause, and delete custom carousel banners. |
| `/admin/office-address` | `OfficeAddressManager` | Form interface to manage geolocations, office details, and building addresses. |

## 10. Key Conventions
- **Controllers & Routing**: Use web middleware group for auth state preservation rather than API state tokens, leveraging HTTP cookies.
- **SQL Server Raw Dates**: SQL Server database queries in `BirthdayController` and `NewJoinerController` must utilize raw database syntax expressions (e.g. `MONTH(dob)`) rather than generic MySQL date format wrappers.
- **Async Cache Locks**: Synchronization progress in `CompanyLocationController` must update the Redis/Database cache status periodically so that admins get live progress logs without socket interfaces.

## 11. Debugging Tips
- **SSO Login Fails**: Check if local time is drifted (SSO tokens fail validation when server clocks are off by >5 mins).
- **MSSQL Driver Missing**: Ensure `sqlsrv` or `pdo_sqlsrv` extensions are enabled in PHP configurations; otherwise, master database synchronization will fail with "Driver not found" exceptions.
- **CSRF Token Errors**: Ensure standard REST calls from React send CORS cookies properly. Verify `withCredentials = true` is configured in Axios defaults.

## 12. Doc Update Rule
> Whenever you modify code:
> - Update README.md if the feature, setup, or usage changed
> - Update the relevant page in docs/ if logic or flow changed
> - Append to CHANGES.md: `[YYYY-MM-DD] short description of what changed`
> - Update the Project Stage section in CLAUDE.md if a feature is now complete or in progress
