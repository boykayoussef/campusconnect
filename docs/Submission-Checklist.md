# CampusConnect Submission Checklist

**Author:** Youssef Mostafa

## Task 1 / Task 2 coverage

- [x] GitHub repository with backend and frontend
- [x] README and `.gitignore`
- [x] User, Event, and Registration Mongoose schemas
- [x] MongoDB/Mongoose backend connection
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
- [x] Postman API collection at `docs/CampusConnect.postman_collection.json`
- [x] Local setup and demo seed instructions
- [x] Safe `.env.example` with no real credentials

## Demo data

Run from `backend/`:

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

## Final manual checks

- [ ] Run `npm install` and `npm start` successfully with a valid MongoDB connection.
- [ ] Run the Postman collection against the local API.
- [ ] Verify all three roles end-to-end.
- [ ] Verify responsive frontend behavior on desktop and mobile widths.
- [ ] Verify each team member has a meaningful Task 2 commit and at least one reviewed Pull Request, as required by the course brief.
- [ ] If claiming deployment bonus, verify both live frontend and backend URLs work end-to-end and document them in `README.md`.
