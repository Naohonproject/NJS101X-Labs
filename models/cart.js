const { json } = require("body-parser");
const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch previous cart
    let cart = { products: [], totalPrice: 0 };
    fs.readFile(p, (err, content) => {
      if (!err) {
        cart = JSON.parse(content);
      }
      //   take existing products and find that whether the product we add existed or not
      const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      //   add a new product to cart or increase the quantity if existing
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + Number(productPrice);

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
  static deleteProduct(id, producPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const cart = JSON.parse(fileContent);
      const updatedCard = { ...cart };

      const deletedProduct = cart.products.find((product) => product.id === id);
      const quantityProduct = deletedProduct.qty;

      updatedCard.products = updatedCard.products.filter((product) => product.id !== id);
      updatedCard.totalPrice = updatedCard.totalPrice - quantityProduct * producPrice;

      fs.writeFile(p, JSON.stringify(updatedCard), (err) => {
        console.log(err);
      });
    });
  }
  static getCart(cb) {
    fs.readFile(p, (err, content) => {
      const cart = JSON.parse(content);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
