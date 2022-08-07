/** @format */

const express = require("express");

const server = express();

server.use("/", (req, res, next) => {
	console.log("this always runs");
	next();
});

server.use("/add-product", (req, res, next) => {
	console.log("in the first middleware");
	res.send("<h1>The Add product page</h1>");
});

server.use("/", (req, res, next) => {
	console.log("in the second middleware");
	res.send("<h1>Hello From ExpressJs server</h1>");
});

server.listen(3000);
