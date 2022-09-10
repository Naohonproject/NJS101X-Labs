/** @format */
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");

const rootDir = require("./util/path");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/shop");

// create a server
const server = express();

// register middleware to handle in coming request, if the first 2 args pass, the first will be string that the url,
// url specify that what url will use this middleware(the second arg), use function will take relative url, means that
// the lines of use will run top to button , if we write :
// server.use("/", middleware1)
// server.use("/message",middleware2)
// express will go into middle one event the url of incoming request is /message
// this means that use function will cat the first url match, it checks from left to right then catch first url match
// it see the "/" first ,catch it , then the middleware1 run, then response to client , the "/message" url will never be catch
// if we use to register middle ware, that include the routers , we need to write the the most specific router first, then
// write the common router in the bottom OR we use server.get or server.post to point absolute router for incoming request
server.use(bodyParser.urlencoded({ extended: true }));
// declare the the folder that serve as public, this will always be served
server.use(express.static(path.join(rootDir, "public")));
// router
server.use("/admin", adminRouter);
server.use(userRouter);
server.use("/", (req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, "views", "page-not-found.html"));
});

// event-loop to listen the incoming request event
server.listen(3000);
