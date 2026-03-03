const cron = require("node-cron");
const pool = require("../config/db");

// Every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {

    await pool.query(`
      DELETE FROM tmpvl.pending_users p
      WHERE NOT EXISTS (
        SELECT 1 FROM tmpvl.otps o
        WHERE o.employee_id = p.employee_id
        AND o.expires_at > NOW()
      )
    `);

    console.log("🧹 Cleanup executed successfully");

  } catch (err) {
    console.error("Cleanup error:", err);
  }
});