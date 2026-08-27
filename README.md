# CampusConnect

**Author:** Youssef Mostafa  
**Project:** CampusConnect — University Event Management Platform

CampusConnect is a full-stack MERN application for managing university events, registrations, club-led activities, and administrative approval workflows. The system is designed around role-based access for **Students, Club Leaders, and Administrators**.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [System Architecture](#system-architecture)
- [API Overview](#api-overview)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Security](#security)
- [Author](#author)

## Overview

CampusConnect provides a central place for university communities to discover events, register for activities, create and manage club events, and administer the platform. The implementation follows the project requirements for authentication, authorization, event CRUD, registration rules, administration, and automated event-category classification.

## Features

### Authentication and Authorization

- User registration and login
- JWT-based authentication
- bcrypt password hashing
- Role-based access control
- Protected frontend routes
- Student, Club Leader, and Admin roles

### Event Management

- Browse upcoming university events
- Search and filter events
- View event details
- Create, update, and delete events according to role permissions
- Event capacity management
- Event-category classification using Hugging Face integration

### Registration / RSVP

- Students can register for events
- Prevents duplicate registrations
- Prevents registration for past events
- Enforces event capacity
- Users can view their registrations
- Club Leaders can view registrants for their events

### Administration

- Admin dashboard
- Club Leader approval workflow
- User/profile administration
- Role-aware access to administrative operations

### Developer Resources

- REST API
- MongoDB/Mongoose persistence
- Postman collection
- Environment-variable examples
- Local development configuration
- Responsive React interface

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Classification | Hugging Face API |
| API Testing | Postman |
| Version Control | Git / GitHub |

## User Roles

| Role | Main Permissions |
|---|---|
| Student | Browse events, view details, register/RSVP, manage profile, view registrations |
| Club Leader | Create/manage own events, view event registrants, manage profile |
| Admin | Administrative dashboard, approve club leaders, manage administrative functions |

## Project Structure

```text
CampusConnect/
├── client/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/             # Shared UI components
│   │   ├── context/                # Authentication state
│   │   └── pages/                  # Application pages
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Node.js + Express backend
│   ├── config/                     # Database configuration
│   ├── controllers/                # Request/business controllers
│   ├── middleware/                 # Auth and error middleware
│   ├── models/                     # Mongoose models
│   ├── routes/                     # REST API routes
│   ├── services/                   # External/API services
│   ├── .env.example
│   ├── package.json
│   ├── seedAdmin.js
│   └── server.js
│
├── postman/                        # API testing collection
├── docs/                           # Project documentation
├── .gitignore
└── README.md
```

## System Architecture

```text
React Frontend
      │
      │ HTTP / JSON
      ▼
Express REST API
      │
      ├── JWT Authentication
      ├── Role-Based Authorization
      ├── Event / Registration Logic
      ├── Hugging Face Classification
      │
      ▼
MongoDB / Mongoose
```

## API Overview

The backend exposes REST endpoints grouped around:

- `/api/auth` — registration and login
- `/api/users` — profile and user operations
- `/api/events` — event CRUD, search, and event management
- `/api/registrations` — RSVP/registration operations
- `/api/health` — API health check

A complete Postman collection is included in `postman/`.

See the detailed documentation in [`docs/API-Documentation.md`](docs/API-Documentation.md).

## Setup and Installation

### Prerequisites

- Node.js LTS
- npm
- MongoDB Community Server or MongoDB Atlas
- Git

### 1. Clone the repository

```bash
git clone https://github.com/boykayoussef/campusconnect.git
cd campusconnect
```

### 2. Configure the backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and configure the values.

### 3. Configure the frontend

```bash
cd ../client
npm install
```

Copy `client/.env.example` to `client/.env`.

## Environment Variables

### Backend

```text
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campusconnect
JWT_SECRET=replace_with_a_secure_secret
CLIENT_URL=http://localhost:5173
HF_API_KEY=your_hugging_face_api_key
```

### Frontend

```text
VITE_API_URL=http://localhost:5000/api
```

**Never commit real `.env` files or API secrets to GitHub.**

## Running the Application

### Start the backend

```bash
cd server
npm install
npm run seed:admin
npm start
```

The API runs at:

```text
http://localhost:5000
```

### Start the frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

### Demo Admin

The development seed command creates:

```text
Email: admin@campusconnect.local
Password: Admin123!
```

Change credentials/secrets for any real deployment.

## Testing

### API Testing

Import the Postman collection from:

```text
postman/CampusConnect-API.json
```

### Health Check

Open:

```text
http://localhost:5000/api/health
```

### Frontend Build

```bash
cd client
npm run build
```

## Security

- Passwords are hashed with bcryptjs.
- Authentication uses signed JWT tokens.
- Protected endpoints use authorization middleware.
- Role checks prevent unauthorized operations.
- Environment secrets are excluded from version control.
- Registration rules are enforced by the backend rather than only the UI.

## Documentation

- [API Documentation](docs/API-Documentation.md)
- [Setup and Installation](docs/Setup-and-Installation.md)
- [Project Structure](docs/Project-Structure.md)

## Author

**Youssef Mostafa**

CampusConnect — University Software Project

GitHub: https://github.com/boykayoussef/campusconnect
