import Sequelize from "sequelize";
import db from "../lib/db.js";

const Address = db.define("address", {
  line1: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  line2: {
    type: Sequelize.DataTypes.STRING,
  },
  city: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});

export default Address;
