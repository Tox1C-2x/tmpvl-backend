// src/modules/salary/salary.routes.js

const router = require("express").Router();
const controller = require("./salary.controller");
const { authenticateToken } = require("../../middlewares/auth.middleware");

// Salary generate karne ke liye
router.post("/generate", authenticateToken, controller.generate);

// Saari salary history dekhne ke liye
router.get("/my-salary", authenticateToken, controller.mySalary);

// Backend se PDF download karne ke liye
router.get("/download/:id", authenticateToken, controller.downloadPDF);

module.exports = router;