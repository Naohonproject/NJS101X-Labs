/** @format */

const { urlencoded } = require("body-parser");
const bodyParser = require("body-parser");
const express = require("express");

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
// server.use(bodyParser(undefined, { extends: false }));

server.use("/add-product", (req, res, next) => {
	console.log("in the first middleware");
	res.send(
		"<form action='/product' method='POST'><input type ='text' name='title' placeHolder='product name'/><button type = 'submit'>add product</button></form>"
	);
});

server.use("/product", (req, res, next) => {
	console.log(req.body);
	res.redirect("/");
});

server.use("/", (req, res, next) => {
	console.log("in the second middleware");
	res.send("<h1>Hello From ExpressJs server</h1>");
});

server.listen(3000);
