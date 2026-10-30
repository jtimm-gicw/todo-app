# Daymark — Code 401 Full-Stack Todo App

A polished, commented React + Mantine todo application implementing **all four Code 401 lab phases**, with a real **Express + PostgreSQL API**.

> Status: source code provided and ready to configure locally. You must supply PostgreSQL credentials, a JWT secret, and deployment URLs before it will run end-to-end. The GitHub repository does **not** automatically deploy a server or database.

## Features mapped to the lab phases

| Phase | Implementation |
| --- | --- |
| **1. Context API** | Settings Context defaults to **3 per page**, **hide completed**, **sort by difficulty**. Mantine Pagination handles multiple pages. |
| **2. Context behaviors** | Settings page edits preferences and saves validated choices to **Local Storage**, restored on startup. |
| **3. Login and Auth** | Function components for Login and Auth, account signup, token cookie, verified session, and role-based UI. |
| **4. API integration** | Real login, PostgreSQL task storage, authenticated GET/POST/PUT/DELETE, server-enforced permissions, and re-fetch after each mutation. |

### Modern design and developer improvements
- Vite replaces legacy Create React App; Mantine 8 replaces Mantine 5.
- Responsive dashboard with progress bar, counters, difficulty badges, animated cards, search, and status filters.
- File-level explanatory comments and labeled sections in the code.
- Clean, immutable React state updates, input validation, meaningful errors, and repeatable tests.
- [Detailed UML diagrams and file explanations](docs/ARCHITECTURE.md)

## Quick start (Windows PowerShell, WSL Ubuntu, or macOS/Linux)

### 1. Install dependencies
You need **Node.js 22.12+** (or compatible Node 20.19+), npm, and PostgreSQL.

```bash
git clone https://github.com/jtimm-gicw/todo-app.git
cd todo-app
# If you're reviewing the PR branch before merge:
git checkout improve/fullstack-todo-labs
npm install
cd server
npm install
cd ..
```

**Important:** The previous CRA `package-lock.json` is removed because dependencies changed. `npm install` generates new lockfiles; commit those after verifying locally.

### 2. Create the PostgreSQL database
In your Ubuntu/WSL terminal (replace your credentials as appropriate):

```bash
psql -U postgres -h localhost -W
CREATE DATABASE daymark_db;
\q
```

The API creates the `users` and `todos` tables on startup. For shared production deployments use reviewed database migrations, backups, and a dedicated restricted database role.

### 3. Set up the API environment
Copy `server/.env.example` to `server/.env`. Set `DATABASE_URL`, `JWT_SECRET`, and `CORS_ORIGIN`.

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Optional admin account:** Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `server/.env` **before the first API launch**. This admin has delete permission and can manage other users' roles. Never commit `.env` or passwords.

### 4. Run the server and frontend
Open two terminal windows at the repo root:

```bash
# Terminal 1 — API on http://localhost:3001
npm run server
```

```bash
# Terminal 2 — Vite on http://localhost:5173
npm run dev
```

Visit **http://localhost:5173**. Use **Create account** to register. New accounts start as **Editors** (read/create/update, not delete). The optional server-seeded admin can delete tasks.

**Windows note:** If PowerShell blocks `npm.ps1`, use `npm.cmd install` and `npm.cmd run dev`, or use Ubuntu/WSL. Your PostgreSQL service must be running and accessible to the API host.

### 5. Test
```bash
# Frontend: sorting, pagination, context, auth, API client
npm test

# Backend: role matrix and input validation
cd server
npm test

# Vite production build
cd ..
npm run build
```

## API endpoints

All endpoints have the `/api` prefix. Protected endpoints require `Authorization: Bearer <token>`.

| Method | Route | Permission |
| --- | --- | --- |
| POST | `/api/signup` | Public |
| POST | `/api/signin` | Public |
| GET | `/api/me` | Signed in |
| GET | `/api/todo` | read |
| POST | `/api/todo` | create |
| PUT | `/api/todo/:id` (or `/api/todo` with body `id`) | update |
| DELETE | `/api/todo/:id` | delete |
| GET | `/api/users` | admin |
| PATCH | `/api/users/:id/role` | admin |
| GET | `/api/health` | Public |

Example new task JSON:
```json
{ "text": "Practice React Context", "assignee": "Alex", "difficulty": 3 }
```

Example status update:
```json
{ "complete": true }
```

Admin-only role change (use the JWT returned from signing in as an admin):
```bash
curl -X PATCH http://localhost:3001/api/users/USER_UUID/role \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"reader"}'
```

## Deployment notes

Deploy `server/` to a Node hosting provider and provision a managed PostgreSQL database. Configure server environment variables (including a deployed `CORS_ORIGIN` for the frontend). Deploy the Vite frontend to a static hosting service and set:

```env
VITE_API_URL=https://your-api-host.example.com/api
```

Rebuild the frontend after changing `VITE_API_URL` (Vite injects `VITE_*` settings at build time). Never put `DATABASE_URL` or `JWT_SECRET` in frontend environment variables. Use HTTPS for both origins.

## Useful commands

```bash
npm run dev      # frontend development
npm run server   # backend development
npm test         # frontend tests
npm run build    # production client build
```

## Implementation notes for instructors

- **Context:** Settings Context exposes a value and a save function to multiple components; Auth Context exposes the authenticated user's capabilities.
- **Pagination:** `slice()` uses `(page - 1) * pageItems`, with clamping when items or settings change.
- **Data flow:** Task mutations always re-fetch `GET /todo` rather than trusting stale in-memory state.
- **Authorization:** The UI gates create/update/delete actions, and the Express server repeats the permission check for every request.
- **Further production hardening:** secure HttpOnly session cookies, CSRF protection where applicable, account recovery, email verification, monitoring, persistent rate-limit storage, audited migrations, and integration tests against a test database.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for UML and individual file responsibilities.

## Colorful dashboard design

The playful UI refresh lives primarily in `src/styles.css`, with small presentation updates in the dashboard, task list, login, and settings components. It adds **violet, raspberry, peach, mint, and sunshine** colors; gradient hero sections; color-coded task difficulty; lively metrics; encouraging progress messages; and responsive hover effects.

This is a visual-only refresh: the four lab phases, permissions, PostgreSQL API, authentication, task pagination, and user settings are unchanged. Animations respect `prefers-reduced-motion` and controls retain visible keyboard focus. To preview this design branch without merging:

```bash
git fetch origin
git switch design/colorful-daymark
npm install
npm run dev
```

Run the API separately with `npm run server` as described above.
