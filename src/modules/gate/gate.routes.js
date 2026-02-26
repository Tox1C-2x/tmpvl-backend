// src/modules/gate/gate.routes.js

const router = require("express").Router();
const controller = require("./gate.controller");
const { authenticateToken } = require("../../middlewares/auth.middleware");

router.post("/punch", authenticateToken, controller.punch);
router.get("/my-punches", authenticateToken, controller.myPunches);
router.get("/by-date", authenticateToken, controller.punchByDate);

module.exports = router;