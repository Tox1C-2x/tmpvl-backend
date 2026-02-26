// src/modules/leave/leave.routes.js

const router = require("express").Router();
const controller = require("./leave.controller");
const { authenticateToken } = require("../../middlewares/auth.middleware");

router.post("/apply", authenticateToken, controller.apply);
router.get("/my-leaves", authenticateToken, controller.myLeaves);
router.post("/update-status", authenticateToken, controller.updateStatus);

module.exports = router;