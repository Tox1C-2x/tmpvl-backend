// src/modules/attendance/attendance.routes.js

const express = require("express");
const router = express.Router();
const pool = require("../../config/db");

// GET all attendance
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tmpvl.attendance ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// Example: Check-in
router.post("/check-in", async (req, res) => {
  const { employee_id } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO tmpvl.attendance (employee_id, check_in) VALUES ($1, NOW()) RETURNING *",
      [employee_id]
    );

    res.status(201).json({
      success: true,
      message: "Check-in successful",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ error: "Check-in failed" });
  }
});

module.exports = router;