const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// JSON 데이터를 읽을 수 있도록 설정 (이 코드가 없으면 req.body가 undefined 됨)
app.use(express.json());

// 보안 및 로깅 미들웨어 추가
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// API 라우트 연결
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;