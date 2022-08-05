/** @format */
const http = require("http");

const server = http.createServer((req, res) => {
	const url = req.url;
	const method = req.method;

	if (url === "/") {
		res.setHeader("Content-type", "text/html");
		res.write("<html>");
		res.write("<head><title>Login</title><head/>");
		res.write(
			"<body><form form action = '/message' method = 'POST' ><input type='text' name = 'mess'/><button type = 'submit'>send</button></form ></body > "
		);
		res.write("</html>");
		return res.end();
    }
    if ((url = "/message")) {
		}

	res.setHeader("Content-type", "text/html");
	res.write("<html>");
	res.write("<head><title>Hello,Here is My first Response page</title><head/>");
	res.write("<body><h1>Hello from my NodeJs Server!!!</h1></body>");
	res.write("</html>");
	res.end();
});

server.listen(3000);
