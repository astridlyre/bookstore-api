import Sequelize from "sequelize";
import db from "../lib/db.js";

const Employee = db.define("employee", {
  firstName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  birthDate: {
    type: Sequelize.DataTypes.DATEONLY,
  },
  email: {
    type: Sequelize.DataTypes.STRING,
  },
  hireDate: {
    type: Sequelize.DataTypes.DATEONLY,
    allowNull: false,
  },
  employeeNumber: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Employee;
