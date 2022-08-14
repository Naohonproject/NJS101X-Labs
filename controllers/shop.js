/** @format */

const { findById } = require("../models/product");
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((error) => console.log(error));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findAll({
    where: {
      id: prodId,
    },
  })
    .then(([product]) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((error) => console.log(error));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((error) => console.log(error));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart() /* take cart of current user */
    .then((cart) => {
      fetchedCart = cart; /*asign cart for a variable to reuse */
      return cart.getProducts({
        where: { id: prodId },
      }); /**get the product with id equal to prodId and return to be chained */
    })
    .then((products) => {
      /**retrive products in the previous then */
      let product; /**this logic for check whether product existed or not */
      // if the product was existed in the card , not add it to cart anymore, instead increase the quantity in the cartitem
      if (products.length > 0) {
        product = products[0];
      }
      // if product is existed in the current cart, return that product and increase of quantity 1 unit
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      // if product was not existed , then find that product in the Product table then add it into cartItem table, this time quantity is jus initial with value is 1
      return Product.findById(prodId);
    })
    .then((product) => {
      // receive the product by the promise of the previous then, add to the cart by call the existing cart by fetchedCard and addProduct
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDelete = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
