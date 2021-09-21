import Sequelize from "sequelize";
import db from "../lib/db.js";

const Copy = db.define("copy", {
  bookId: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
  storeId: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Copy;
