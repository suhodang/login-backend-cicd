const request = require("supertest");
const app = require("../../../app");
const { pool } = require("../../../config/db");

beforeAll(async () => {
    await pool.query("DELETE FROM users"); // ✅ 테스트 전 데이터 초기화
});

afterAll(async () => {
    await pool.end(); // ✅ 테스트 후 DB 연결 종료
});

describe("🔹 Auth API 통합 테스트", () => {
    let token;

    test("✅ 회원가입 성공", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "User registered successfully");
        expect(res.body).toHaveProperty("user");
    });

    test("❌ 중복 이메일 회원가입 실패", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                username: "testuser2",
                email: "test@example.com",
                password: "password123"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "User already exists");
    });

    test("✅ 로그인 성공", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        token = res.body.token;
    });

    test("❌ 로그인 실패 (잘못된 비밀번호)", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "wrongpassword"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message", "Invalid email or password");
    });

    test("✅ JWT 인증 성공", async () => {
        const res = await request(app)
            .get("/api/users/me")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("email", "test@example.com");
    });

    test("❌ JWT 인증 실패 (토큰 없음)", async () => {
        const res = await request(app)
            .get("/api/users/me");

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message", "Unauthorized: No token provided");
    });
});