/** @format */
const http = require("http");

const server = http.createServer((req, res) => {
	console.log(req.method, req.url, req.headers);
	res.setHeader("Content-type", "text/html");
	res.write("<html>");
	res.write("<head><title>Hello,Here is My first Response page</title><head/>");
	res.write("<body><h1>Hello from my NodeJs Server!!!</h1></body>");
	res.write("</html>");
	res.end();
});

server.listen(3000);
