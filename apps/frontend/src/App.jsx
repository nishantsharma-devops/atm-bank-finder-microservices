import { useEffect, useRef, useState } from "react";
import L from "leaflet";

const defaultCoords = { lat: 28.6139, lng: 77.209 };
const storedToken = window.localStorage.getItem("atmFinderToken");
const storedUser = window.localStorage.getItem("atmFinderUser");

function createUserIcon() {
  return L.divIcon({
    className: "user-pin",
    html: "<span></span>",
    iconSize: [18, 18]
  });
}

function createPlaceIcon(type) {
  return L.divIcon({
    className: `place-pin ${type}`,
    html: "<span></span>",
    iconSize: [18, 18]
  });
}

export default function App() {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const placeMarkersRef = useRef([]);
  const eventSourceRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [type, setType] = useState("all");
  const [radius, setRadius] = useState("6");
  const [searchText, setSearchText] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [bankFilter, setBankFilter] = useState("");
  const [serviceStatus, setServiceStatus] = useState("Checking services...");
  const [streamStatus, setStreamStatus] = useState("Stream idle");
  const [authMode, setAuthMode] = useState("login");
  const [authToken, setAuthToken] = useState(storedToken || "");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "demo@atmfinder.dev",
    password: "demo1234"
  });
  const [cityMeta, setCityMeta] = useState({
    city: "Waiting for location",
    hint: "Allow location access to get nearby suggestions.",
    zone: ""
  });
  const [summary, setSummary] = useState({ total: 0, breakdown: [] });
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const map = L.map(mapNodeRef.current, {
      zoomControl: false
    }).setView([defaultCoords.lat, defaultCoords.lng], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((payload) => {
        const healthyCount = payload.services.filter((service) => service.status === "ok").length;
        setServiceStatus(`${healthyCount}/${payload.services.length} services live`);
      })
      .catch(() => {
        setServiceStatus("Services unavailable");
      });

    fetch("/api/places/summary")
      .then((response) => response.json())
      .then((payload) => setSummary(payload))
      .catch(() => {
        setSummary({ total: 0, breakdown: [] });
      });
  }, []);

  useEffect(() => {
    if (!authToken) {
      return;
    }

    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.message || "Session restore failed.");
        }
        setUser(payload.user);
        window.localStorage.setItem("atmFinderUser", JSON.stringify(payload.user));
      })
      .catch(() => {
        setAuthToken("");
        setUser(null);
        window.localStorage.removeItem("atmFinderToken");
        window.localStorage.removeItem("atmFinderUser");
      });
  }, [authToken]);

  useEffect(() => {
    if (!coords) {
      return;
    }

    const params = new URLSearchParams({
      lat: coords.lat,
      lng: coords.lng
    });

    fetch(`/api/location/context?${params.toString()}`)
      .then((response) => response.json())
      .then((payload) => {
        setCityMeta({
          city: payload.city,
          zone: payload.zone,
          hint: payload.searchHint
        });
      });
  }, [coords]);

  useEffect(() => {
    if (!coords) {
      return;
    }

    const params = new URLSearchParams({
      lat: coords.lat,
      lng: coords.lng,
      radius,
      type,
      q: searchText,
      city: cityFilter,
      bank: bankFilter
    });

    fetch(`/api/places/nearby?${params.toString()}`)
      .then((response) => response.json())
      .then((payload) => {
        setPlaces(payload.results || []);
        setError("");
      })
      .catch(() => {
        setError("Nearby search failed. Check service setup.");
      });
  }, [coords, radius, type, searchText, cityFilter, bankFilter]);

  useEffect(() => {
    if (!coords) {
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const params = new URLSearchParams({
      lat: coords.lat,
      lng: coords.lng,
      radius,
      type,
      q: searchText,
      city: cityFilter,
      bank: bankFilter
    });

    const stream = new EventSource(`/api/realtime/stream?${params.toString()}`);
    eventSourceRef.current = stream;
    setStreamStatus("Stream connecting");

    stream.addEventListener("places", (event) => {
      const payload = JSON.parse(event.data);
      setPlaces(payload.results || []);
      setStreamStatus(`Live at ${new Date(payload.generatedAt).toLocaleTimeString()}`);
    });

    stream.addEventListener("error", () => {
      setStreamStatus("Stream reconnecting");
    });

    return () => {
      stream.close();
    };
  }, [coords, radius, type, searchText, cityFilter, bankFilter]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    placeMarkersRef.current.forEach((marker) => marker.remove());
    placeMarkersRef.current = [];

    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], {
        icon: createPlaceIcon(place.type)
      })
        .addTo(mapRef.current)
        .bindPopup(`<strong>${place.name}</strong><br/>${place.address}<br/>${place.distanceKm} km away`);

      placeMarkersRef.current.push(marker);
    });
  }, [places]);

  function updateUserMarker(nextCoords) {
    if (!mapRef.current) {
      return;
    }

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([nextCoords.lat, nextCoords.lng], {
        icon: createUserIcon()
      })
        .addTo(mapRef.current)
        .bindPopup("You are here");
    } else {
      userMarkerRef.current.setLatLng([nextCoords.lat, nextCoords.lng]);
    }

    mapRef.current.setView([nextCoords.lat, nextCoords.lng], 13);
  }

  function handleLocate() {
    if (!navigator.geolocation) {
      setError("This browser does not support geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setCoords(nextCoords);
        updateUserMarker(nextCoords);
        setError("");
      },
      () => {
        setError("Location permission denied.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  }

  function handleAuthFieldChange(event) {
    const { name, value } = event.target;
    setAuthForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError("");

    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body =
      authMode === "login"
        ? { email: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, password: authForm.password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Authentication failed.");
      }

      setAuthToken(payload.token);
      setUser(payload.user);
      window.localStorage.setItem("atmFinderToken", payload.token);
      window.localStorage.setItem("atmFinderUser", JSON.stringify(payload.user));
    } catch (authRequestError) {
      setAuthError(authRequestError.message);
    }
  }

  function handleLogout() {
    setAuthToken("");
    setUser(null);
    window.localStorage.removeItem("atmFinderToken");
    window.localStorage.removeItem("atmFinderUser");
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Advanced Microservices Stack</p>
          <h1>Realtime ATM and bank finder with React, Express, Sequelize, and SSE.</h1>
          <p className="hero-text">
            This frontend talks to a gateway, which fans out to location, places, and realtime services. Places are now
            served from a database-backed service instead of a static array.
          </p>
          <div className="hero-actions">
            <button onClick={handleLocate}>Use My Location</button>
            <span className="status-pill">{serviceStatus}</span>
            {user ? <span className="status-pill">Signed in as {user.name}</span> : null}
          </div>
          {error ? <p className="error-line">{error}</p> : null}
        </div>

        <div className="hero-panel">
          <div className="control-grid">
            <label>
              Smart search
              <input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Try SBI, Bandra, ATM" />
            </label>
            <label>
              City filter
              <input value={cityFilter} onChange={(event) => setCityFilter(event.target.value)} placeholder="Delhi NCR, Mumbai" />
            </label>
            <label>
              Bank filter
              <input value={bankFilter} onChange={(event) => setBankFilter(event.target.value)} placeholder="HDFC, SBI, ICICI" />
            </label>
            <label>
              Service type
              <select value={type} onChange={(event) => setType(event.target.value)}>
                <option value="all">ATM + Bank</option>
                <option value="atm">ATM only</option>
                <option value="bank">Bank only</option>
              </select>
            </label>
            <label>
              Radius
              <select value={radius} onChange={(event) => setRadius(event.target.value)}>
                <option value="3">3 km</option>
                <option value="6">6 km</option>
                <option value="10">10 km</option>
                <option value="20">20 km</option>
              </select>
            </label>
          </div>

          <div className="meta-row">
            <div>
              <strong>{cityMeta.zone ? `${cityMeta.city} · ${cityMeta.zone}` : cityMeta.city}</strong>
              <p>{cityMeta.hint}</p>
            </div>
            <div className="stream-badge">
              <span className="dot"></span>
              <span>{streamStatus}</span>
            </div>
          </div>

          <div className="summary-grid">
            <article>
              <strong>{summary.total}</strong>
              <span>Seeded locations</span>
            </article>
            {summary.breakdown.map((item) => (
              <article key={item.type}>
                <strong>{item.count}</strong>
                <span>{item.type.toUpperCase()}</span>
              </article>
            ))}
          </div>
        </div>
      </header>

      <main className="content-grid">
        <section className="map-card">
          <div ref={mapNodeRef} className="map-node"></div>
        </section>

        <section className="results-card">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>{user ? "Account" : authMode === "login" ? "Login" : "Create account"}</h2>
              {!user ? (
                <button className="ghost-button" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
                  {authMode === "login" ? "Need signup?" : "Have login?"}
                </button>
              ) : null}
            </div>

            {user ? (
              <div className="auth-summary">
                <p><strong>{user.name}</strong></p>
                <p>{user.email}</p>
                <button className="ghost-button" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleAuthSubmit}>
                {authMode === "signup" ? (
                  <input name="name" value={authForm.name} onChange={handleAuthFieldChange} placeholder="Your name" />
                ) : null}
                <input name="email" value={authForm.email} onChange={handleAuthFieldChange} placeholder="Email" />
                <input name="password" type="password" value={authForm.password} onChange={handleAuthFieldChange} placeholder="Password" />
                <button type="submit">{authMode === "login" ? "Login" : "Signup"}</button>
                <p className="auth-hint">Demo login: demo@atmfinder.dev / demo1234</p>
                {authError ? <p className="error-line">{authError}</p> : null}
              </form>
            )}
          </div>

          <div className="results-header">
            <h2>Nearby Results</h2>
            <p>{coords ? `${places.length} result(s) in ${radius} km radius` : "Location search not started yet."}</p>
          </div>

          <div className="results-list">
            {!places.length ? (
              <article className="result-item empty">
                <h3>No live results yet</h3>
                <p>Start with your current location to fetch nearby ATM and bank suggestions.</p>
              </article>
            ) : (
              places.map((place) => (
                <article key={place.id} className="result-item">
                  <div className="result-top">
                    <div>
                      <h3>{place.name}</h3>
                      <p>{place.address}</p>
                    </div>
                    <strong>{place.distanceKm} km</strong>
                  </div>
                  <div className="tag-row">
                    <span className="tag">{place.type.toUpperCase()}</span>
                    <span className="tag">{place.bank}</span>
                    <span className="tag">{place.availability}</span>
                    <span className="tag">Cash {place.cashLevel}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
