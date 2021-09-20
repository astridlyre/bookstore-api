import Sequelize from "sequelize";
import db from "../lib/db.js";

const Review = db.define("review", {
  text: {
    type: Sequelize.DataTypes.TEXT,
  },
  stars: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Review;
