const express = require("express");
const cors = require("cors");
const { normalizeCoordinates } = require("@atm-finder/shared");

const app = express();
const port = Number(process.env.LOCATION_PORT || 3002);

function inferCity(lat, lng) {
  if (lat > 28.35 && lat < 28.75 && lng > 76.95 && lng < 77.4) {
    return "Delhi NCR";
  }

  if (lat > 18.85 && lat < 19.3 && lng > 72.75 && lng < 72.98) {
    return "Mumbai";
  }

  if (lat > 12.85 && lat < 13.05 && lng > 77.5 && lng < 77.75) {
    return "Bengaluru";
  }

  if (lat > 18.43 && lat < 18.68 && lng > 73.72 && lng < 73.95) {
    return "Pune";
  }

  return "India";
}

app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ service: "location-service", status: "ok" });
});

app.get("/location/context", (req, res) => {
  try {
    const { lat, lng } = normalizeCoordinates(req.query.lat, req.query.lng);

    res.json({
      coordinates: { lat, lng },
      city: inferCity(lat, lng),
      zone: lat >= 20 ? "North" : "South/West",
      searchHint: "Keep location on for more relevant nearby ATM and bank suggestions."
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`location-service listening on port ${port}`);
});
