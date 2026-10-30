# Daymark Architecture — Code 401 Todo Labs

This guide explains **what each file does**, the React Context relationships, and how client requests reach PostgreSQL. Every source file also contains a top-level description and comments dividing important code blocks.

## Detailed UML: component structure

```mermaid
flowchart TD
  Main["main.jsx — MantineProvider"] --> AP["AuthProvider — user, token, login, register, logout, can()"]
  AP --> SP["SettingsProvider — pageItems, showCompleted, sort, saveSettings()"]
  SP --> App["App.jsx — BrowserRouter and protected routes"]
  App --> Header["Header — navigation and logout"]
  App --> Login["Login — sign in / sign up (if logged out)"]
  App --> Todo["ToDo — API-backed task state"]
  App --> SettingsForm["SettingsForm — editable preferences"]
  Todo --> Add["Create task form (Auth: create)"]
  Todo --> List["List — filter, sort and Pagination (Auth: read)"]
  List --> Update["Mark complete (Auth: update)"]
  List --> Delete["Delete task (Auth: delete)"]
  Todo --> API["services/api.js — fetch + Bearer token"]
  Login --> API
  SettingsForm --> LS[("Browser Local Storage")]
  API --> Express["Express /api routes"]
  Express --> ACL["JWT verification + current DB role"]
  ACL --> PG[("PostgreSQL users + todos tables")]
```

## HTTP data flow

```mermaid
sequenceDiagram
  actor User
  participant React as React + Context
  participant API as Express API
  participant DB as PostgreSQL
  User->>React: Enter username and password
  React->>API: POST /api/signin
  API->>DB: Find username + password hash
  DB-->>API: User and role
  API-->>React: Signed JWT
  React->>API: GET /api/me (Bearer token)
  API->>DB: Verify active account + role
  API-->>React: User and capabilities
  React->>API: GET /api/todo (Bearer token)
  API->>DB: Read tasks
  DB-->>API: Saved tasks
  API-->>React: JSON task list
  User->>React: Add / complete / delete
  React->>API: POST / PUT / DELETE with Bearer token
  API->>DB: Check role + write task
  API-->>React: Result
  React->>API: GET /api/todo (refresh after change)
```

## File responsibilities

| File | Purpose |
| --- | --- |
| `src/main.jsx` | Mount app, global providers, and Mantine styles |
| `src/App.jsx` | Authentication gate and page routing |
| `src/Context/Settings/Settings.jsx` | Phase 1/2 settings and Local Storage |
| `src/Context/Auth/Auth.jsx` | Phase 3/4 session and capabilities |
| `src/Components/Auth/Auth.jsx` | Hide unauthorized UI actions |
| `src/Components/Login/Login.jsx` | Registration and sign-in form |
| `src/Components/ToDo/ToDo.jsx` | Fetch and mutate tasks through API |
| `src/Components/List/List.jsx` | Filter/sort/paginate task cards |
| `src/Components/SettingsForm/SettingsForm.jsx` | User preference editor |
| `src/Components/Header/Header.jsx` | Navigation and logout |
| `src/Components/Footer/Footer.jsx` | Footer |
| `src/utils/tasks.js` | Pure pagination/sorting/filtering helpers |
| `src/services/api.js` | HTTP requests with Bearer token |
| `src/styles.css` | Responsive styles and visual details |
| `server/src/index.js` | API endpoints and middleware |
| `server/src/db.js` | PostgreSQL pool, tables, optional admin seed |
| `server/src/auth.js` | Server-side JWT validation and ACL |
| `server/src/validation.js` | Input validation |
| `server/src/api.test.js` | Backend ACL and input validation tests |

## Capability matrix

| Role | Read | Create | Update | Delete |
| --- | :---: | :---: | :---: | :---: |
| Reader | ✓ | — | — | — |
| Writer | ✓ | ✓ | — | — |
| Editor (signup default) | ✓ | ✓ | ✓ | — |
| Admin (server-seeded) | ✓ | ✓ | ✓ | ✓ |

**Security note:** A React `<Auth />` component only hides controls. The Express `requireCapability()` middleware performs the actual authorization on every protected endpoint. A signed JWT does not determine ongoing capabilities by itself; the server looks up the current user role each request.

**Cookie note:** To meet the class lab, the client stores the Bearer token in a JavaScript-readable cookie. A hardened production design should use an HttpOnly Secure server-set session cookie (and account for CSRF as appropriate), HTTPS, rotation/revocation, and a stronger overall operational security policy.
