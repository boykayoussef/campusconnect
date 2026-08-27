# CampusConnect API Documentation

**Author:** Youssef Mostafa

Base URL: `http://localhost:5000/api`

Authentication uses `Authorization: Bearer <JWT>` on private endpoints. Errors use `{ "success": false, "message": "..." }`.

## Authentication

- `POST /auth/register` — public registration for `student` or `clubLeader`. Club leaders start as `pending`.
- `POST /auth/login` — public login; returns JWT.
- `GET /auth/me` — private current-user profile.

## Users

- `GET /users/profile` — private own profile.
- `PUT /users/profile` — private update own name, bio, or profile picture.
- `GET /users` — admin list users; supports `?role=` and `?status=` filters.
- `PUT /users/:id/status` — admin approve/reject/pending club leader.
- `PUT /users/:id/role` — admin change role to `student`, `clubLeader`, or `admin`.

## Events

- `POST /events` — approved club leader creates an event; category is assigned by Hugging Face.
- `GET /events` — public event feed; supports `category`, `type`, `status`, and `q` search/filter parameters.
- `GET /events/:id` — public event details, host and remaining slots.
- `PUT /events/:id` — owner/admin update event; description changes trigger reclassification.
- `DELETE /events/:id` — owner/admin delete event and its registrations.
- `GET /events/my/created` — authenticated club leader/admin list of created events. `/events/mine` remains as a compatibility alias.

## Registrations

- `POST /registrations` — student RSVP with optional note.
- `GET /registrations/my` — authenticated registration history with event details.
- `GET /registrations/event/:id` — event owner/admin list registrants.
- `PUT /registrations/:id` — event owner/admin, or the student who owns the registration, may change status to `pending`, `confirmed`, or `cancelled` according to role permissions.
- `DELETE /registrations/:id` — student who owns the registration or admin cancels it.

## Server-side business rules

1. `{ user, event }` has a compound unique index, preventing duplicate registrations.
2. Closed or full events reject new registrations.
3. Past events reject registration.
4. Pending/rejected club leaders cannot create events.
5. Club leaders can only edit/delete their own events and view their own event registrants.
6. Club leaders can only change registration statuses for registrations belonging to their own events.
7. Authentication and role/ownership checks are enforced in backend middleware/controllers, not only in React.
8. Required event fields are validated with HTTP 400 responses.

## Health

`GET /health` returns API status without requiring a database-backed route.

```json
{
  "success": true,
  "message": "CampusConnect API is running"
}
```

## Hugging Face integration

The backend sends event title/description text to `facebook/bart-large-mnli` with candidate categories including Academic, Sports, Arts, Technology, Social, Career, Volunteering, and Other. If no token is configured or the service fails, the application safely falls back to `Other`.

## Postman

Import `postman/CampusConnect.postman_collection.json` for the API test collection.
