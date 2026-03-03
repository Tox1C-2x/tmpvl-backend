// src/modules/leave/leave.service.js

const pool = require("../../config/db");

/* ================= APPLY LEAVE ================= */
exports.applyLeave = async (data) => {

  const { employee_id, leave_type, reason, start_date, end_date } = data;

  const result = await pool.query(
    `INSERT INTO tmpvl.leaves
     (employee_id, leave_type, reason, start_date, end_date)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [employee_id, leave_type, reason, start_date, end_date]
  );

  return result.rows[0];
};


/* ================= GET MY LEAVES ================= */
exports.getMyLeaves = async (employee_id) => {

  const result = await pool.query(
    `SELECT * FROM tmpvl.leaves
     WHERE employee_id=$1
     ORDER BY applied_at DESC`,
    [employee_id]
  );

  return result.rows;
};


/* ================= UPDATE STATUS (ADMIN) ================= */
exports.updateStatus = async (data) => {

  const { leave_id, status, reviewed_by } = data;

  const result = await pool.query(
    `UPDATE tmpvl.leaves
     SET status=$1,
         reviewed_at=NOW(),
         reviewed_by=$2
     WHERE id=$3
     RETURNING *`,
    [status, reviewed_by, leave_id]
  );

  return result.rows[0];
};