import Sequelize from "sequelize";
import db from "../lib/db.js";

const Author = db.define("author", {
  firstName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.DataTypes.TEXT,
  },
  website: {
    type: Sequelize.DataTypes.STRING,
  },
  imageUrl: {
    type: Sequelize.DataTypes.STRING,
  },
});

export default Author;
