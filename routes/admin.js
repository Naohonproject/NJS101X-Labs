/** @format */

const express = require("express");

const router = express.Router();

router.get("/add-product", (req, res, next) => {
	console.log("in the first middleware");
	res.send(
		"<form action='/product' method='POST'><input type ='text' name='title' placeHolder='product name'/><button type = 'submit'>add product</button></form>"
	);
});

router.post("/product", (req, res, next) => {
	console.log(req.body);
	res.redirect("/");
});

module.exports = router;
