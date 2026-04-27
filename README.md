# ATM Bank Finder Microservices

Real-time ATM and bank finder web application with a microservices-style architecture. The app gets the user's location, finds nearby ATMs and bank branches from a curated dataset, and streams live refreshes to the UI using Server-Sent Events.

## Services

- `apps/gateway`: frontend hosting and API gateway
- `services/places`: nearby ATM/bank search
- `services/location`: geolocation normalization and city metadata
- `services/realtime`: SSE stream for live updates
- `packages/shared`: shared dataset and geo utilities

## Features

- Current location based search
- Radius filter and type filters
- Live refresh stream
- MNC-style service separation for backend responsibilities
- Clean frontend with map, cards, and live service status

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start all services:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Ports

- Gateway: `3000`
- Places service: `3001`
- Location service: `3002`
- Realtime service: `3003`

## API Summary

- `GET /api/health`
- `GET /api/location/context?lat=28.6139&lng=77.2090`
- `GET /api/places/nearby?lat=28.6139&lng=77.2090&radius=6&type=all`
- `GET /api/realtime/stream?lat=28.6139&lng=77.2090&radius=6&type=all`

## Project Goal

This repo is designed as a practical portfolio project for microservices and future DevOps deployment work. You can later containerize the services, add CI/CD, and deploy them on AWS Lightsail, EC2, or ECS.
