const { Pool } = require("pg");

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || process.env.DB_NAME || "social_app",
    };

const pool = new Pool(poolConfig);

const poolPromise = pool
  .connect()
  .then((client) => {
    client.release();
    console.log("Connected to PostgreSQL");
    return pool;
  })
  .catch((err) => {
    console.error("DB Error:", err.message);
    throw err;
  });

const buildInClause = (ids, startIndex = 1) => {
  const placeholders = ids.map((_, i) => `$${startIndex + i}`).join(", ");
  return { placeholders, values: ids, nextIndex: startIndex + ids.length };
};

module.exports = { pool, poolPromise, buildInClause };
