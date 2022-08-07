/** @format */

const bodyParser = require("body-parser");
const express = require("express");

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/shop");

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));

server.use("/admin", adminRouter);
server.use(userRouter);

server.use("/", (req, res, next) => {
	res.status(404).send("<h1>Page Not Found</h1>");
});

server.listen(3000);
