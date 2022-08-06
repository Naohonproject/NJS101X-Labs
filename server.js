/** @format */
const http = require("http");

const express = require("express");

const app = express();

app.use((req, res, next) => {
	console.log("in the first middle ware!");
	next();
});

app.use((req, res, next) => {
	console.log("in the sencond middle ware!!!");
	res.send("<h1>Hello From ExpressJs server</h1>");
});

const server = http.createServer(app);
server.listen(3000);
