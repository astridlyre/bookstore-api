import Sequelize from "sequelize";
import db from "../lib/db.js";

const Client = db.define("client", {
  firstName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.DataTypes.STRING,
  },
});

export default Client;
