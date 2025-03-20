const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const authMiddleware = require("../middleware/auth.middleware");

// ✅ 사용자 정보 조회 API (JWT 인증 필요)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [req.user.user_id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 에러", err);
  }
});

module.exports = router;