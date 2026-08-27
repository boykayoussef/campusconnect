# CampusConnect

**Author:** Youssef Mostafa  
**Application:** CampusConnect — AI-Enhanced Campus Community Platform

CampusConnect is a university event and community mobile application built with **React Native + Expo**, a **Node.js + Express** API, and **PostgreSQL hosted by Supabase**.

## Architecture

```text
React Native / Expo
        |
        | REST + JWT
        v
Node.js + Express
        |
        | PostgreSQL
        v
Supabase PostgreSQL
```

## Main features

### Students
- Register and login
- Browse upcoming open events
- Search events by keyword
- Filter by category
- View complete event details and remaining capacity
- RSVP to an event
- Prevent duplicate RSVP
- Prevent RSVP to closed, full, or past events
- View registration history
- Cancel registrations
- Update profile

### Club Leaders
- Apply as a Club Leader
- Wait for Admin approval
- Create events after approval
- Event fields: title, club, description, requirements, location, date/time, type, capacity and category
- Automatic category classification with a safe local fallback
- View their created events
- View registrants
- Confirm/cancel registrations for their own events
- Edit/delete only their own events

### Admins
- View users
- Filter users by role/status through the API
- Approve/reject Club Leader applications
- Change user roles
- Manage platform users
- Full server-side RBAC

## Database

Supabase PostgreSQL contains:

- `users`
- `events`
- `registrations`
- `event_capacity` view

The migration is in `supabase/migrations/001_initial_schema.sql`.

## Technology stack

| Layer | Technology |
|---|---|
| Mobile | React Native, Expo |
| Backend | Node.js, Express |
| Database | PostgreSQL, Supabase |
| Authentication | JWT, bcryptjs |
| AI classification | Optional Hugging Face integration / local fallback |
| API testing | Postman |
| Version control | GitHub |

## Local setup

### 1. Clone

```bash
git clone https://github.com/boykayoussef/campusconnect.git
cd campusconnect
```

### 2. Supabase database

Run `supabase/migrations/001_initial_schema.sql` once in the Supabase SQL Editor.

### 3. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres.wtmuxoyhwieseufuovix:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
JWT_SECRET=replace-with-a-long-random-secret
HUGGINGFACE_API_KEY=
```

Never commit `.env` or database credentials.

Start the API:

```bash
npm start
```

Check:

```text
http://localhost:5000/api/health
```

### 4. Demo data

With the backend configured:

```bash
npm run seed:demo
```

The seed creates demo accounts and realistic upcoming CampusConnect events.

Demo accounts:

```text
Admin
admin@campusconnect.local
Admin123!

Approved Club Leader
leader@campusconnect.local
Leader123!

Student
student@campusconnect.local
Student123!
```

### 5. React Native / Expo

```bash
cd ../mobile
npm install
```

Create `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:5000/api
```

For Expo Web, `localhost` is normally fine. For a physical phone, use your computer's local IPv4 address and keep both devices on the same network.

Start Expo:

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `w` for web testing.

## Security

- Passwords are hashed with bcrypt.
- JWT is required for protected API operations.
- Roles are enforced on the server.
- Event ownership is enforced on the server.
- Duplicate registration is prevented by the database unique constraint.
- Capacity is checked server-side inside a transaction.
- Secrets are excluded from Git with `.gitignore`.

## Author

**Youssef Mostafa**

GitHub: https://github.com/boykayoussef/campusconnect
