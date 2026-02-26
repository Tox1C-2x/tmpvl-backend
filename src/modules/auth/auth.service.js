// src/modules/auth/auth.service.js

const pool = require("../../config/db");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../config/jwt");

/* =========================
   REGISTER (STEP 1)
   Generate Mobile OTP
========================= */
exports.register = async (data) => {
  const { employee_id, full_name, email, mobile } = data;

  const existing = await pool.query(
    `SELECT * FROM tmpvl.users WHERE employee_id=$1 OR mobile=$2`,
    [employee_id, mobile]
  );

  if (existing.rows.length > 0) {
    throw { statusCode: 400, message: "User already exists" };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await pool.query(
    `INSERT INTO tmpvl.users 
     (employee_id, full_name, email, mobile, phone_otp, otp_expires_at)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [employee_id, full_name, email, mobile, otp, expiry]
  );

  // DEV MODE OTP
  console.log("📱 OTP for", mobile, ":", otp);
  console.log("⏳ Expires at:", expiry);

  return {
    success: true,
    message: "OTP sent to mobile number",
    mobile
  };
};

/* =========================
   VERIFY OTP (STEP 2)
========================= */
exports.verifyOTP = async ({ mobile, otp }) => {

  const result = await pool.query(
    `SELECT * FROM tmpvl.users WHERE mobile=$1`,
    [mobile]
  );

  if (result.rows.length === 0) {
    throw { statusCode: 404, message: "User not found" };
  }

  const user = result.rows[0];

  if (user.otp_attempts >= 3) {
    throw { statusCode: 400, message: "Too many attempts. Please resend OTP." };
  }

  if (!user.otp_expires_at || new Date() > user.otp_expires_at) {
    throw { statusCode: 400, message: "OTP expired" };
  }

  if (user.phone_otp !== otp) {

    await pool.query(
      `UPDATE tmpvl.users 
       SET otp_attempts = otp_attempts + 1
       WHERE mobile=$1`,
      [mobile]
    );

    throw { statusCode: 400, message: "Invalid OTP" };
  }

  await pool.query(
    `UPDATE tmpvl.users
     SET is_verified=true,
         phone_otp=NULL,
         otp_expires_at=NULL,
         otp_attempts=0
     WHERE mobile=$1`,
    [mobile]
  );

  return {
    success: true,
    message: "OTP verified successfully"
  };
};

/* =========================
   SET PASSWORD (STEP 3)
========================= */
exports.setPassword = async ({ mobile, password }) => {

  const userCheck = await pool.query(
    `SELECT * FROM tmpvl.users WHERE mobile=$1`,
    [mobile]
  );

  if (userCheck.rows.length === 0) {
    throw { statusCode: 404, message: "User not found" };
  }

  const user = userCheck.rows[0];

  if (!user.is_verified) {
    throw { statusCode: 400, message: "Please verify OTP first" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    `UPDATE tmpvl.users 
     SET password_hash=$1 
     WHERE mobile=$2`,
    [hashedPassword, mobile]
  );

  return {
    success: true,
    message: "Password set successfully"
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

  if (result.rows.length === 0) {
    throw { statusCode: 400, message: "Wrong Employee ID" };
  }

  const user = result.rows[0];

  if (!user.password_hash) {
    throw { statusCode: 400, message: "Password not set. Complete registration first." };
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw { statusCode: 400, message: "Invalid Password" };
  }

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

// resend otp \\

exports.resendOTP = async ({ mobile }) => {

  const result = await pool.query(
    `SELECT * FROM tmpvl.users WHERE mobile=$1`,
    [mobile]
  );

  if (result.rows.length === 0) {
    throw { statusCode: 404, message: "User not found" };
  }

  const user = result.rows[0];

  // 30 sec cooldown check
  if (user.otp_last_sent_at) {
    const diff = (Date.now() - new Date(user.otp_last_sent_at).getTime()) / 1000;
    if (diff < 30) {
      throw { 
        statusCode: 400, 
        message: `Please wait ${Math.ceil(30 - diff)} seconds before resending OTP` 
      };
    }
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  await pool.query(
    `UPDATE tmpvl.users
     SET phone_otp=$1,
         otp_expires_at=$2,
         otp_attempts=0,
         otp_last_sent_at=NOW()
     WHERE mobile=$3`,
    [newOtp, expiry, mobile]
  );

  console.log("🔁 RESEND OTP:", newOtp);

  return {
    success: true,
    message: "OTP resent successfully"
  };
};