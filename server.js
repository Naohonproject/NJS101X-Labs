/** @format */
const http = require("http");

const express = require("express");

const app = express();

app.use((req, res, next) => {
	console.log("in the first middle ware!");
	next();
});

app.use((res, req, next) => {
	console.log("in the sencond middle ware!!!");
});

const server = http.createServer(app);
server.listen(3000);
