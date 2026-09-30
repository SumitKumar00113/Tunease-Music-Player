process.env.JWT_ACCESS_TOKEN_SECRET_KEY =
    "test-access-token-secret-for-login";
process.env.JWT_REFRESH_TOKEN_SECRET_KEY =
    "test-refresh-token-secret-for-login";
process.env.DOTENV_CONFIG_QUIET = "true";

const request = require("supertest");
const bcrypt = require("bcrypt");

jest.doMock("../model/user.model.js", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

const userModel = require("../model/user.model");
const app = require("../app");

const credentials = {
    email: "sam@example.com",
    password: "correct-horse-battery",
};

let existingUser;

beforeAll(async () => {
    existingUser = {
        _id: "login-user-id",
        email: credentials.email,
        mobileNo: "0123456789",
        fullName: {
            firstName: "Sam",
            lastName: "Taylor",
        },
        role: "user",
        password: await bcrypt.hash(credentials.password, 12),
    };
});

beforeEach(() => {
    userModel.findOne.mockReset();
    userModel.findOne.mockResolvedValue(existingUser);
});

describe("GET /api/auth/login", () => {
    it("logs in with valid credentials", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send(credentials);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            message: "User logged in successfully",
            user: {
                _id: existingUser._id,
                email: existingUser.email,
            },
        });
        expect(response.headers["set-cookie"]).toEqual(
            expect.arrayContaining([
                expect.stringMatching(/^accessToken=/),
                expect.stringMatching(/^refreshToken=/),
            ])
        );
        expect(userModel.findOne).toHaveBeenCalledWith({
            email: credentials.email
        });
    });

    it("returns not found when the user does not exist", async () => {
        userModel.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post("/api/auth/login")
            .send(credentials);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe(
            "User not found, please register your account first"
        );
    });

    it("rejects an incorrect password", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                ...credentials,
                password: "incorrect-password",
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid password");
    });

    it("rejects an invalid email before querying the user model", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                ...credentials,
                email: "not-an-email",
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(userModel.findOne).not.toHaveBeenCalled();
    });

    it("rejects missing email and password before querying the user model", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(userModel.findOne).not.toHaveBeenCalled();
    });

    it("returns an internal server error when the user lookup fails", async () => {
        userModel.findOne.mockRejectedValue(
            new Error("database unavailable")
        );

        const response = await request(app)
            .post("/api/auth/login")
            .send(credentials);

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: "Internal server error during login",
            error: "database unavailable",
        });
    });
});
