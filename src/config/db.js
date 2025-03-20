require("dotenv").config();
const { Pool } = require("pg");

// PostgreSQL 연결 풀 설정
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}${process.env.DB_PASSWORD ? `:${process.env.DB_PASSWORD}` : ""}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({ connectionString });

// DB 연결 테스트
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Database connected:", res.rows[0]);
    }
});

module.exports = { pool };