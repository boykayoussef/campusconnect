# Project Structure

**Author:** Youssef Mostafa

CampusConnect is separated into a React frontend and an Express backend, organized similarly to the reference software-project repository while preserving CampusConnect functionality.

```text
CampusConnect/
├── frontend/
│   ├── src/components/
│   ├── src/context/
│   ├── src/pages/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env.example
│   ├── package.json
│   ├── seedAdmin.js
│   ├── seedDemoData.js
│   └── server.js
│
├── api/index.js
├── postman/
├── docs/
├── package.json
├── vercel.json
├── .gitignore
└── README.md
```

## Frontend responsibilities

Navigation, authentication state, protected routes, event discovery/filtering, event details, RSVP, registration history, profile management, club-leader event management, registrants, and admin dashboard.

## Backend responsibilities

Authentication, authorization, MongoDB persistence, event CRUD and business rules, registration workflow, administration, centralized errors, and Hugging Face classification.

## Data layer

Mongoose models provide persistence and validation for User, Event, and Registration. The Registration schema has a compound unique index on `{ user, event }` to prevent duplicate RSVP records.
