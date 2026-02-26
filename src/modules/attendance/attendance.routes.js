// src/modules/attendance/attendance.routes.js

const router = require("express").Router();
const controller = require("./attendance.controller");
const { authenticateToken } = require("../../middlewares/auth.middleware");

router.post("/check-in", authenticateToken, controller.checkIn);
router.post("/check-out", authenticateToken, controller.checkOut);
router.get("/my-attendance", authenticateToken, controller.getMyAttendance);

module.exports = router;