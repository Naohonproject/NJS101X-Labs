exports.getLogIn = (req, res, next) => {
  const isLoggedIn =
    req.get("Cookie").split(";")[0].trim().split("=")[1] === "true";
  res.render("auth/login", {
    pageTitle: "log In",
    path: "/login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogIn = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
