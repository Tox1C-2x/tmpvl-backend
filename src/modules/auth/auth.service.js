// src/modules/auth/auth.service.js

const pool = require("../../config/db");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../config/jwt");

/* =========================
   REGISTER (STEP 1)
========================= */
exports.register = async ({ employee_id, full_name, email, mobile }) => {

  // Check if already permanent user
  const existingUser = await pool.query(
    `SELECT * FROM tmpvl.users WHERE employee_id=$1 OR mobile=$2`,
    [employee_id, mobile]
  );

  if (existingUser.rows.length > 0) {
    throw { statusCode: 400, message: "User already exists" };
  }

  // Remove old pending record if exists
  await pool.query(
    `DELETE FROM tmpvl.pending_users WHERE mobile=$1`,
    [mobile]
  );

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  await pool.query(
    `INSERT INTO tmpvl.pending_users
     (employee_id, full_name, email, mobile, otp, otp_expires_at)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [employee_id, full_name, email, mobile, otp, expiry]
  );

  console.log("📱 OTP:", otp);

  return {
    success: true,
    message: "OTP sent successfully",
    mobile
  };
};


/* =========================
   VERIFY OTP (STEP 2)
========================= */
exports.verifyOTP = async ({ mobile, otp }) => {

  const result = await pool.query(
    `SELECT * FROM tmpvl.pending_users WHERE mobile=$1`,
    [mobile]
  );

  if (result.rows.length === 0)
    throw { statusCode: 400, message: "No registration found" };

  const user = result.rows[0];

  if (new Date() > user.otp_expires_at)
    throw { statusCode: 400, message: "OTP expired" };

  if (user.otp !== otp)
    throw { statusCode: 400, message: "Invalid OTP" };

  return {
    success: true,
    message: "OTP verified successfully"
  };
};


/* =========================
   SET PASSWORD (STEP 3)
========================= */
exports.setPassword = async ({ mobile, password }) => {

  const result = await pool.query(
    `SELECT * FROM tmpvl.pending_users WHERE mobile=$1`,
    [mobile]
  );

  if (result.rows.length === 0)
    throw { statusCode: 400, message: "Registration not found" };

  const pendingUser = result.rows[0];

  const hashedPassword = await bcrypt.hash(password, 10);

  // Use transaction for safety
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO tmpvl.users
       (employee_id, full_name, email, mobile, password_hash, is_verified)
       VALUES ($1,$2,$3,$4,$5,true)`,
      [
        pendingUser.employee_id,
        pendingUser.full_name,
        pendingUser.email,
        pendingUser.mobile,
        hashedPassword
      ]
    );

    await client.query(
      `DELETE FROM tmpvl.pending_users WHERE mobile=$1`,
      [mobile]
    );

    await client.query("COMMIT");

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  return {
    success: true,
    message: "Account created successfully"
  };
};


/* =========================
   LOGIN
========================= */
exports.login = async ({ employee_id, password }) => {

  const result = await pool.query(
    `SELECT * FROM tmpvl.users WHERE employee_id=$1`,
    [employee_id]
  );

  if (result.rows.length === 0)
    throw { statusCode: 400, message: "Wrong Employee ID" };

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch)
    throw { statusCode: 400, message: "Invalid Password" };

  const token = generateToken({
    employee_id: user.employee_id,
    full_name: user.full_name,
    email: user.email
  });

  return {
    success: true,
    token,
    employee_id: user.employee_id,
    full_name: user.full_name,
    email: user.email,
    mobile: user.mobile
  };
};


/* =========================
   RESEND OTP
========================= */
exports.resendOTP = async ({ mobile }) => {

  const result = await pool.query(
    `SELECT * FROM tmpvl.pending_users WHERE mobile=$1`,
    [mobile]
  );

  if (result.rows.length === 0)
    throw { statusCode: 400, message: "Registration not found" };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  await pool.query(
    `UPDATE tmpvl.pending_users
     SET otp=$1,
         otp_expires_at=$2
     WHERE mobile=$3`,
    [otp, expiry, mobile]
  );

  console.log("🔁 RESEND OTP:", otp);

  return {
    success: true,
    message: "OTP resent successfully"
  };
};