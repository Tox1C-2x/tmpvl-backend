const cron = require("node-cron");
const pool = require("../config/db");

// Every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    await pool.query(
      `DELETE FROM tmpvl.users
       WHERE is_verified=false
       AND otp_expires_at IS NOT NULL
       AND otp_expires_at < NOW()`
    );

    console.log("🧹 Cleanup executed");
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});