// src/modules/auth/auth.routes.js

const router = require("express").Router();
const controller = require("./auth.controller");

const {
  validateRegister,
  validateLogin,
  validateSetPassword,
  validateVerifyOTP
} = require("./auth.validation");

/* =========================
   REGISTER
========================= */
router.post("/register", validateRegister, controller.register);

/* =========================
   VERIFY OTP
========================= */
router.post("/verify-otp", validateVerifyOTP, controller.verifyOTP);

/* =========================
   SET PASSWORD
========================= */
router.post("/set-password", validateSetPassword, controller.setPassword);

/* =========================
   LOGIN
========================= */
router.post("/login", validateLogin, controller.login);

module.exports = router;