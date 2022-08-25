const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogIn);

router.post("/login", authController.postLogIn);

module.exports = router;
