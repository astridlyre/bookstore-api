import Sequelize from "sequelize";
import db from "../lib/db.js";

const PhoneNumbers = db.define("phoneNumbers", {
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

export default PhoneNumbers;
