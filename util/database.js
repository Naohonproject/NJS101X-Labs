const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "27121996", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
