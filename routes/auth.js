const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogIn);

router.get("/signup", authController.getSignUp);

router.post("/login", authController.postLogIn);

router.post("/logout", authController.postLogOut);

router.post("/signup", authController.postSignUp);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
