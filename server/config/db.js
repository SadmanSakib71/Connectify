const sql = require("mssql");

const config = {
  user: "sa",
  password: "your_password",
  server: "localhost",
  database: "social_app",
  options: {
    encrypt: false, // local dev
    trustServerCertificate: true,
  },
  port: 1433,
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ MSSQL Connected");
    return pool;
  })
  .catch((err) => {
    console.log("❌ DB Error:", err);
  });

module.exports = { sql, poolPromise };
