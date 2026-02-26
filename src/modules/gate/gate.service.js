// src/modules/gate/gate.service.js

const pool = require("../../config/db");
const { emitGatePunch } = require("../../sockets/attendance.socket");

exports.punchGate = async ({ emp_id, punch_type, gate_id, device_id }) => {
  if (!["IN", "OUT"].includes(punch_type)) {
    throw { statusCode: 400, message: "Invalid punch type" };
  }

  const result = await pool.query(
    `INSERT INTO gate_punching
     (emp_id, punch_type, punch_time, gate_id, device_id)
     VALUES ($1,$2,NOW(),$3,$4)
     RETURNING *`,
    [emp_id, punch_type, gate_id || null, device_id || null]
  );

  const punchData = result.rows[0];

  // 🔥 Real-time emit to employee
  emitGatePunch(emp_id, {
    message: "Gate punch recorded",
    data: punchData
  });

  return punchData;
};

exports.getMyPunches = async (emp_id) => {
  const result = await pool.query(
    `SELECT * FROM gate_punching
     WHERE emp_id=$1
     ORDER BY punch_time DESC`,
    [emp_id]
  );

  return result.rows;
};