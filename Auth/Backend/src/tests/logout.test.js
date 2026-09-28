process.env.JWT_ACCESS_TOKEN_SECRET_KEY =
    "test-access-token-secret-for-logout";
process.env.JWT_REFRESH_TOKEN_SECRET_KEY =
    "test-refresh-token-secret-for-logout";
process.env.DOTENV_CONFIG_QUIET = "true";

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

const accessToken = jwt.sign(
    { id: "logout-user-id", email: "sam@example.com" },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY
);

describe("GET /api/auth/delete", () => {
    it("rejects a request without an access token", async () => {
        const response = await request(app)
            .post("/api/auth/delete");

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            success: false,
            message: "Access token is required",
        });
    });

    it("rejects an invalid access token", async () => {
        const response = await request(app)
            .post("/api/auth/delete")
            .set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            success: false,
            message: "Invalid or expired access token",
        });
    });

    it("rejects an expired access token", async () => {
        const expiredToken = jwt.sign(
            { id: "logout-user-id" },
            process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: -1 }
        );

        const response = await request(app)
            .post("/api/auth/delete")
            .set("Authorization", `Bearer ${expiredToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            "Invalid or expired access token"
        );
    });

    it("clears authentication cookies for a valid access token", async () => {
        const response = await request(app)
            .post("/api/auth/delete")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Logged out successfully");

        const cookies = response.headers["set-cookie"] || [];

        for (const cookieName of ["accessToken", "refreshToken"]) {
            const cookie = cookies.find((value) =>
                value.startsWith(`${cookieName}=`)
            );

            expect(cookie).toBeDefined();
            expect(cookie).toMatch(/expires=Thu, 01 Jan 1970/i);
        }
    });
});
