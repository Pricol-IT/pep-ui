# Deployment Guide

This document outlines the hosting environment requirements, configuration settings, step-by-step deployment routines, and rollback strategies for the Pricol Employee Portal (PEP-UI).

---

## 1. System Requirements

### Backend (Laravel API Server)
- **PHP**: `v8.2` or higher (PHP 8.3 recommended)
- **PHP Extensions**: `openssl`, `pdo_mysql`, `pdo_sqlsrv` (or `sqlsrv`), `mbstring`, `xml`, `curl`, `zip`
- **Composer**: `v2.x`
- **Local DB**: MySQL `v8.0+` or MariaDB `v10.4+`
- **Cache Driver**: Redis (recommended) or Database-backed cache

### Frontend (Client SPA Build)
- **Node.js**: `v18.x` or `v20.x`
- **Build Tool**: Vite 6

### Network / Access Boundaries
- Outbound internet access to:
  - `graph.microsoft.com` (port 443) for SSO and Calendar events.
  - `login.microsoftonline.com` (port 443) for Azure AD handshakes.
  - `api.open-meteo.com` (port 443) for real-time local weather forecasts.
- Inbound network connectivity to the corporate Microsoft SQL Server (`GroupCommonInfo`) on port `1435` or custom configured ports.

---

## 2. Environment Configurations

Below are the production environment variable templates.

### Backend Configurations (`backend/.env`)
```ini
APP_NAME="Pricol Intranet Portal"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:eJbqS... # MUST be generated via php artisan key:generate
APP_URL=https://portal.mypricol.in

# Local Database
DB_CONNECTION=mysql
DB_HOST=10.90.10.170
DB_PORT=3306
DB_DATABASE=intra_portal
DB_USERNAME=pricoldc
DB_PASSWORD="YourLocalSecureMySQLPassword"

# Session Configurations
SESSION_DRIVER=database
SESSION_DOMAIN=portal.mypricol.in
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

# Azure SSO
AZURE_CLIENT_ID="d8150a6a-6ae6-4909-96ba-5691714ad783"
AZURE_CLIENT_SECRET="YourAzureClientSecretCredential"
AZURE_TENANT_ID="5622ad4e-cf23-49a9-8a97-2fe4f267e0f5"
AZURE_REDIRECT_URI="https://portal.mypricol.in/auth/callback"

# Corporate Read-Only MS SQL Database
MSSQL_HOST=pcs-mssql.mypricol.in
MSSQL_PORT=1435
MSSQL_DATABASE=GroupCommonInfo
MSSQL_USERNAME=CommonDBUser
MSSQL_PASSWORD="YourMSSQLSecureAccessPassword"

# Frontend Configs
FRONTEND_URL=https://portal.mypricol.in
```

---

## 3. Step-by-Step Deployment Routine

The portal is designed to run behind a reverse proxy (e.g. Nginx or Apache) that routes frontend traffic and proxies API requests `/api/*` and `/auth/*` to the Laravel backend process.

### Phase 1: Deploy Backend API
1. Clone the target release branch to your application directory (e.g. `/var/www/pep-ui`).
2. Move to the backend folder:
   ```bash
   cd /var/www/pep-ui/backend
   ```
3. Install production PHP dependencies:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```
4. Copy the production environment settings and configure details:
   ```bash
   cp .env.example .env
   # Edit details inside .env manually (e.g., set production credentials)
   ```
5. Cache configurations and routes to optimize Laravel boot cycles:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### Phase 2: Deploy Frontend Assets
1. Navigate back to the workspace root directory:
   ```bash
   cd /var/www/pep-ui
   ```
2. Install Node dependencies:
   ```bash
   npm ci
   ```
3. Build production build distribution files:
   ```bash
   npm run build
   ```
   This builds static assets into the root `/dist` directory. Configure your web server (e.g. Nginx) to serve `/dist/index.html` for root requests.

---

## 4. Post-Deployment Checklist

After the files are successfully built and cached, run the following verification checks:

- [ ] **Run Database Migrations**: Execute database updates safely:
  ```bash
  cd /var/www/pep-ui/backend
  php artisan migrate --force
  ```
- [ ] **Verify Master Sync Connections**: Test connecting to both local MySQL and remote SQL Server databases:
  ```bash
  php test_db.php
  ```
- [ ] **Run Master Organizational Sync**: Trigger organizational directory imports:
  ```bash
  # Can be triggered via admin panel UI or raw curl command (requires auth session)
  curl -X POST https://portal.mypricol.in/api/admin/sync
  ```
- [ ] **Configure Cron Schedule (Optional)**: If you want to automate synchronization, add this cron job:
  ```cron
  0 2 * * * cd /var/www/pep-ui/backend && php artisan schedule:run >> /dev/null 2>&1
  ```

---

## 5. Rollback Strategy

If a deployment fails, follow these steps to restore the previous stable version:

1. **Revert Files**: Check out the previous stable git commit tag:
   ```bash
   git checkout tags/v1.4.0
   ```
2. **Re-cache Backend**: Reset cached settings:
   ```bash
   cd backend
   php artisan config:clear
   php artisan route:clear
   php artisan config:cache
   php artisan route:cache
   ```
3. **Re-build Frontend**: Recompile static JS assets from the stable snapshot:
   ```bash
   cd ..
   npm run build
   ```
4. **Roll back Migrations (If Required)**: If database structural changes caused failures, roll back the latest database migration batch:
   ```bash
   cd backend
   php artisan migrate:rollback --step=1
   ```
