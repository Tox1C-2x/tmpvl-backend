require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Har connection par search_path set hoga
pool.on("connect", (client) => {
  client.query("SET search_path TO tmpvl");
});

pool.connect()
  .then(client => {
    console.log("✅ PostgreSQL Connected (tmpvl schema active)");
    client.release();
  })
  .catch(err => {
    console.error("❌ DB Connection Failed:", err);
  });

module.exports = pool;