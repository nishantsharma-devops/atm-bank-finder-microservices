const express = require("express");
const cors = require("cors");

const app = express();
const port = Number(process.env.REALTIME_PORT || 3003);
const placesServiceUrl = process.env.PLACES_SERVICE_URL || "http://localhost:3001";

app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ service: "realtime-service", status: "ok" });
});

app.get("/realtime/stream", async (req, res) => {
  const params = new URLSearchParams({
    lat: req.query.lat || "",
    lng: req.query.lng || "",
    radius: req.query.radius || "6",
    type: req.query.type || "all"
  });

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  async function publishSnapshot() {
    try {
      const response = await fetch(`${placesServiceUrl}/places/nearby?${params.toString()}`);
      const payload = await response.json();
      res.write(`event: places\n`);
      res.write(`data: ${JSON.stringify({ generatedAt: new Date().toISOString(), ...payload })}\n\n`);
    } catch (error) {
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ message: "Realtime refresh failed.", detail: error.message })}\n\n`);
    }
  }

  const interval = setInterval(publishSnapshot, 15000);
  publishSnapshot();

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(port, () => {
  console.log(`realtime-service listening on port ${port}`);
});
