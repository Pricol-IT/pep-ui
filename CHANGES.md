# CHANGES.md

## [v1.4.0] — 2026-05-31

### Feature
- **Analytics Dashboard**: Integrated analytical tracking dashboards displaying statistics on user logins, link clicks, and task progress rates using Recharts (`AnalyticsCharts.jsx`, `AdminDashboard.jsx`, `AnalyticsController.php`).
- **Telemetry Refactoring**: Standardized all telemetry and admin routes under `/api/admin/*` to streamline middleware permissions checks (`web.php`).

---

## [v1.3.0] — 2026-05-18

### Feature
- **Office Address Geolocation Manager**: Introduced geolocation mapping CRUD controls for offices including Open-Meteo weather API details widget integration in the sidebar (`OfficeDetailController.php`, `OfficeAddressManager.jsx`).
- **User Action Logging**: Added background link clicks and login telemetry logs database tracking (`LinkClickController.php`, `LoginLog.php`).

---

## [v1.2.0] — 2026-05-02

### Feature
- **Flexible Hierarchy Sync**: Rewrote organizational mapping schemas to structure Company-Branch-Plant-Location-Division-Department flows without strict legacy constraints (`2026_03_21_master_data_tables` migrations, `CompanyLocationController.php`).
- **Sync Visualizations**: Built recursive tree visualization nodes inside Company/Location manager interfaces (`CompanyLocationManager.jsx`).

---

## [v1.1.0] — 2026-04-15

### Feature
- **50 Years Branding**: Integrated golden anniversary "50 Years" corporate logos, styles, and dedicated branding assets on the Login portal screens.

---

## [v0.8.0] — 2026-03-28

### Feature
- **Filter White Collar**: Modified SQL Server employee lookups in birthday and new hire queries to select only `WHITE COLLAR` employee types (`BirthdayController.php`, `NewJoinerController.php`).

---

## [v0.7.0] — 2026-03-10

### Feature
- **Announcement Banners Manager**: Added administrative controls to schedule, pause, create, and display global announcement alerts on the home page (`AnnouncementController.php`, `AnnouncementManager.jsx`).

---

## [v0.6.0] — 2026-02-22

### Feature
- **Master Data ETL Sync**: Created initial version of bulk master organizational records sync connecting to central MS SQL Server database (`CompanyLocationController.php`).

---

## [v0.5.0] — 2026-02-05

### Feature
- **Timetrack Auto-Login Cookie Trait**: Implemented cookie injection trait (`HasTimetrackCookies.php`) that parses active employee details and compiles secure `pep_cook` strings to enable single sign-on redirection to Timetrack services.

---

## [v0.4.0] — 2026-02-01

### Feature
- **SSO Auto-Login Flow**: Set up authentication hooks to generate session tokens and cookies automatically upon callback authentication.

---

## [v0.3.0] — 2026-01-20

### Feature
- **Access Requests Pipeline**: Created approval workflows and page routing permissions checks to register upgrade requests (`AccessRequestStatus.jsx`).

---

## [v0.2.0] — 2026-01-15

### Feature
- **Access Control Roles**: Added basic user roles (Standard, HR, Admin, Superadmin) and route checks.

---

## [v0.1.0] — 2026-01-05

### Feature
- **Intranet Feeds Widget**: Initial API database endpoints for pulling birthdays and new joiners from external systems.
- **SSO Callback & Profile Sync**: Initial Azure Active Directory integration and Graph API profile parsing.
