# CampusConnect

**Author:** Youssef Mostafa  
**Application:** CampusConnect — AI-Enhanced Campus Community Platform

CampusConnect is a university event and community platform. The current implementation uses **React / React Native**, a **Node.js + Express REST API**, and **PostgreSQL hosted by Supabase**.

## Architecture

```text
React web / React Native mobile
             |
             | REST + JSON + JWT
             v
      Node.js + Express
             |
             | parameterized SQL
             v
       Supabase PostgreSQL
```

## Main features

### Students
- Register and login with bcrypt-hashed passwords
- Browse public upcoming events
- Search and filter events
- View event details and remaining capacity
- RSVP and prevent duplicate registration
- Prevent RSVP to closed, full, or past events
- View and cancel own registrations
- Update own profile

### Guest users (mobile)
- Enter the app without an account
- Browse events immediately
- Save RSVPs locally on the device
- Later open Login / Create Account from Profile
- Guest mode never bypasses protected server operations

### Club Leaders
- Register as a Club Leader and wait for Admin approval
- Create events only after approval
- View, edit and delete only their own events
- View registrants for their own events
- Confirm/cancel registrations for their events
- Automatic AI category classification with a deterministic fallback

### Admins
- View/filter users
- Approve or reject Club Leader applications
- Change user roles/status
- Remove any event
- View platform summary data
- Full RBAC is enforced by Express middleware, not only by the UI

## Database

Supabase PostgreSQL contains:

- `users`
- `events`
- `registrations`
- `event_capacity` view

Migrations:

- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_registration_note.sql`

## Technology stack

| Layer | Technology |
|---|---|
| Web frontend | React + Vite + React Router |
| Mobile | React Native + Expo |
| Backend | Node.js + Express |
| Database | PostgreSQL + Supabase |
| Authentication | JWT + bcryptjs |
| AI classification | Optional Hugging Face + local fallback |
| API testing | Postman |
| Version control | GitHub |

## Course / lecture alignment

The implementation follows the concepts emphasized in the CSEN406 lectures: separated presentation/business/data tiers, Express routes and middleware, HTTP CRUD methods, environment variables, React components and JSX, React state/hooks, React Router, event handling, and Axios/REST API communication. The frontend uses reusable components and routed views, while the backend exposes REST endpoints and centralized error handling.

The supplied project brief requires secure authentication, role-based authorization, CRUD operations for users/events/registrations, event ownership rules, capacity/duplicate-RSVP rules, and all three user roles. Those flows are implemented server-side here. The project has been adapted to the **PERN/Supabase PostgreSQL setup already used in this repository**, rather than replacing the existing CampusConnect application with a different project.

## Local setup

### 1. Clone

```bash
git clone https://github.com/boykayoussef/campusconnect.git
cd campusconnect
```

### 2. Supabase database

Run both SQL migrations in the Supabase SQL Editor, in order.

### 3. Backend

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example` and fill in your private values:

```env
PORT=5000
DATABASE_URL=postgresql://postgres.<project-ref>:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
JWT_SECRET=use-a-long-random-secret
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@campusconnect.local
ADMIN_PASSWORD=use-a-strong-admin-password
HUGGINGFACE_API_KEY=
```

**Never commit `backend/.env`.**

Start the API:

```bash
npm start
```

Health check:

```text
http://localhost:5000/api/health
```

Create/update the admin account when needed:

```bash
npm run seed:admin
```

### 4. Demo data

```bash
npm run seed:demo
```

The seed creates realistic upcoming CampusConnect events and demo users. Check `backend/seedDemoData.js` for the current demo credentials instead of putting credentials in documentation.

### 5. React Native / Expo

```bash
cd ../mobile
npm install
```

For a physical phone create `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:5000/api
```

Keep the phone and computer on the same Wi-Fi network. Start Expo:

```bash
npx expo start
```

Scan the QR code with Expo Go.

### 6. React web frontend

```bash
cd ../frontend
npm install
npm run dev
```

The Vite development server normally runs on port 5173.

## API surface

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/PUT /api/users/profile`
- `GET /api/users` (admin)
- `PUT/PATCH /api/users/:id/status` (admin)
- `PUT/PATCH /api/users/:id/role` (admin)
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events` (approved club leader)
- `PUT/PATCH /api/events/:id`
- `DELETE /api/events/:id`
- `GET /api/events/my/created`
- `POST /api/registrations` (student)
- `GET /api/registrations/my` (student)
- `GET /api/registrations/status/:eventId` (student)
- `GET /api/registrations/event/:id` (owner/admin)
- `PUT /api/registrations/:id` (owner/admin)
- `DELETE /api/registrations/:id` (student/admin)
- `GET /api/admin/summary` (admin)

## Testing checklist

Before submission, test the following end-to-end flows:

1. Student registration and login.
2. Student profile update.
3. Club Leader registration -> pending status -> Admin approval.
4. Approved Club Leader creates an event.
5. Public event feed/search/filter/detail.
6. Student RSVP succeeds once and duplicate RSVP is rejected.
7. Full/closed/past event RSVP is rejected.
8. Club Leader sees only their event registrants.
9. Club Leader cannot edit/delete another leader's event.
10. Admin can approve/reject users and remove events.
11. Mobile guest can browse and save a local RSVP, then login later.
12. `/api/health` reports the database as connected.

## Security notes

- Passwords are hashed with bcrypt and are never returned in API responses.
- JWT protects private routes.
- Role and ownership checks are enforced server-side.
- SQL queries are parameterized.
- Duplicate registrations are prevented by a database unique constraint.
- Capacity checks are performed in a database transaction.
- `.env` files are ignored by Git.

## Author

**Youssef Mostafa**  
GitHub: https://github.com/boykayoussef/campusconnect
