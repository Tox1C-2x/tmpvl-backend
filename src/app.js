// src/app.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");

// Leave Route --

const leaveRoutes = require("./modules/leave/leave.routes");


const gateRoutes = require("./modules/gate/gate.routes");
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
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

module.exports = app;