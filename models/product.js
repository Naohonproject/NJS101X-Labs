// /** @format */
// const db = require("../util/database");

// const Cart = require("./cart");

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   async save() {
//     return db.execute(
//       "INSERT INTO products (title,price,description,imageUrl) VALUES (?,?,?,?)",
//       [this.title, this.price, this.description, this.imageUrl]
//     );
//   }

//   static async deleteById(id) {}

//   static async fetchAll() {
//     return db.execute("SELECT * FROM products");
//   }

//   static async findById(id) {
//     return db.execute("SELECT * FROM products WHERE products.id = ? ", [id]);
//   }
// };

const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: Sequelize.STRING,
  allowNull: false,
});

module.exports = Product;
