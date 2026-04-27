# ATM Bank Finder Microservices

Real-time ATM and bank finder web app with a more serious portfolio stack:

- `React + Vite` frontend
- `Node.js + Express` microservices
- `Sequelize + SQLite` database for development
- `SSE` realtime updates
- `JWT auth` for user flows
- API gateway pattern for service aggregation

The stack is intentionally structured so you can later swap SQLite for PostgreSQL and containerize the whole app for DevOps practice.

## Services

- `apps/frontend`: React client
- `apps/gateway`: API gateway and production asset host
- `services/auth`: login, signup, profile token validation
- `services/places`: ATM/bank search backed by Sequelize
- `services/location`: geolocation normalization and city metadata
- `services/realtime`: SSE stream for live updates
- `packages/shared`: shared geo utilities and seed data

## Features

- Current location search
- Login and signup flow
- Live map and result cards
- Radius and service-type filters
- Search by city, bank name, and free text
- Realtime stream refresh
- Service health visibility
- Database-backed place records

## Run Locally

1. Install dependencies

```bash
npm install
```

2. Prepare the database

```bash
npm run db:prepare
```

3. Start the full dev stack

```bash
npm run dev
```

4. Open the React frontend

```text
http://localhost:5173
```

The gateway API runs on `http://localhost:3000`.

## Production Build

Build the frontend:

```bash
npm run build
```

Then the gateway can serve the built frontend from `apps/frontend/dist`.

## Ports

- Frontend: `5173`
- Gateway: `3000`
- Auth service: `3004`
- Places service: `3001`
- Location service: `3002`
- Realtime service: `3003`

## API Summary

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/location/context?lat=28.6139&lng=77.2090`
- `GET /api/places/nearby?lat=28.6139&lng=77.2090&radius=6&type=all&q=sbi&city=Delhi%20NCR&bank=State%20Bank%20of%20India`
- `GET /api/realtime/stream?lat=28.6139&lng=77.2090&radius=6&type=all`

## Why This Stack

This version is closer to the kind of project you can discuss in interviews:

- frontend and backend are clearly separated
- a real ORM and database layer exists
- the architecture can evolve toward PostgreSQL, Redis, Docker, and Kubernetes
- realtime and API gateway concepts are already visible in the codebase
