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

The API runs on `http://localhost:5000`.

## Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Demo accounts

- Admin: `admin@campusconnect.local` / `Admin123!`
- Approved club leader: `leader@campusconnect.local` / `Leader123!`
- Student: `student@campusconnect.local` / `Student123!`

The demo seed creates eight future events and uses upserts so rerunning it does not duplicate event titles.

## Environment variables

Backend: `PORT`, `MONGODB_URI` (or `MONGO_URI`), `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, optional `HF_API_TOKEN`.

Frontend: `VITE_API_URL=http://localhost:5000/api` for separate local servers. In the Vercel same-origin setup, the API service defaults to `/api` when `VITE_API_URL` is not provided.

## API testing

Import `postman/CampusConnect.postman_collection.json` into Postman. Set `baseUrl` to `http://localhost:5000/api` and provide a JWT in the `token` variable for protected requests.

## Deployment

The repository includes `vercel.json` and `api/index.js` for the optional Vercel bonus deployment. MongoDB and secrets must be supplied through the hosting provider's environment variables; no real credentials belong in GitHub.
