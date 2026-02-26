// src/modules/auth/auth.validation.js

/* =========================
   REGISTER (STEP 1)
========================= */
exports.validateRegister = (req, res, next) => {
  const { employee_id, full_name, email, mobile, password } = req.body;

  if (!employee_id || !full_name || !email || !mobile || !password) {
    return res.status(400).json({
      success: false,
      error: "employee_id, full_name, email, mobile, password are required"
    });
  }

  /* ================= EMAIL REGEX ================= */
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format"
    });
  }

  /* ================= MOBILE REGEX (India) ================= */
  const mobileRegex = /^[6-9]\d{9}$/;

  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({
      success: false,
      error: "Invalid mobile number"
    });
  }

  /* ================= NAME REGEX (First + Last Required) ================= */
  // Example valid: John Deo
  const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)+$/;

  if (!nameRegex.test(full_name.trim())) {
    return res.status(400).json({
      success: false,
      error: "Full name must contain first and last name (e.g., John Deo)"
    });
  }
  next();
};
  



/* =========================
   VERIFY OTP (STEP 2)
========================= */
exports.validateVerifyOTP = (req, res, next) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({
      success: false,
      error: "mobile and otp are required"
    });
  }

  if (otp.length !== 6) {
    return res.status(400).json({
      success: false,
      error: "OTP must be 6 digits"
    });
  }
  next();
};
  


/* =========================
   SET PASSWORD (STEP 3)
========================= */
exports.validateSetPassword = (req, res, next) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({
      success: false,
      error: "mobile and password are required"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters"
    });
  }
  
    // Password Regex
  
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-])[A-Za-z\d@$!%*?&#^()_\-]{8,14}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      error:
        "Password must be 8-14 characters and include uppercase, lowercase, number and special character"
    });
  }

  next();
};


/* =========================
   LOGIN
========================= */
exports.validateLogin = (req, res, next) => {
  const { employee_id, password } = req.body;

  if (!employee_id || !password) {
    return res.status(400).json({
      success: false,
      error: "employee_id and password are required"
    });
  }

  next();
};