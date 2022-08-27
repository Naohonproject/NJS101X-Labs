const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGDB_URI =
  "mongodb+srv://letuanbao:SByQsXUanGc1VnuZ@cluster0.4ewgxhk.mongodb.net/shop";

const app = express();
const store = new MongoDbStore({ uri: MONGDB_URI, collection: "sessions" });

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const AuthRouter = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  // this statement check if incoming request(with cookie that includes a connect.sid) is existed or not, if not, call next() to
  // going to other middleware, because it reuturn next() so , below code will not excute
  /**
   * req.session will be run like , take the req, with cookie , check where that cookie holds any session in server or not
   */
  if (!req.session.user) {
    return next();
  }
  // if request with the session cookie match a current session(saved on server , might be memory or database) then find user in User collection
  // then add it to this incoming request and next() to next to other middileware like router, this statement req.user = user just can be do if
  // whe find a session in server that has session_id with the session_id cookie hold, this make sense because just can be access to some router
  // and data if the user was log in correctly, and the session will be there(in server) util we sign out, so if the other request(that will be
  // sent will cookie hold the request id will be right util user sign out)
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(AuthRouter);

app.use(errorController.get404);

mongoose
  .connect(MONGDB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
