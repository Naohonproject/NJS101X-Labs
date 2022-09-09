const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGDB_URI =
  "mongodb+srv://letuanbao:SByQsXUanGc1VnuZ@cluster0.4ewgxhk.mongodb.net/shop";

const app = express();
const store = new MongoDbStore({ uri: MONGDB_URI, collection: "sessions" });
const csrfProtection = csrf();

const dateStr = new Date().toISOString().replace(/:/g, "-");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, dateStr + "-" + file.originalname);
  },
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const AuthRouter = require("./routes/auth");

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  }
  cb(null, false);
};

app.use(bodyParser.urlencoded({ extended: false }));

// store file in storage that is in server folder
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
// we save file in images like the static file then cause the db save the path
// like image/... so that we need to concat the image names with images folder to match the url /images/image_name

// server the public image
app.use("/images", express.static(path.join(__dirname, "images")));

// let we use session middleware to create a session in server and store that session to store(this case we config it to save on mongodb)
// this session will always be create and by default it have key cookie to config the cookie that will be set on header of res
// if we not save data on session, session will not be save and sessionId won't set on respons header as cookie

// use this middle ware to sign a session data, this alway make session alway have key value with key csrfSecret, then we pass it to view when
// render view, this value exist in view, then this session still hold that value, then when post request is sent to server, includes that token(csrfSecret)
// we can check that to be protect the request to our server from CSRF ATTACH(some hacker fake our website request to our server, because user
// hold sessionID in cookie when a session still exist, so that we need user can be access database if the request(not get request) must be from
//  our view(our website) )

app.use(csrfProtection);
// we use to save some data in session just in one more request, just the next request(next request of the request we response), after that request
// this data will be free in session
// this will make a data save in sesssion with key : flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

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
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(AuthRouter);

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => 

  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});
mongoose
  .connect(MONGDB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
