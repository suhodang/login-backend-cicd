require("dotenv").config();
const app = require("./app");
const { pool } = require("./config/db");

// ✅ 서버 실행
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});