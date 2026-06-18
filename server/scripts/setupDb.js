require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../config/db");

const SCHEMA_FILES = ["schema.sql", "feedSchema.sql"];

const setupDb = async () => {
  for (const file of SCHEMA_FILES) {
    const sql = fs.readFileSync(
      path.join(__dirname, "../database", file),
      "utf8",
    );
    await pool.query(sql);
    console.log(`Applied ${file}`);
  }

  await pool.end();
  console.log("Database setup complete.");
};

setupDb().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
