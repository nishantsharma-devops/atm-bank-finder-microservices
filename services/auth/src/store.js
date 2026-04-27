const fs = require("fs");
const path = require("path");
const { DataTypes, Sequelize } = require("sequelize");

const dataDirectory = path.resolve(__dirname, "../data");
const defaultStoragePath = path.join(dataDirectory, "auth.sqlite");
const configuredPath = process.env.AUTH_DB_PATH
  ? path.resolve(__dirname, "..", process.env.AUTH_DB_PATH)
  : defaultStoragePath;

fs.mkdirSync(path.dirname(configuredPath), { recursive: true });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: configuredPath,
  logging: false
});

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "users",
    timestamps: true
  }
);

module.exports = { sequelize, User };
