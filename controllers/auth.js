exports.getLogIn = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "log In",
    path: "/login",
    isAuthenticated: req.isAuthenticated,
  });
};

exports.postLogIn = (req, res, next) => {
  req.isAuthenticated = true;
  res.redirect("/");
};
