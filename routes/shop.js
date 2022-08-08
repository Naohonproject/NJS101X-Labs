/** @format */
const path = require("path");
const express = require("express");

const admin = require("./admin");
const rootDir = require("../util/path");

const router = express.Router();

router.get("/", (req, res, next) => {
	const products = admin.products;
	res.render("shop", {
		prods: products,
		pageTitle: "Shop",
		path: "/",
		hasProduct: products.length > 0,
		activeShop: true,
		productCSS: true,
	});
});

module.exports = router;
