# Troubleshooting Manual

This manual provides quick solutions for common developer and operator pitfalls.

---

### 1. **Symptom** → `RelationNotFoundException: Call to undefined relationship [officeDetail] on model [App\Models\Location]`
- **Cause**: `CompanyLocationController` loads location models using `Location::with(['plant', 'officeDetail'])`, but the `Location` model file (`app/Models/Location.php`) lacks the `officeDetail` relationship declaration.
- **Fix**: Edit `backend/app/Models/Location.php` to define the relationship mapping:
  ```php
  public function officeDetail()
  {
      // Office Details and Locations link dynamically using names
      return $this->hasOne(OfficeDetail::class, 'office_name', 'name');
  }
  ```

---

### 2. **Symptom** → `Method [show] does not exist on [App\Http\Controllers\OfficeDetailController]`
- **Cause**: In `backend/routes/web.php`, the route `/api/admin/office-details/{locationId}` maps to `OfficeDetailController@show`, but this method is missing from the controller.
- **Fix**: Add the missing `show` method to `backend/app/Http/Controllers/OfficeDetailController.php`:
  ```php
  public function show($locationId)
  {
      $location = Location::findOrFail($locationId);
      return OfficeDetail::where('office_name', $location->name)->first() 
          ?? response()->json(['message' => 'No office details found'], 404);
  }
  ```

---

### 3. **Symptom** → `Driver [sqlsrv] not found` or `Database connection [common_db] failed`
- **Cause**: The PHP runtime environment is missing Microsoft SQL Server drivers (`pdo_sqlsrv`), which are required to connect to the read-only master database.
- **Fix**: Install Microsoft SQL Server ODBC drivers and register PHP extensions:
  ```bash
  # On Ubuntu/Debian:
  sudo apt-get install php-sqlsrv
  sudo service apache2 restart # or restart php-fpm
  ```

---

### 4. **Symptom** → Master synchronization times out midway with `Maximum execution time exceeded`
- **Cause**: Syncing corporate databases handles thousands of items. The process runs longer than the default PHP script timeout limit (usually 30 or 60 seconds).
- **Fix**: Edit `php.ini` to increase maximum run limits or increase timeouts inside `CompanyLocationController.php`. Ensure `set_time_limit(300)` is executing successfully at the top of the `syncFromCommonDb` method.

---

### 5. **Symptom** → `Socialite Azure error: SSO Authentication failed` or login loops
- **Cause**: Mismatches between your local client redirect URI, local time drift (Azure token validations fail if server clocks drift by >5 minutes), or invalid Microsoft App credentials in your backend `.env`.
- **Fix**:
  1. Synchronize system clocks:
     ```bash
     sudo ntpdate pool.ntp.org
     ```
  2. Verify that `AZURE_REDIRECT_URI` matches the redirect URL registered in the Azure Portal App Registration exactly.

---

### 6. **Symptom** → `419 Page Expired` or CSRF token mismatch exceptions
- **Cause**: State-modifying requests (`POST`, `PUT`, `DELETE`) are sent without the CSRF verification token header (`X-XSRF-TOKEN`).
- **Fix**: Ensure that the frontend Axios client is configured to send cross-origin credentials. Verify this line is executed in your frontend mounting script:
  ```javascript
  axios.defaults.withCredentials = true;
  ```

---

### 7. **Symptom** → `Vite dev server proxy error: ECONNREFUSED 127.0.0.1:8000`
- **Cause**: The Vite development frontend server is running, but the Laravel backend API server is not running on port 8000.
- **Fix**: Start the backend server in a separate terminal window:
  ```bash
  cd backend
  php artisan serve --port=8000
  ```

---

### 8. **Symptom** → User avatar profile pictures display as broken links
- **Cause**: The user profile lacks avatar blobs in Microsoft Active Directory, or fetching the photo from Microsoft Graph failed.
- **Fix**: The React frontend falls back to displaying a user's initials automatically. If you wish to troubleshoot API calls, view Graph errors inside `storage/logs/laravel.log`.

---

### 9. **Symptom** → Timetrack logins fail after redirection from the PEP Intranet
- **Cause**: The legacy Timetrack application cannot read the `pep_cook` cookie because the domain configurations differ (e.g. localhost vs corporate intranet domains).
- **Fix**: Verify your cookies configuration. The cookie must be written to a parent domain accessible to both portal clients (e.g., set `SESSION_DOMAIN=.mypricol.in` or similar wildcard options in production).
