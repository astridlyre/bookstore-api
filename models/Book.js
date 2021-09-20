import Sequelize from "sequelize";
import db from "../lib/db.js";

const Book = db.define("book", {
  title: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  isbn: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.DataTypes.TEXT,
  },
  price: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Book;
