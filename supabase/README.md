# Supabase setup

1. Open the Supabase project SQL Editor.
2. Run `migrations/001_initial_schema.sql`.
3. Copy the PostgreSQL connection string from Supabase Database settings. Keep the password private.
4. Put it in `backend/.env` as `DATABASE_URL`.
5. Set a private `JWT_SECRET` in `backend/.env`.
6. From `backend/`, run `npm install` then `npm run seed:demo`.

The seed creates demo accounts and the CampusConnect events. Do not commit `backend/.env`.

Demo accounts:

- Student: `student@campusconnect.local` / `Student123!`
- Club Leader: `leader@campusconnect.local` / `Leader123!`
- Admin: `admin@campusconnect.local` / `Admin123!`
