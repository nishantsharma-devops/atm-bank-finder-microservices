const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sequelize, User } = require("./store");

const app = express();
const port = Number(process.env.AUTH_PORT || 3004);
const jwtSecret = process.env.JWT_SECRET || "change-me";

app.use(cors());
app.use(express.json());

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name
    },
    jwtSecret,
    { expiresIn: "7d" }
  );
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

function readToken(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length);
}

app.get("/health", (_req, res) => {
  res.json({ service: "auth-service", status: "ok", auth: "jwt" });
});

app.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const existing = await User.findOne({ where: { email: String(email).toLowerCase() } });
  if (existing) {
    return res.status(409).json({ message: "User already exists with this email." });
  }

  const user = await User.create({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    passwordHash: await bcrypt.hash(String(password), 10)
  });

  return res.status(201).json({
    token: issueToken(user),
    user: sanitizeUser(user)
  });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(String(password), user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.json({
    token: issueToken(user),
    user: sanitizeUser(user)
  });
});

app.get("/auth/me", async (req, res) => {
  const token = readToken(req);
  if (!token) {
    return res.status(401).json({ message: "Missing bearer token." });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(payload.sub);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

app.listen(port, async () => {
  await sequelize.authenticate();
  console.log(`auth-service listening on port ${port}`);
});
