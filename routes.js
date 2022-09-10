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
      "<body><form form action = '/message' method = 'POST' ><input type='text' name = 'message'/><input type='text' name = 'name'/><button type = 'submit'>send</button></form ></body > "
    );
    res.write("</html>");
    return res.end();
  }
  // node js have event loop mechanism, so that if the event like req.on("data",callback1), req.on("end",callback2)
  // the first event will call the callback1 on stream , the second event will be called just end of the event 1.
  // so that makes the callback2 always will be called after the chunks of data was pushed to the body done
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    // this is a async function, this will return a promise so that to avoid that the below statements can run before this callback called
    // we need to return this promise to stop this function at this point, if not, the below statements will run then response will
    // send to client , then the end event is trigger, then call back is called, then one more time we set the header, this time
    // response was sent we will meet the error cannot set header when response is sent.We need to return the promise of req.on("end")
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
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
