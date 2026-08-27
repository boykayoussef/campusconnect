# CampusConnect

CampusConnect is a MERN-stack university events and registration platform for students, club leaders, and administrators.

## Stack
- React + Vite frontend
- Node.js + Express backend
- MongoDB + Mongoose
- JWT authentication and bcrypt password hashing
- Hugging Face event classification

## Local setup

### Backend
```bash
cd server
npm install
npm run seed:admin
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173.

The API runs on http://localhost:5000. MongoDB defaults to `mongodb://127.0.0.1:27017/campusconnect`.

Create `server/.env` from `server/.env.example` and `client/.env` from `client/.env.example` before running.

## Demo admin
Email: `admin@campusconnect.local`
Password: `Admin123!`

## Repository
https://github.com/boykayoussef/campusconnect
