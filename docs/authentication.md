# Authentication

The API uses **Supabase Auth** (email/password) with application roles in
`user_roles`.

## Sign in

`POST /api/auth/sign-in`

```http
POST /api/auth/sign-in HTTP/1.1
Host: undp-drr-radar-api.netlify.app
Origin: https://drrtechradar.org
Content-Type: application/json

{"email":"admin@example.com","password":"your-password"}
```

Success (`200`):

```json
{
  "access_token": "<jwt>",
  "expires_at": 1710000000,
  "user": { "id": "<uuid>", "email": "admin@example.com", "role": "admin" }
}
```

Errors: `400` missing fields, `401` bad credentials, `403` no `user_roles` row.

Rate limit: **10 requests / minute / IP** (best-effort per function instance).

## Calling protected routes

Send the access token on every admin request:

```http
Authorization: Bearer <access_token>
```

The API validates the JWT with Supabase (`auth.getUser`) and requires
`user_roles.role = 'admin'` for `/api/admin/*` and `POST /api/auth/users`.

## Roles

| Role | Capabilities |
|------|----------------|
| `admin` | Full CRUD on projects, technologies, disaster types, disaster events; create users |
| `user` | Can sign in; no admin routes (reserved for future use) |

Roles are stored in `user_roles` and are **not** readable via the anon key
(see `supabase/migrations/20260914_public_read_rls.sql`).

## Frontend session

The SPA keeps the token in **sessionStorage** (`src/components/shared/helpers/auth.ts`).
`RequireAdmin` only hides UI; the API is the source of truth.

## Create user (admin)

`POST /api/auth/users` with Bearer admin token:

```json
{
  "email": "new@example.com",
  "password": "at-least-12-chars",
  "role": "admin"
}
```
