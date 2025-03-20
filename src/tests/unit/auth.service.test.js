const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ `bcrypt.hash()`를 테스트
test("비밀번호 해싱 테스트", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    expect(hashedPassword).not.toBe(password); // 원본 비밀번호와 해시가 달라야 함
});

// ✅ `bcrypt.compare()`를 테스트
test("비밀번호 비교 테스트", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(password, hashedPassword);

    expect(isMatch).toBe(true);
});

// ✅ `jsonwebtoken.sign()`을 테스트
test("JWT 토큰 생성 테스트", () => {
    const payload = { user_id: 1 };
    const token = jwt.sign(payload, "test_secret", { expiresIn: "1h" });

    expect(token).toBeDefined();
});