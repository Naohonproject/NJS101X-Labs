/** @format */
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");

const rootDir = require("./util/path");
const adminRoutes = require("./routes/admin");
const userRouter = require("./routes/shop");
const errorController = require("./controllers/404");

// create a server
const server = express();

// define a template engine

// set up view engine
server.set("view engine", "ejs");
// set up views folder to find template
server.set("views", "views");

// apply middlware to be reflect the period between req and res
server.use(bodyParser.urlencoded({ extended: true }));

// define the public static folder
server.use(express.static(path.join(rootDir, "public")));

server.use("/admin", adminRoutes);
server.use(userRouter);

// if no routes matchs , this page will be render
server.use(errorController.getNotFound);

server.listen(3000);
