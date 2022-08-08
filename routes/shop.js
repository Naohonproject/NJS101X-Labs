/** @format */
const path = require("path");
const express = require("express");

const admin = require("./admin");
const rootDir = require("../util/path");

const router = express.Router();

router.get("/", (req, res, next) => {
	res.render("shop", { prods: admin.products, pageTitle: "Shop", path: "/" });
});

module.exports = router;
