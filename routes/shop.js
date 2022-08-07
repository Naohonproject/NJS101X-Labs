/** @format */

const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
	console.log("in the second middleware");
	res.send("<h1>Hello From ExpressJs server</h1>");
});

module.exports = router;
