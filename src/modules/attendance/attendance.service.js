// src/modules/attendance/attendance.service.js

const pool = require("../../config/db");
const { calculateHours } = require("../../utils/calculateHours");
const {
  emitAttendanceUpdate
} = require("../../sockets/attendance.socket");

exports.checkIn = async (emp_id) => {
  const today = new Date().toISOString().split("T")[0];

  const existing = await pool.query(
    "SELECT * FROM attendance WHERE emp_id=$1 AND attendance_date=$2",
    [emp_id, today]
  );

  if (existing.rows.length > 0) {
    throw { statusCode: 400, message: "Already checked in today" };
  }

  await pool.query(
    `INSERT INTO attendance
     (emp_id, attendance_date, check_in, status)
     VALUES ($1,$2,NOW(),'Present')`,
    [emp_id, today]
  );

  // 🔥 Real-time emit
  emitAttendanceUpdate(emp_id, {
    message: "Checked in successfully",
    time: new Date()
  });

  return { message: "Check-in successful" };
};

exports.checkOut = async (emp_id) => {
  const today = new Date().toISOString().split("T")[0];

  const record = await pool.query(
    "SELECT * FROM attendance WHERE emp_id=$1 AND attendance_date=$2",
    [emp_id, today]
  );

  if (record.rows.length === 0) {
    throw { statusCode: 400, message: "No check-in found" };
  }

  const checkInTime = record.rows[0].check_in;
  const checkOutTime = new Date();

  const { totalHours, overtimeHours } =
    calculateHours(checkInTime, checkOutTime);

  await pool.query(
    `UPDATE attendance
     SET check_out=NOW(),
         total_hours=$1,
         overtime_hours=$2
     WHERE emp_id=$3 AND attendance_date=$4`,
    [totalHours, overtimeHours, emp_id, today]
  );

  // 🔥 Real-time emit
  emitAttendanceUpdate(emp_id, {
    message: "Checked out successfully",
    totalHours,
    overtimeHours
  });

  return { message: "Check-out successful" };
};

exports.getAttendance = async (emp_id) => {
  const result = await pool.query(
    `SELECT * FROM attendance
     WHERE emp_id=$1
     ORDER BY attendance_date DESC`,
    [emp_id]
  );

  return result.rows;
};