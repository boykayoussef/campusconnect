# Setup and Installation

**Author:** Youssef Mostafa

## Requirements

- Node.js LTS
- npm
- MongoDB Community Server or MongoDB Atlas
- Git

## Backend

```bash
cd server
npm install
```

Create `server/.env` from `server/.env.example`. Never commit the real `.env` file.

Start the API:

```bash
npm run seed:admin
npm run seed:demo
npm start
```

`seed:demo` creates the sample CampusConnect events and demo accounts without duplicating events when run again.

## Demo accounts

- Admin: `admin@campusconnect.local` / `Admin123!`
- Approved club leader: `leader@campusconnect.local` / `Leader123!`
- Student: `student@campusconnect.local` / `Student123!`

Change these credentials for any real deployment.

## Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## Local MongoDB

The default local database is:

`mongodb://127.0.0.1:27017/campusconnect`

## Environment Variables

Backend variables are documented in `server/.env.example`; frontend variables are documented in `client/.env.example`.

Backend uses `MONGODB_URI` (and supports `MONGO_URI` for compatibility), `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, and optional `HF_API_TOKEN`.

## API testing

Import `postman/CampusConnect.postman_collection.json` into Postman. Set `baseUrl` to `http://localhost:5000/api` and provide a JWT in the `token` variable for protected requests.
