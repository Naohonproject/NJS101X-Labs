/** @format */
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/shop");

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));

server.use("/admin", adminRouter);
server.use(userRouter);

server.use("/", (req, res, next) => {
	res.status(404).sendFile(path.join(__dirname, "views", "page-not-found.html"));
});

server.listen(3000);
