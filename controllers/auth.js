const User = require("../models/user");
const bscrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

// use mailtrap to fake send email
let transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "72a4cf8c92575f",
    pass: "cbe32a9773e0d7",
  },
});

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

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "login",
      path: "/login",
      errorMessage: error.array()[0].msg,
    });
  }

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
  // validationResult is a function by express-validator package, this take incoming request and check the result of error by the before middleware
  // return and error object
  const error = validationResult(req);

  // check whether there is any error or not, if incoming request go into before middleware and incoming request was assigned the validated error
  // we re-render signup page with error message we set in the checking middleware(middleware we set right in front of postSignUp middle ware)
  if (!error.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Sign up",
      path: "/signup",
      errorMessage: error.array()[0].msg,
      oldInput: {
        password: password,
        email: email,
        confirmPassword: confirmPassword,
      },
    });
  }

  /** Create new user by the date from sign up form */
  // check whether the email user input existed in db or not
  // if it is, warning the user and not create the new one in db
  // if not existed, create a new user

  // result of findOne can be undefined if there is no data match
  // to the condition of that method, then we can get result in
  // arg of then

  // enscrypting the password and return a promise to be chained
  // the email exist is checked by the prev middleware, so that when req go to this middleware, email has not existed in the db
  bscrypt
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
      // after sign up and dir to login page and send email to notify email was successfully register
      return transport.sendMail({
        to: email,
        from: "sender@gmail.com",
        subject: "signup succeeded",
        html: "<h1>Sign up succeeded!</h1>",
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
    oldInput: { email: "", password: "", confirmPassword: "" },
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  // create token to add to our reset page and send it to the email
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
      res.redirect("/reset");
    }
    // convert token from buffer to string
    const token = buffer.toString("hex");
    // find the email which user want to reset passwors
    User.findOne({ email: req.body.email })
      .then((user) => {
        // check whether user the client type exist in db or not, if not redirect to the log in page with a flash error message
        if (!user) {
          req.flash("error", "Can not found your email");
          return res.redirect("/reset");
        }
        // if the user email exist in db, set that user more 2 feild : resetToken , resestTokentExperation.this marks user who will be reset
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        // save the database change, return a promise
        return user.save();
      })
      .then((result) => {
        // after save the db, send the email to the user's email to confirm, this email will contain the token, we will this token to verify user in db
        res.redirect("/");
        transport.sendMail({
          to: req.body.email,
          from: "sender@gmail.com",
          subject: "reset password",
          html: `<h2> Do you request to reset password ? </h2>
                <p> if that's you , click this <a href="http://localhost:3000/reset/${token}">link</a> to reset password </p>
          `,
        });
      })
      .catch((error) => console.log(error));
  });
};

exports.getNewPassword = (req, res, next) => {
  let message = req.flash("error");

  // in the url (after user check email and click to our link, url will change to htt://localhost:3000/reset/token(some token we given))
  const token = req.params.token;

  User.findOne({
    // find the user in db, who have resetToken matches token from url params we got and resetTokenExpiration greater than Date.now() time
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      // render reset page, with token infor, userId infor
      res.render("auth/new-password", {
        pageTitle: "Update Password",
        path: "/new-password",
        errorMessage: message,
        passwordToken: token,
        userId: user._id.toString(),
      });
    })
    .catch((error) => console.log(error));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const currentPassword = req.body.confirmPassword;

  // find the user in db who matches these below properties
  User.findOne({
    resetToken: passwordToken,
    _id: userId,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      // check the current password in db vs the current password we want user type to confirm whether user remember password or not
      bscrypt
        .compare(currentPassword, user.password)
        .then((isMatch) => {
          if (isMatch) {
            // if match , create a session for this user(the match user with matched email and password)
            return bscrypt.hash(newPassword, 12);
          }
          req.flash(
            "error",
            "Your confirm password not match current password"
          );
          res.redirect("/login");
        })
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenExpiration = undefined;
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => {
      req.flash(
        "error",
        "Your reset session is expired,please reset password again"
      );
      res.redirect("login");
    });
};
