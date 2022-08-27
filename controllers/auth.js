const User = require("../models/user");
const bscrypt = require("bcryptjs");

exports.getLogIn = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "log In",
    path: "/login",
    errorMessage: message,
  });
};

exports.postLogIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      // user with input email not existed in db, redirect to log in page, return that and the below code will not be run,if not code excute normally
      if (!user) {
        req.flash("error", "Invalid email or Password");
        return res.redirect("/login");
      }
      // this func compare input password to hashed password(was store in db with user mail) return a promise , with boolen go into then , true if match, false is not matching
      bscrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            // if match , create a session for this user(the match user with matched email and password)
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(() => {
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or Password");
          res.redirect("/login");
        })
        .catch((error) => {
          console.log(error);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.postSignUp = (req, res, next) => {
  // get date from sign up form
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  /** Create new user by the date from sign up form */
  // check whether the email user input existed in db or not
  // if it is, warning the user and not create the new one in db
  // if not existed, create a new user

  // result of findOne can be undefined if there is no data match
  // to the condition of that method, then we can get result in
  // arg of then
  User.findOne({ email: email })
    .then((userDoc) => {
      /** if userDoc is exist(not undefined), not generate new user */
      if (userDoc) {
        req.flash("error", "This email was registed for an existed accoutn");
        return res.redirect("/signup");
      }
      // enscrypting the password and return a promise to be chained
      return bscrypt
        .hash(password, 12)
        .then((enscryptedPassword) => {
          // if userDoc(undefined). create a new user with enscrypted password
          const user = new User({
            email: email,
            password: enscryptedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((error) => console.log(error));
};

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "Sign up",
    path: "/signup",
    errorMessage: message,
  });
};
