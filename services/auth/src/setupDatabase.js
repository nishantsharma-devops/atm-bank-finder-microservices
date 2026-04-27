const bcrypt = require("bcryptjs");
const { sequelize, User } = require("./store");

async function main() {
  await sequelize.sync();

  const existing = await User.findOne({ where: { email: "demo@atmfinder.dev" } });
  if (!existing) {
    await User.create({
      name: "Demo User",
      email: "demo@atmfinder.dev",
      passwordHash: await bcrypt.hash("demo1234", 10)
    });
  }

  console.log("Auth database prepared.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await sequelize.close();
  });
