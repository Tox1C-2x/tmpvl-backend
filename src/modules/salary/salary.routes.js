// src/modules/salary/salary.routes.js

const router = require("express").Router();
const controller = require("./salary.controller");
const { authenticateToken } = require("../../middlewares/auth.middleware");

router.post("/generate", authenticateToken, controller.generate);
router.get("/my-salary", authenticateToken, controller.mySalary);

module.exports = router;