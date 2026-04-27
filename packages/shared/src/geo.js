function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceInKm(lat1, lng1, lat2, lng2) {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function normalizeCoordinates(lat, lng) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw new Error("Latitude and longitude must be valid numbers.");
  }

  return {
    lat: Number(latitude.toFixed(6)),
    lng: Number(longitude.toFixed(6))
  };
}

module.exports = {
  distanceInKm,
  normalizeCoordinates
};
