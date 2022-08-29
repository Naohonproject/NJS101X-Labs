const path = require("path");
const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 10, max: 200 }).trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

// /admin/edit-product/:productId => GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// /admin/edit-produc => POST

router.post(
  "/edit-product",
  [
    body("title").isAlphanumeric().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 10, max: 200 }).trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
