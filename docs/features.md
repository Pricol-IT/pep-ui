# Feature Breakdown

This document provides a product manager-friendly description of all features and modules built into the Pricol Employee Portal.

---

## 1. Single Sign-On (SSO) & Profile Sync `[done]`
*Access the portal securely using corporate Microsoft credentials.*
- **Automatic Account Provisioning**: New user profiles are created instantly upon their first successful corporate sign-in.
- **Intelligent Profile Extension**: Automatically pulls employee profiles from Microsoft Azure, syncs avatar pictures, captures employee IDs, corporate titles, department divisions, and manager structures.
- **Access Domain Restriction**: Restricts portal login rights to company domains (`@pricol.com`).

---

## 2. Global Carousel Announcement Banners `[done]`
*Keep the entire team updated with rotating corporate announcements.*
- **Marquee Banners**: Prominently display active notices at the top of the user dashboard.
- **Badge Alerts**: Highlight important alerts with specific tags (e.g. "Urgent", "Notification", "Update").
- **Date Scheduling**: Set future start and end times for announcements to automatically display and hide them.
- **Pause Banners**: Instantly toggle announcement visibility without deleting the entry.

---

## 3. Birthday & New Joiner Feed `[done]`
*Welcome new teammates and celebrate team milestones.*
- **Birthday Logs**: Displays employees celebrating birthdays today and tomorrow.
- **Department Filters**: View department-specific birthdays to easily celebrate with close teammates.
- **New Hires Feed**: Lists new colleagues who joined the group within the last 7 days.
- **Initials Fallbacks**: Generates profile placeholders for employees without synced avatars.

---

## 4. Upcoming Meetings Widget `[done]`
*Stay on top of daily schedules with synced Outlook calendar meetings.*
- **Microsoft Outlook Sync**: Automatically fetches up to 5 upcoming meetings from the logged-in user's Microsoft calendar.
- **Location Types**: Differentiates between physical office locations and online digital meetings (displaying direct join URLs).
- **Timezone Adjustment**: Converts meeting schedules automatically to local time (IST).

---

## 5. Private Task Planner `[done]`
*A personal checklist to manage daily routines.*
- **Quick Creation**: Add items instantly in the sidebar todo widget.
- **Checkbox Toggle**: Check off completed tasks to archive them.
- **Delete Tasks**: Remove obsolete items.

---

## 6. Timetrack Quick-Dock Integration `[done]`
*Access the legacy Timetrack application without logging in again.*
- **One-Click Redirection**: Instantly route employees to the legacy Timetrack app via the floating dock.
- **Silent Credentials Injection**: Generates background session cookies (`pep_cook`) containing employee codes, company IDs, and authentication state, bypassing manual login screens.

---

## 7. Master Organization Sync `[done]`
*Synchronize internal company directories from SQL Server.*
- **Bulk Synchronizer**: Synchronize Company-Branch-Plant-Location-Division-Department hierarchies from a central read-only database.
- **Chunked Processing**: Imports thousands of database lines in small batches to prevent server overload.
- **Sync Status Monitor**: Displays live completion percentage and execution logs in real-time.

---

## 8. Office Geolocation & Weather Dashboard `[done]`
*Register office addresses and display real-time site weather.*
- **Office Location Profiles**: CRUD interface to record addresses, coordinates, and thumbnail images for different campuses.
- **Intelligent Weather Fetching**: Integrates Open-Meteo API to fetch current temperature, precipitation, and conditions based on coordinates.

---

## 9. Portal Analytics and Click Tracking `[done]`
*Evaluate portal usage and user engagement logs.*
- **Login Tracker**: Records timestamps when users log in.
- **Interaction Tracker**: Non-intrusively tracks user clicks on links and buttons.
- **Analytical Charts**: Displays graphical representations of user login trends, click frequencies, and task completion ratios.
