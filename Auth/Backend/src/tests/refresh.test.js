process.env.JWT_ACCESS_TOKEN_SECRET_KEY =
    "test-access-token-secret-for-refresh";
process.env.JWT_REFRESH_TOKEN_SECRET_KEY =
    "test-refresh-token-secret-for-refresh";
process.env.DOTENV_CONFIG_QUIET = "true";

const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.doMock("../model/user.model.js", () => ({
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
}));

const userModel = require("../model/user.model");
const app = require("../app");

const existingUser = {
    _id: "refresh-user-id",
    email: "sam@example.com",
    mobileNo: "0123456789",
    fullName: {
        firstName: "Sam",
        lastName: "Taylor",
    },
};

const refreshToken = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY
);

beforeEach(() => {
    userModel.findById.mockReset();
    userModel.findById.mockResolvedValue(existingUser);
});

describe("POST /api/auth/refresh", () => {
    it("issues a fresh access cookie for a valid refresh token", async () => {
        const response = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", `refreshToken=${refreshToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            "Access token refreshed successfully"
        );
        expect(userModel.findById).toHaveBeenCalledWith(
            existingUser._id
        );

        const accessCookie = response.headers["set-cookie"].find(
            (cookie) => cookie.startsWith("accessToken=")
        );
        expect(accessCookie).toBeDefined();
        expect(accessCookie).toMatch(/; HttpOnly/i);

        const token = accessCookie
            .split(";")[0]
            .slice("accessToken=".length);
        expect(jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY))
            .toMatchObject({
                id: existingUser._id,
                email: existingUser.email,
                mobileNo: existingUser.mobileNo,
                fullName: existingUser.fullName,
            });
    });

    it("rejects a request without a refresh token", async () => {
        const response = await request(app)
            .post("/api/auth/refresh");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            "Refresh token not found. Please login first."
        );
        expect(userModel.findById).not.toHaveBeenCalled();
    });

    it("rejects an expired refresh token", async () => {
        const expiredToken = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: -1 }
        );

        const response = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", `refreshToken=${expiredToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            "Unauthorized, invalid refresh token"
        );
        expect(userModel.findById).not.toHaveBeenCalled();
    });

    it("returns not found if the token user no longer exists", async () => {
        userModel.findById.mockResolvedValue(null);

        const response = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", `refreshToken=${refreshToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("user not found");
    });

    it("returns an internal server error when looking up the user fails", async () => {
        userModel.findById.mockRejectedValue(
            new Error("database unavailable")
        );

        const response = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", `refreshToken=${refreshToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: "internal server error",
            error: "database unavailable",
        });
    });
});
