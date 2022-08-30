const Product = require("../models/product");
const { validationResult } = require("express-validator");
const moongose = require("mongoose");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.file;
  const price = req.body.price;
  const description = req.body.description;

  console.log(imageUrl);

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
      },
      errorMessage: error.array()[0].msg,
      validationErrors: error.array(),
    });
  }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user._id,
  });
  product
    .save()
    .then((result) => res.redirect("/admin/products"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const notFoundError = new Error(err);
      notFoundError.httpStatusCode = 500;
      return next(notFoundError);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const updatedTitle = req.body.title;
  const updatedImgUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImgUrl,
        description: updatedDescription,
        price: updatedPrice,
        _id: prodId,
      },
      errorMessage: error.array()[0].msg,
      validationErrors: error.array(),
    });
  }

  Product.findById(prodId).then((product) => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDescription;
    product.imageUrl = updatedImgUrl;
    product
      .save()
      .then(() => {
        res.redirect("/products");
      })
      .catch((err) => {
        const catchedError = new Error(err);
        catchedError.httpStatusCode = 500;
        return next(catchedError);
      });
  });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const catchedError = new Error(err);
      catchedError.httpStatusCode = 500;
      return next(catchedError);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findOneAndRemove(prodId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const catchedError = new Error(err);
      catchedError.httpStatusCode = 500;
      return next(catchedError);
    });
};
