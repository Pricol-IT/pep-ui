# Pricol Employee Portal (PEP-UI)

Pricol Employee Portal (PEP) is a centralized intranet portal designed for Pricol Group employees to access internal company services, announcements, birthday and new joiner feeds, upcoming meetings, quick applications, and administrative tools. It features Single Sign-On (SSO) integration via Azure AD and automates synchronization of the organizational structure from the Group's common Microsoft SQL Server database.

## Key Features
- **SSO Integration**: Secure login via Azure Active Directory, domain restricted to `@pricol.com` with automatic Microsoft Graph profile expansion (avatar, job title, company name, department, employee ID, manager name).
- **Intranet Services Dashboard**: Quick docks, application launcher widgets, local weather forecasts for office locations, and user activity timelines.
- **Task Management**: Private list of tasks/todos with creation, toggle, update, and deletion capability.
- **Feeds and Events**: Live feed of upcoming birthdays (ignoring birth years) and new joiners within the last 7 days.
- **Calendar & Meetings**: Fetch up to 5 upcoming meetings directly from the authenticated user's Outlook calendar via Microsoft Graph API.
- **Timetrack Auto-Login**: Secure seamless redirect to the legacy Timetrack application with automatic HR and employee cookie injection (`pep_cook`).
- **Admin Panel & Controls**:
  - **Access Requests**: Approve or reject access requests from users requesting special roles (e.g. `admin`, `hr`, `superadmin`).
  - **Organization Sync**: Run real-time chunked synchronization of Company-Branch-Plant-Location-Division-Department hierarchies from Group SQL Server to local MySQL.
  - **Office Address Manager**: Add, update, or remove office addresses, geolocations, and thumbnail images.
  - **Announcement Manager**: Create, edit, toggle, or delete global carousel announcement banners.
  - **Analytical Dashboards**: Admin charts showing user login counts, total clicks, and task statistics.

## Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 6, React Router 7 | Core framework and dev server. |
| **Styling** | Vanilla CSS, Bootstrap 5.3 | Styling, layouts, custom responsive themes. |
| **Frontend Libraries** | Recharts, Swiper, AOS, Tabler Icons | Charts, carousels, animations, icons. |
| **Backend** | Laravel 11, PHP 8.2+ | REST API, Azure Socialite integration, background processing. |
| **Local Database** | MySQL / MariaDB | Stores user profiles, tasks, announcements, office details, and click logs. |
| **Group Database** | Microsoft SQL Server | External read-only source for master organizational hierarchy and employee records. |

## Prerequisites and Installation

### Backend Setup
1. PHP 8.2 or higher with `pdo_mysql`, `pdo_sqlsrv` (or `sqlsrv`), and `curl` extensions installed.
2. Composer (PHP dependency manager).
3. MySQL / MariaDB server.
4. Microsoft SQL Server drivers for PHP (required for syncing with `common_db`).

Run the following commands inside the `backend` folder:
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Frontend Setup
1. Node.js (v18 or higher).
2. npm or yarn package manager.

Run the following commands inside the root folder:
```bash
npm install
```

## Environment Variables

### Backend Environment Variables (`backend/.env`)

| Key | Description | Default/Example |
| :--- | :--- | :--- |
| `APP_ENV` | Application environment | `local` |
| `APP_DEBUG` | Enable debug logs/traces | `true` |
| `APP_URL` | Laravel server URL | `http://localhost:8000` |
| `DB_CONNECTION` | Primary database driver | `mysql` |
| `DB_HOST` | Local MySQL server host | `127.0.0.1` |
| `DB_PORT` | Local MySQL server port | `3306` |
| `DB_DATABASE` | Local MySQL database name | `intra_portal` |
| `AZURE_CLIENT_ID` | Azure AD client/app ID | `your-azure-client-id` |
| `AZURE_CLIENT_SECRET` | Azure AD client secret credential | `your-azure-client-secret` |
| `AZURE_TENANT_ID` | Azure AD directory/tenant ID | `your-azure-tenant-id` |
| `AZURE_REDIRECT_URI` | Azure callback URL | `http://localhost:5173/auth/callback` |
| `MSSQL_HOST` | SQL Server host for organizational sync | `pcs-mssql.mypricol.in` |
| `MSSQL_PORT` | SQL Server port | `1435` |
| `MSSQL_DATABASE` | SQL Server database name | `GroupCommonInfo` |
| `MSSQL_USERNAME` | SQL Server login username | `CommonDBUser` |
| `MSSQL_PASSWORD` | SQL Server login password | `Acce**DB` |
| `FRONTEND_URL` | Frontend client origin | `http://localhost:5173` |

## How to Run Locally

### Run Backend Server
Inside the `backend/` directory:
```bash
php artisan serve
```
This runs the Laravel development backend at `http://localhost:8000`.

### Run Frontend Dev Server
Inside the root directory:
```bash
npm run dev
```
This starts the Vite React dev server at `http://localhost:5173` with configured API proxying to port 8000.

## Project Folder Structure

```
.
├── backend                     # Laravel API Backend
│   ├── app                     # PHP application code
│   │   ├── Http/Controllers    # API Endpoints controllers
│   │   ├── Models              # Eloquent Database models
│   │   └── Traits              # Shared backend traits
│   ├── config                  # Configuration files
│   ├── database                # Migrations, seeders, factories
│   └── routes                  # API / Web route files (web.php, api.php)
├── public                      # Static public frontend assets
├── src                         # React Frontend Source
│   ├── assets                  # Images and stylesheets
│   ├── components              # UI components
│   │   └── admin               # Administration pages & layout
│   ├── context                 # Global React contexts (Auth, Task)
│   ├── App.jsx                 # Root layout & client router
│   └── main.jsx                # SPA Entry point
├── package.json                # Frontend package dependencies
└── vite.config.js              # Vite configuration with API proxy
```

## Documentation

- [Feature Breakdown](file:///srv/projects/pep-ui/docs/features.md) - Deep dive into modules and capabilities.
- [Architecture Design](file:///srv/projects/pep-ui/docs/architecture.md) - System layout, design decisions, and data flow.
- [API Documentation](file:///srv/projects/pep-ui/docs/api-documentation.md) - Request/Response formats and REST endpoints.
- [Database Schema](file:///srv/projects/pep-ui/docs/database-schema.md) - Relationships and table definitions.
- [Deployment Guide](file:///srv/projects/pep-ui/docs/deployment.md) - System requirements, environment setups, and rollbacks.
- [Troubleshooting Manual](file:///srv/projects/pep-ui/docs/troubleshooting.md) - Known exceptions, common pitfalls, and quick fixes.
