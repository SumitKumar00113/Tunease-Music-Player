
process.env.JWT_ACCESS_TOKEN_SECRET_KEY =
    "test-access-token-secret-for-registration";

process.env.JWT_REFRESH_TOKEN_SECRET_KEY =
    "test-refresh-token-secret-for-registration";

process.env.DOTENV_CONFIG_QUIET = "true";

const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mock user model
jest.doMock("../model/user.model.js", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));
jest.doMock("../messageBroker/rabbit.js", () => ({
    publishToQueue: jest.fn().mockResolvedValue(true),
}));

const userModel = require("../model/user.model");
const { publishToQueue } = require("../messageBroker/rabbit");
const app = require("../app");

const validUser = {
    email: "sam@example.com",
    mobileNo: "0123456789",
    fullName: {
        firstName: "Sam",
        lastName: "Taylor",
    },
    password: "correct-horse-battery",
};

beforeEach(() => {
    userModel.findOne.mockReset();
    userModel.create.mockReset();
    publishToQueue.mockReset().mockResolvedValue(true);

    userModel.findOne.mockResolvedValue(null);
});

describe("POST /api/auth/register", () => {

    // ------------------------------------------
    // Successful registration
    // ------------------------------------------

    it("creates a user with a hashed password and returns auth cookies", async () => {

        userModel.create.mockImplementation(async (userData) => ({
            _id: "registered-user-id",
            role: "user",
            ...userData,
        }));

        const response = await request(app)
            .post("/api/auth/register")
            .send(validUser);

        expect(response.status).toBe(201);
        expect(publishToQueue).toHaveBeenCalledWith(
            "user_created",
            expect.objectContaining({ email: validUser.email })
        );

        expect(response.body).toMatchObject({
            message: "User registered successfully",

            user: {
                _id: "registered-user-id",
                email: validUser.email,
                mobileNo: validUser.mobileNo,
                fullName: validUser.fullName,
                role: "user",
            },
        });

        // Password should never be returned
        expect(response.body.user).not.toHaveProperty("password");

        // Check duplicate-user query
        expect(userModel.findOne).toHaveBeenCalledWith({
            $or: [
                { email: validUser.email },
                { mobileNo: validUser.mobileNo },
            ],
        });

        // User should be created once
        expect(userModel.create).toHaveBeenCalledTimes(1);

        // Get data passed to create()
        const savedUserData =
            userModel.create.mock.calls[0][0];

        expect(savedUserData.mobileNo).toBe(
            validUser.mobileNo
        );

        // Password must be hashed
        expect(savedUserData.password).not.toBe(
            validUser.password
        );

        // Verify hashed password
        await expect(
            bcrypt.compare(
                validUser.password,
                savedUserData.password
            )
        ).resolves.toBe(true);

        // ------------------------------------------
        // Check cookies
        // ------------------------------------------

        const cookies =
            response.headers["set-cookie"] || [];

        for (const cookieName of [
            "accessToken",
            "refreshToken",
        ]) {

            const cookie = cookies.find((value) =>
                value.startsWith(`${cookieName}=`)
            );

            expect(cookie).toBeDefined();

            // Cookie must be HttpOnly
            expect(cookie).toMatch(
                /;\s*httpOnly/i
            );

            // Extract token
            const token = cookie
                .split(";")[0]
                .slice(cookieName.length + 1);

            const secret =
                cookieName === "accessToken"
                    ? process.env.JWT_ACCESS_TOKEN_SECRET_KEY
                    : process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

            // Token must be valid JWT
            expect(() =>
                jwt.verify(token, secret)
            ).not.toThrow();
        }
    });

    // ------------------------------------------
    // Validation tests
    // ------------------------------------------

    it.each([
        ["email", { email: "not-an-email" }],
        ["mobileNo", { mobileNo: "123" }],
        ["fullName.firstName", { fullName: { firstName: "A", lastName: "Taylor" } }],
        ["password", { password: "short" }],
    ])("rejects an invalid %s", async (field, override) => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                ...validUser,
                ...override,
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: field }),
            ])
        );
        expect(userModel.findOne).not.toHaveBeenCalled();
        expect(userModel.create).not.toHaveBeenCalled();
    });

    it("rejects a request with all required fields missing", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: "email" }),
                expect.objectContaining({ path: "mobileNo" }),
                expect.objectContaining({ path: "fullName.firstName" }),
                expect.objectContaining({ path: "password" }),
            ])
        );
        expect(userModel.findOne).not.toHaveBeenCalled();
        expect(userModel.create).not.toHaveBeenCalled();
    });

    // ------------------------------------------
    // Duplicate email/mobile
    // ------------------------------------------

    it.each(["email", "mobileNo"])(
        "rejects duplicate %s without exposing existing user",
        async (field) => {
            userModel.findOne.mockResolvedValue({
                _id: "existing-user-id",
                email:
                    field === "email"
                        ? validUser.email
                        : "other@example.com",
                mobileNo:
                    field === "mobileNo"
                        ? validUser.mobileNo
                        : "9876543210",
            });

            const response = await request(app)
                .post("/api/auth/register")
                .send(validUser);

            expect(response.status).toBe(409);
            expect(response.body.message).toBe("User already exists");
            expect(response.body).not.toHaveProperty("isUserExist");
            expect(response.headers["set-cookie"]).toBeUndefined();
            expect(userModel.create).not.toHaveBeenCalled();
        }
    );

    it("returns an internal server error when the user lookup fails", async () => {
        userModel.findOne.mockRejectedValue(
            new Error("database unavailable")
        );

        const response = await request(app)
            .post("/api/auth/register")
            .send(validUser);

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: "Internal server error during user registration",
            error: "database unavailable",
        });
        expect(userModel.create).not.toHaveBeenCalled();
    });

    it("returns an internal server error when user creation fails", async () => {
        userModel.create.mockRejectedValue(
            new Error("database unavailable")
        );

        const response = await request(app)
            .post("/api/auth/register")
            .send(validUser);

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: "Internal server error during user registration",
            error: "database unavailable",
        });
        expect(userModel.create).toHaveBeenCalledTimes(1);
    });
});

