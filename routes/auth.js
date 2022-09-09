const express = require("express");
const authController = require("../controllers/auth");
const { check, body } = require("express-validator");
const User = require("../models/user");
const { Promise } = require("sequelize");

const router = express.Router();

router.get("/login", authController.getLogIn);

router.get("/signup", authController.getSignUp);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email address."),
        body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogIn
);

router.post("/logout", authController.postLogOut);

// add middle ware to check the i   ncoming request data in form, use express-validator , then this package
// check that is there any invalid data in the feild in req data form, if req has wrong validating data
// it will be send to the next middleware.we can customize and chain the middleware to check and custom error message
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("The email is wrong,enter the valid email")
      .custom((value) => {
        // this will a promise, this promise will alway reject , then the check middleware will take the error of our promise reject
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "This email was registed for an existed accoutn"
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "The password need to be exceed 5 characters , includes number and normal character"
    )
      .isLength({
        min: 5,
      })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (req.body.password !== value) {
          throw new Error(
            "Confirm password not match the password,please try again"
          );
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignUp
);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
