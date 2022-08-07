/** @format */

const bodyParser = require("body-parser");
const express = require("express");

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/shop");

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));

server.use(adminRouter);
server.use(userRouter);

server.listen(3000);
