# kbNews Admin Module

This directory houses the dedicated administration logic for the **kbNews** portal, inspired by Django Admin's table-driven CRUD and rapid management, but designed with a modern and sleek interface.

## 🚀 Features

- **Users Management Table**:
  - Live search, filtering by verification status (`verified`, `unverified`) and role (`admin`, `user`).
  - **Manual User Verification**: 1-click toggle to manually verify accounts without requiring email OTP.
  - **Fast User Creation**: Direct modal to provision users with pre-verified status.
  - Full edit and delete permissions.
- **News Articles Table**:
  - View all articles across all authors.
  - Fast editing and deletion of any article.
  - Category filtering and search.
- **Dashboard Metrics**:
  - Total users, verified vs. unverified ratio, new users in last 7 days.
  - Total articles, articles published this week, category breakdown.
- **Strict Access Control**:
  - Only users with `role: "admin"` or `isAdmin: true` can access `/admin/*` and `/api/admin/*`.
  - No public admin registration; admins are provisioned manually via CLI or by another admin.

## 🛠️ CLI Setup for Admin

To create or promote an admin user manually:

```bash
# Option 1: Create a brand new admin user
node admin/scripts/createAdmin.js <email> <password> <name>
# Example:
node admin/scripts/createAdmin.js admin@kbnews.com AdminSecret123 "System Admin"

# Option 2: Promote an existing user to admin
node admin/scripts/createAdmin.js --promote user@example.com

# Option 3: Quick default admin setup
node admin/scripts/createAdmin.js
```

## 🔌 API Endpoints (`/api/admin`)

All endpoints require an authenticated session (`token` cookie) from a user with administrator privileges.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Summary statistics and recent activity |
| `GET` | `/api/admin/users` | List users with search, role/status filter, and pagination |
| `POST` | `/api/admin/users` | Create a new user (with role & verification status) |
| `PUT` | `/api/admin/users/:id` | Update user details, role, or password |
| `PATCH` | `/api/admin/users/:id/verify` | 1-click manual verification toggle |
| `DELETE` | `/api/admin/users/:id` | Delete user and their articles |
| `GET` | `/api/admin/news` | List all articles with search, category filter, pagination |
| `POST` | `/api/admin/news` | Publish news as admin (upload image or provide URL) |
| `PUT` | `/api/admin/news/:id` | Update any article |
| `DELETE` | `/api/admin/news/:id` | Delete any article |
