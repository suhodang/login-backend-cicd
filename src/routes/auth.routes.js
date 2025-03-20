const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

// 회원가입 API
router.post("/signup", async (req, res) => {
    console.log("📌 req.body:", req.body); // 디버깅용 로그 추가

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (!existingUser.rows) {
            return res.status(500).json({ message: "Database query failed" });
        }

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 비밀번호 해싱 후 저장 (password_hash 컬럼 사용)
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 로그인 API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (!user.rows || user.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // JWT 토큰 발급
        const token = jwt.sign({ user_id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.json({ token });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;