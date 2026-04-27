const express = require("express");
const cors = require("cors");
const { distanceInKm, normalizeCoordinates } = require("@atm-finder/shared");
const { Place, sequelize } = require("./store");

const app = express();
const port = Number(process.env.PLACES_PORT || 3001);

app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ service: "places-service", status: "ok", storage: "sequelize-sqlite" });
});

app.get("/places/nearby", async (req, res) => {
  try {
    const { lat, lng } = normalizeCoordinates(req.query.lat, req.query.lng);
    const radius = Number(req.query.radius || 6);
    const type = (req.query.type || "all").toLowerCase();

    const records = await Place.findAll({
      where: type === "all" ? {} : { type },
      order: [
        ["city", "ASC"],
        ["name", "ASC"]
      ]
    });

    const results = records
      .map((placeRecord) => {
        const place = placeRecord.toJSON();
        return {
          ...place,
          distanceKm: Number(distanceInKm(lat, lng, place.lat, place.lng).toFixed(2))
        };
      })
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

app.get("/places/summary", async (_req, res) => {
  const [total, atms, banks] = await Promise.all([
    Place.count(),
    Place.count({ where: { type: "atm" } }),
    Place.count({ where: { type: "bank" } })
  ]);

  res.json({
    service: "places-service",
    total,
    breakdown: [
      { type: "atm", count: atms },
      { type: "bank", count: banks }
    ]
  });
});

app.listen(port, async () => {
  await sequelize.authenticate();
  console.log(`places-service listening on port ${port}`);
});
