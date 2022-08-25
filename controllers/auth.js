exports.getLogIn = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "log In",
    path: "/login",
  });
};
