const User = require("../models/user");

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
