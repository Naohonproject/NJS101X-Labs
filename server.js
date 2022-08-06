/** @format */
const http = require("http");
const { handler } = require("./routes");

const { error } = require("console");

const server = http.createServer(handler);

server.listen(3000);
