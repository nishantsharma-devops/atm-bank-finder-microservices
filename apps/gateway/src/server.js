const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = Number(process.env.GATEWAY_PORT || 3000);
const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:3004";
const placesServiceUrl = process.env.PLACES_SERVICE_URL || "http://localhost:3001";
const locationServiceUrl = process.env.LOCATION_SERVICE_URL || "http://localhost:3002";
const realtimeServiceUrl = process.env.REALTIME_SERVICE_URL || "http://localhost:3003";
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

app.use(express.json());

async function proxyJson(res, targetUrl) {
  const response = await fetch(targetUrl);
  const payload = await response.text();
  res.status(response.status).type(response.headers.get("content-type") || "application/json").send(payload);
}

async function proxyRequest(req, res, targetUrl, options = {}) {
  const response = await fetch(targetUrl, {
    method: options.method || req.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization || ""
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const payload = await response.text();
  res.status(response.status).type(response.headers.get("content-type") || "application/json").send(payload);
}

app.get("/api/health", async (_req, res) => {
  try {
    const [auth, places, location, realtime] = await Promise.all([
      fetch(`${authServiceUrl}/health`).then((response) => response.json()),
      fetch(`${placesServiceUrl}/health`).then((response) => response.json()),
      fetch(`${locationServiceUrl}/health`).then((response) => response.json()),
      fetch(`${realtimeServiceUrl}/health`).then((response) => response.json())
    ]);

    res.json({
      gateway: "ok",
      services: [auth, places, location, realtime]
    });
  } catch (error) {
    res.status(500).json({ gateway: "degraded", detail: error.message });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  await proxyRequest(req, res, `${authServiceUrl}/auth/signup`, {
    method: "POST",
    body: req.body
  });
});

app.post("/api/auth/login", async (req, res) => {
  await proxyRequest(req, res, `${authServiceUrl}/auth/login`, {
    method: "POST",
    body: req.body
  });
});

app.get("/api/auth/me", async (req, res) => {
  await proxyRequest(req, res, `${authServiceUrl}/auth/me`);
});

app.get("/api/places/summary", async (_req, res) => {
  const targetUrl = `${placesServiceUrl}/places/summary`;
  await proxyJson(res, targetUrl);
});

app.get("/api/places/nearby", async (req, res) => {
  const targetUrl = `${placesServiceUrl}/places/nearby?${new URLSearchParams(req.query).toString()}`;
  await proxyJson(res, targetUrl);
});

app.get("/api/location/context", async (req, res) => {
  const targetUrl = `${locationServiceUrl}/location/context?${new URLSearchParams(req.query).toString()}`;
  await proxyJson(res, targetUrl);
});

app.get("/api/realtime/stream", async (req, res) => {
  const response = await fetch(`${realtimeServiceUrl}/realtime/stream?${new URLSearchParams(req.query).toString()}`);

  res.writeHead(response.status, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    res.write(Buffer.from(value));
  }

  res.end();
});

app.get("*", (_req, res) => {
  if (fs.existsSync(path.join(frontendDistPath, "index.html"))) {
    res.sendFile(path.join(frontendDistPath, "index.html"));
    return;
  }

  res.status(200).json({
    message: "Gateway is running. Start the React client on http://localhost:5173 for development."
  });
});

app.listen(port, () => {
  console.log(`gateway listening on port ${port}`);
});
