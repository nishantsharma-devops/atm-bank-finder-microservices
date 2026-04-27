const { places } = require("@atm-finder/shared");
const { Place, sequelize } = require("./store");

async function main() {
  await sequelize.sync({ force: true });
  await Place.bulkCreate(places);
  console.log(`Seeded ${places.length} records into SQLite.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await sequelize.close();
  });
