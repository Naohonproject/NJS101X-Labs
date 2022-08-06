/** @format */
const fs = require("fs");

function requestHandler(req, res) {
	const url = req.url;
	const method = req.method;
	if (url === "/") {
		res.setHeader("Content-type", "text/html");
		res.write("<html>");
		res.write("<head><title>Login</title><head/>");
		res.write(
			"<body><form form action = '/message' method = 'POST' ><input type='text' name = 'message'/><button type = 'submit'>send</button></form ></body > "
		);
		res.write("</html>");
		return res.end();
	}
	if (url === "/message" && method === "POST") {
		const body = [];
		req.on("data", (chunk) => {
			body.push(chunk);
		});

		return req.on("end", () => {
			const parsedBody = Buffer.concat(body).toString();
			const [name, ...message] = parsedBody.split("=");
			const messageContent = message.join("");
			fs.writeFile("message.txt", messageContent, (error) => {
				res.statusCode = 302;
				res.setHeader("Location", "/");
				return res.end();
			});
		});
	}

	res.setHeader("Content-type", "text/html");
	res.write("<html>");
	res.write("<head><title>Hello,Here is My first Response page</title><head/>");
	res.write("<body><h1>Hello from my NodeJs Server!!!</h1></body>");
	res.write("</html>");
	res.end();
}

// module.exports = requestHandler;

// module.exports = {
// 	handler: requestHandler,
// 	someText: "some hard code text here to test",
// };

exports.handler = requestHandler;
exports.someText = "sometext to test export module";
