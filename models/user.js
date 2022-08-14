const sequelize = require("../util/database");

const Sequelize = require("sequelize");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = User;
