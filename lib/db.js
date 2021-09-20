import Sequelize from "sequelize";
import config from "../config.js";

const db = new Sequelize(`${config.DATABASE_URL}/${config.DATABASE_NAME}`, {
  logging: false,
});

export default db;
