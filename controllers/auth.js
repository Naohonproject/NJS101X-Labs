const User = require("../models/user");
const bscrypt = require("bcryptjs");

exports.getLogIn = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "log In",
    path: "/login",
    isAuthenticated: false,
  });
};

exports.postLogIn = (req, res, next) => {
  User.findById("62fe83f1074264469d321391")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // we did this because, req.session will save session to mongodb async, if we redirect to fast , before the save work to db is not done yet, then
      // res will not receive the date from session that is saved on db, to deal with that, we add callback on req.session.save(), this
      // will make res just be sent when sestion was adding to db
      req.session.save(() => {
        res.redirect("/");
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
        return res.redirect("/");
      }
      // enscrypting the password and return a promise to be chained
      return bscrypt.hash(password, 12);
    })
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
    })
    .catch((error) => console.log(error));
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign up",
    path: "/signup",
    isAuthenticated: false,
  });
};
