// src/modules/leave/leave.service.js

const pool = require("../../config/db");

exports.applyLeave = async ({ emp_id, from_date, to_date, reason }) => {
  const result = await pool.query(
    `INSERT INTO leaves 
     (emp_id, from_date, to_date, reason, status, applied_at)
     VALUES ($1,$2,$3,$4,'Pending',NOW())
     RETURNING *`,
    [emp_id, from_date, to_date, reason]
  );

  return result.rows[0];
};

exports.getMyLeaves = async (emp_id) => {
  const result = await pool.query(
    `SELECT * FROM leaves
     WHERE emp_id=$1
     ORDER BY applied_at DESC`,
    [emp_id]
  );

  return result.rows;
};

exports.updateLeaveStatus = async (leave_id, status) => {
  if (!["Approved", "Rejected"].includes(status)) {
    throw { statusCode: 400, message: "Invalid status" };
  }

  const result = await pool.query(
    `UPDATE leaves
     SET status=$1
     WHERE id=$2
     RETURNING *`,
    [status, leave_id]
  );

  return result.rows[0];
};