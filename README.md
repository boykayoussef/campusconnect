# CampusConnect

**Author:** Youssef Mostafa  
**Project:** CampusConnect — AI-Enhanced Campus Community Platform

CampusConnect is a full-stack MERN application for university students, club leaders, and administrators to discover campus events, create and manage club activities, RSVP, manage registrations, and administer the platform.

## Assignment coverage

This repository implements the requirements from the GIU Software Engineering project brief and Task 2 specification: MERN architecture, Mongoose User/Event/Registration schemas, JWT authentication, bcrypt password hashing, server-side RBAC and ownership checks, event CRUD, registration rules, Hugging Face event classification, React routing/state/API integration, responsive UI, Postman testing, seed data, and setup documentation.

## Features

### Authentication
- Student and club-leader registration
- Club leaders begin as `pending` and require admin approval
- JWT login/session persistence
- bcrypt password hashing
- Password excluded from API responses
- Client-side logout by discarding the token

### Student
- Browse approved/open events
- Keyword search and category/type filters
- View complete event details and remaining capacity
- RSVP with optional note
- View registration history
- Cancel registrations
- Manage name, bio, and profile picture

### Club Leader
- Requires admin approval before publishing events
- Create events with title, club, description, requirements, location, date, type, capacity, and status
- AI assigns the event category
- View, edit, and delete only owned events
- View registrants for owned events
- Confirm or cancel registration statuses

### Admin
- View/filter all users
- Approve or reject pending club leaders
- Change user roles
- View platform events
- Remove events
- Full backend authorization on administrative endpoints

### Business rules
- Duplicate RSVP prevention through a unique `{ user, event }` index
- Closed/full events reject new registrations
- Past events reject registration
- Capacity is enforced server-side
- Ownership is enforced server-side
- Centralized JSON error responses
- Required fields return HTTP 400 instead of crashing

### AI classification
Event creation sends title/description to Hugging Face `facebook/bart-large-mnli` with candidate categories including Academic, Sports, Arts, Technology, Social, Career, Volunteering, and Other. A safe `Other` fallback is used when no token is configured or the external service fails.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| AI | Hugging Face Inference API |
| API Testing | Postman |
| Version Control | Git / GitHub |

## Project Structure

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
│   ├── seedDemoData.js
│   └── server.js
├── postman/
├── docs/
├── .gitignore
└── README.md
```

## Setup

### Prerequisites

- Node.js LTS
- npm
- MongoDB Community Server or MongoDB Atlas
- Git

### Backend

```bash
git clone https://github.com/boykayoussef/campusconnect.git
cd campusconnect/server
npm install
```

Copy `server/.env.example` to `server/.env` and set your local MongoDB URI and JWT secret.

```bash
npm run seed:admin
npm run seed:demo
npm start
```

The API runs at `http://localhost:5000`.

### Frontend

In a second terminal:

```bash
cd campusconnect/client
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

### Server

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campusconnect
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
HF_API_TOKEN=
```

### Client

```text
VITE_API_URL=http://localhost:5000/api
```

Real secrets must never be committed. `.gitignore` excludes `.env` while keeping `.env.example` files.

## Demo test accounts

After `npm run seed:demo`:

```text
Admin
Email: admin@campusconnect.local
Password: Admin123!

Approved Club Leader
Email: leader@campusconnect.local
Password: Leader123!

Student
Email: student@campusconnect.local
Password: Student123!
```

The demo seed creates eight realistic future events, including **AI Study Jam**, and uses upserts so repeated seeding does not create duplicates.

## API

The complete API surface is documented in [`docs/API-Documentation.md`](docs/API-Documentation.md), including:

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/me`
- `/api/users/profile`
- `/api/users`
- `/api/users/:id/status`
- `/api/users/:id/role`
- `/api/events`
- `/api/events/:id`
- `/api/events/mine`
- `/api/registrations`
- `/api/registrations/my`
- `/api/registrations/event/:id`
- `/api/registrations/:id`
- `/api/health`

Import `postman/CampusConnect.postman_collection.json` for API testing.

## Version control

The repository is maintained as a Git project. Meaningful feature commits are used for Task 2 work, with the main branch containing the completed submission.

## Documentation

- [API Documentation](docs/API-Documentation.md)
- [Setup and Installation](docs/Setup-and-Installation.md)
- [Project Structure](docs/Project-Structure.md)

## Author

**Youssef Mostafa**

CampusConnect — GIU Software Engineering Project, Summer 2026 Round II

GitHub: https://github.com/boykayoussef/campusconnect
