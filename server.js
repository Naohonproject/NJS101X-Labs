/** @format */
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");

const rootDir = require("./util/path");
const admin = require("./routes/admin");
const userRouter = require("./routes/shop");

// create a server
const server = express();

// define a template engine

// set up view engine
server.set("view engine", "ejs");
// set up views folder to find template
server.set("views", "views");

// apply middlware to be reflect the period between req and res
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(rootDir, "public")));
server.use("/admin", admin.routes);
server.use(userRouter);
server.use("/", (req, res, next) => {
	res.status(404).render("404", { pageTitle: "Page Not Found" });
});

server.listen(3000);
