# VolunteerOS Backend

Express + TypeScript + PostgreSQL API covering every sidebar feature:
Dashboard, Volunteers, Events, Organizations, Attendance, Certificates,
Analytics, Leaderboard, Chatbot, Settings.

## 1. Install dependencies

```
cd backend
npm install
```

## 2. Set up the database

1. Create a free project at https://supabase.com (or use any Postgres instance).
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (Supabase: Project
   Settings -> Database -> Connection string -> URI) and a random `JWT_SECRET`.
3. Load the schema:
   ```
   psql "$DATABASE_URL" -f src/db/schema.sql
   ```
   (No `psql` installed? Paste the contents of `src/db/schema.sql` into the
   Supabase SQL Editor and run it instead.)

## 3. Run the API

```
npm run dev
```

Server starts on `http://localhost:4000`. Health check: `GET /health`.

## 4. Auth flow

1. `POST /api/auth/signup` — `{ name, email, password, role }` -> `{ token, user }`
2. `POST /api/auth/login` — `{ email, password }` -> `{ token, user }`
3. Send `Authorization: Bearer <token>` on every other request.

## 5. Routes (one file per sidebar item)

| Sidebar item  | Base path             | File                          |
|---------------|------------------------|-------------------------------|
| Dashboard     | `/api/dashboard`       | `routes/dashboard.routes.ts`  |
| Volunteers    | `/api/volunteers`      | `routes/volunteers.routes.ts` |
| Events        | `/api/events`          | `routes/events.routes.ts`     |
| Organizations | `/api/organizations`   | `routes/organizations.routes.ts` |
| Attendance    | `/api/attendance`      | `routes/attendance.routes.ts` |
| Certificates  | `/api/certificates`    | `routes/certificates.routes.ts` |
| Analytics     | `/api/analytics`       | `routes/analytics.routes.ts`  |
| Leaderboard   | `/api/leaderboard`     | `routes/leaderboard.routes.ts`|
| Chatbot       | `/api/chatbot`         | `routes/chatbot.routes.ts`    |
| Settings      | `/api/settings`        | `routes/settings.routes.ts`   |

## 6. Connecting the frontend

The Next.js app currently reads from mock data in `volunteeros-ai/data/`.
Next step: replace those with `fetch` calls to `http://localhost:4000/api/...`,
storing the JWT (e.g. in an httpOnly cookie or `localStorage` for local dev)
and attaching it as a Bearer token.

## Not done yet (intentionally, to keep this a real starting point)

- Redis caching layer (add when a specific endpoint needs it)
- Real AI responses in `/api/chatbot` (currently echoes a placeholder reply)
- Rate limiting / request logging middleware
- Automated tests
