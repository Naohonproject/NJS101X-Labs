const Product = require("../models/product");
const { validationResult } = require("express-validator");
const moongose = require("mongoose");
const fileHelp = require("../util/file");

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
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: "Attached file is not an image.",
      validationErrors: [],
    });
  }

  // we save the file in the dictionary in the source and save the path to it in db, imageUrl
  const imageUrl = image.path;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    userId: req.user,
    imageUrl: imageUrl,
  });
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
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
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const image = req.file;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
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

    // logic to delete image store in server system when update the image of product in db
    if (image) {
      fileHelp.deleteFile(product.imageUrl);
      product.imageUrl = image.path;
    }
    product.description = updatedDescription;

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
  // logic to delete image store in server system when delete product in db
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not exist anymore"));
      }
      // use deleteFile from utils/file/helpFunction to unlink the file when delete the db
      // product.image = "images\2022-09-01T02-55-04.001Z-1503752.jpg"
      fileHelp.deleteFile(product.imageUrl);
      return Product.findOneAndRemove(prodId);
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const catchedError = new Error(err);
      catchedError.httpStatusCode = 500;
      return next(catchedError);
    });
};
