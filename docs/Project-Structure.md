# Project Structure

**Author:** Youssef Mostafa

CampusConnect is separated into a React frontend and an Express backend.

```text
CampusConnect/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env.example
│   ├── package.json
│   ├── seedAdmin.js
│   └── server.js
│
├── postman/
├── docs/
├── .gitignore
└── README.md
```

## Frontend Responsibilities

The React application handles navigation, authentication state, protected routes, event discovery, registration views, profile management, club-leader pages, registrants, and the admin dashboard.

## Backend Responsibilities

The Express application handles authentication, authorization, MongoDB persistence, event rules, registrations, administrative operations, and external classification integration.

## Data Layer

Mongoose models provide persistence and validation for users, events, and registrations.
