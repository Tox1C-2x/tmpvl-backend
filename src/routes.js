const express = require("express");

const authRoutes = require("./modules/auth/auth.routes");
const attendanceRoutes = require("./modules/attendance/attendance.routes");
const salaryRoutes = require("./modules/salary/salary.routes");
const leaveRoutes = require("./modules/leave/leave.routes");
const gateRoutes = require("./modules/gate/gate.routes");

const router = express.Router();

// Health Check Route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TMPVL Backend API Running 🚀",
  });
});

// Module Routes
router.use("/auth", authRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/salary", salaryRoutes);
router.use("/leave", leaveRoutes);
router.use("/gate", gateRoutes);

module.exports = router;