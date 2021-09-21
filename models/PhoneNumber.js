import Sequelize from "sequelize";
import db from "../lib/db.js";

const PhoneNumber = db.define("phoneNumber", {
  main: {
    type: Sequelize.DataTypes.STRING,
  },
  fax: {
    type: Sequelize.DataTypes.STRING,
  },
  cell: {
    type: Sequelize.DataTypes.STRING,
  },
  home: {
    type: Sequelize.DataTypes.STRING,
  },
});

export default PhoneNumber;
