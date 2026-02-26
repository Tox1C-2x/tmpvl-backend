// src/app.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const attendanceRoutes = require("./modules/attendance/attendance.routes");
const gateRoutes = require("./modules/gate/gate.routes");
const leaveRoutes = require("./modules/leave/leave.routes");
const salaryRoutes = require("./modules/salary/salary.routes");

const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 🔥 API Routes
const routes = require("./routes");
app.use("/api", routes);

// 🔥 Global Error Handler
app.use(errorHandler);

module.exports = app;