const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
    }
);
(async () => {
  try {
    await sequelize.authenticate();
    const [dbInfo] = await sequelize.query("SELECT current_database(), current_user;");
    console.log("Connected to DB:", dbInfo[0]);
  } catch (err) {
    console.error("Connection test failed:", err);
  }
})();
module.exports = { sequelize };
