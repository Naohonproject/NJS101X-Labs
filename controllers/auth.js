exports.getLogIn = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  console.log(isLoggedIn);
  res.render("auth/login", {
    pageTitle: "log In",
    path: "/login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogIn = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};
