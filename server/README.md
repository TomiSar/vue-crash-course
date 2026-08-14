# Backend (Express + MongoDB)

Quick backend for the Vue Jobs project.

Setup

1. Install dependencies

```bash
cd server
npm install
```

2. Create `.env` from `.env.example` and set `MONGO_URI`.

3. Start the server

```bash
npm run dev
```

Server runs on `http://localhost:5000` and exposes REST endpoints under `/jobs`.

Note: the Vite dev proxy rewrites client `/api` requests to the backend, so the frontend can continue to call `/api/jobs`.
