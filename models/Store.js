import Sequelize from "sequelize";
import db from "../lib/db.js";

const Store = db.define("store", {
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});

export default Store;
