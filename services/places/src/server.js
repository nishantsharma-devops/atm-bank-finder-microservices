const express = require("express");
const cors = require("cors");
const { places, distanceInKm, normalizeCoordinates } = require("@atm-finder/shared");

const app = express();
const port = Number(process.env.PLACES_PORT || 3001);

app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ service: "places-service", status: "ok" });
});

app.get("/places/nearby", (req, res) => {
  try {
    const { lat, lng } = normalizeCoordinates(req.query.lat, req.query.lng);
    const radius = Number(req.query.radius || 6);
    const type = (req.query.type || "all").toLowerCase();

    const results = places
      .filter((place) => type === "all" || place.type === type)
      .map((place) => ({
        ...place,
        distanceKm: Number(distanceInKm(lat, lng, place.lat, place.lng).toFixed(2))
      }))
      .filter((place) => place.distanceKm <= radius)
      .sort((first, second) => first.distanceKm - second.distanceKm);

    res.json({
      query: { lat, lng, radius, type },
      total: results.length,
      results
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`places-service listening on port ${port}`);
});
