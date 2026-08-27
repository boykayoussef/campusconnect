# CampusConnect Submission Checklist

**Author:** Youssef Mostafa

## Task 1 / Task 2 coverage

- [x] GitHub repository with backend and frontend
- [x] README and `.gitignore`
- [x] User, Event, and Registration Mongoose schemas
- [x] JWT authentication and bcrypt password hashing
- [x] Server-side role-based authorization and ownership checks
- [x] User profile CRUD requirements
- [x] Event create/read/update/delete and discovery filters
- [x] Hugging Face category classification service
- [x] Registration/RSVP flow and duplicate prevention
- [x] Capacity, closed-event, and past-event rules
- [x] Club leader approval workflow
- [x] Registrant confirmation/cancellation
- [x] Admin user status/role management and event removal
- [x] React protected routing and persisted JWT session
- [x] Loading, empty, and error states on major data views
- [x] Postman API collection
- [x] Local setup and demo seed instructions

## Demo data

Run from `server/`:

```bash
npm run seed:demo
```

The seed creates an admin, an approved club leader, a student, and eight future events without duplicating existing event titles.

## Test accounts

```text
Admin: admin@campusconnect.local / Admin123!
Club Leader: leader@campusconnect.local / Leader123!
Student: student@campusconnect.local / Student123!
```

Do not use these credentials for production.
