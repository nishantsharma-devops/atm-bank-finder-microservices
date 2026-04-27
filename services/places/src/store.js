const fs = require("fs");
const path = require("path");
const { DataTypes, Sequelize } = require("sequelize");

const dataDirectory = path.resolve(__dirname, "../data");
const defaultStoragePath = path.join(dataDirectory, "places.sqlite");
const configuredPath = process.env.PLACES_DB_PATH
  ? path.resolve(__dirname, "..", process.env.PLACES_DB_PATH)
  : defaultStoragePath;

fs.mkdirSync(path.dirname(configuredPath), { recursive: true });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: configuredPath,
  logging: false
});

const Place = sequelize.define(
  "Place",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bank: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    availability: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cashLevel: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "places",
    timestamps: false
  }
);

module.exports = {
  Place,
  sequelize
};
