# Setup and Installation

**Author:** Youssef Mostafa

## Requirements

- Node.js LTS
- npm
- MongoDB Community Server or MongoDB Atlas
- Git

## Backend

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example`. Never commit the real `.env` file.

```bash
npm run seed:admin
npm run seed:demo
npm start
```

The API runs on `http://localhost:5000`. The server connects to MongoDB before it starts listening.

## Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Demo accounts

The demo seed currently creates:

- Admin: `admin@campusconnect.local` / `Admin123!`
- Approved club leader: `leader@campusconnect.local` / `Leader123!`
- Student: `student@campusconnect.local` / `Student123!`

These are local/demo credentials only. Do not use them for a production deployment.

The demo seed creates eight future events and uses upserts so rerunning it does not duplicate event titles.

## Environment variables

Backend: `PORT`, `MONGODB_URI` (or `MONGO_URI`), `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, optional `HF_API_TOKEN`, plus `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` for the admin seed.

Frontend: `VITE_API_URL=http://localhost:5000/api` for separate local servers. When the frontend and API are served from the same origin, the API service defaults to `/api` when `VITE_API_URL` is not provided.

## API testing

Import `docs/CampusConnect.postman_collection.json` into Postman. Set `baseUrl` to `http://localhost:5000/api` and provide a JWT in the `token` variable for protected requests.

## Deployment

Deployment is optional for the Task 2 bonus. If deploying, use MongoDB Atlas and provide MongoDB/JWT/Hugging Face secrets through the hosting provider's environment-variable settings. Never commit real credentials to GitHub.
