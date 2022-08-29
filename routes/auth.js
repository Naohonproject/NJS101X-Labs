const express = require("express");
const authController = require("../controllers/auth");
const { check } = require("express-validator");

const router = express.Router();

router.get("/login", authController.getLogIn);

router.get("/signup", authController.getSignUp);

router.post("/login", authController.postLogIn);

router.post("/logout", authController.postLogOut);

// add middle ware to check the incoming request data in form, use express-validator , then this package
// check that is there any invalid data in the feild in req data form, if req has wrong validating data
// it will be send to the next middleware.we can customize and chain the middleware to check and custom error message
router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("The email is wrong,enter the valid email")
    .custom((value, { req }) => {
      if (value === "ltb.198x@outlook.com") {
        throw new Error("This email address is forbidden");
      }
      return true;
    }),
  authController.postSignUp
);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
