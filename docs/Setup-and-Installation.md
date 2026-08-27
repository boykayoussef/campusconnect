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

Create `server/.env` from `server/.env.example`.

Then run:

```bash
npm run seed:admin
npm start
```

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

Backend variables are documented in `server/.env.example`. Frontend variables are documented in `client/.env.example`.

Do not commit real `.env` files or secrets.

## Admin Seed

Run `npm run seed:admin` from `server` to create the development administrator account.
