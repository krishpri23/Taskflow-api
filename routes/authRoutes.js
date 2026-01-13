const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const loginLimiter = require("../middleware/loginLimiter");

router.route("/auth/login").post(loginLimiter, authController.login);
router.route("/auth/register").post(authController.register);

router.route("/refresh").get(authController.refresh);

router.route("/logout").post(authController.logout);

module.exports = router;
