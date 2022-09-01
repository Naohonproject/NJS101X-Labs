/** @format */

const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  // receive the query value(page) from the url
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numberOfProduct) => {
      totalItems = numberOfProduct;
      return (
        Product.find()
          // use skip chain after find to skip the result by logic filter just items that not skip,skip will run and skip the number of result from start
          // until the number of skip result match (page-1)*ITEMS_PER_PAGE
          .skip((page - 1) * ITEMS_PER_PAGE)
          // limit func tell moongose that we just need the ITEMS_PER_PAGE in the result
          .limit(ITEMS_PER_PAGE)
      );
    })
    // moongose find function return a cursor to each element, then we can implement each of result,
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        totalProducts: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        currentPage: page,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDelete = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  // this logic let we authorize just logged in user is able to reach the
  // file from it's session
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("no order is found"));
      }

      if (req.user._id.toString() !== order.user.userId.toString()) {
        return next(new Error("Unauthorized"));
      }
      // if found the order by it's id , then implement logic to download the file
      // otherwise , unloggedin user or other user can not reach that file
      // because we check and throw that error to the error middleware already
      // even though user may have the url that route to our controller, but
      // we add the logic to check whether the req.user is match to the user.userId
      const invoiceName = "invoice" + "-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      // use the pdfKit to create to pdf file from the data from server
      const pdfDoc = new PDFDocument();

      // set up res header
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );

      // start the stream
      // set up where to store pdf on server
      pdfDoc.pipe(fs.createWriteStream(invoicePath));

      // set up to let res receive the pdf
      pdfDoc.pipe(res);

      let totalPrice = 0;

      pdfDoc.fontSize(30).text("Invoice");

      pdfDoc.text("----------------------------");

      order.products.forEach((prod) => {
        totalPrice += prod.quantity * Number(prod.product.price);
        pdfDoc
          .fontSize(12)
          .text(
            prod.product.title +
              "-" +
              prod.quantity +
              "x" +
              "$" +
              prod.product.price
          );
      });

      pdfDoc.text("------------------");

      pdfDoc.fontSize(18).text("Total price $ : " + totalPrice);

      // end the pdf write stream
      pdfDoc.end();
    })
    .catch((err) => next(err));
};
