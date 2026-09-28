process.env.JWT_ACCESS_TOKEN_SECRET_KEY ||= "test-access-token-secret-for-registration";
process.env.JWT_REFRESH_TOKEN_SECRET_KEY ||= "test-refresh-token-secret-for-registration";

const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const userModel = require("../model/user.model");

const validUser = {
    email: "sam@example.com",
    mobileNo: "0123456789",
    fullName: {
        firstName: "Sam",
        lastName: "Taylor"
    },
    password: "correct-horse-battery",
};

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
    await userModel.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer?.stop();
});

describe("POST /api/auth/register", () => {
    it("creates a user, stores a password hash, and returns secure auth cookies", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send(validUser);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            message: "user registered successfully",
            user: {
                email: validUser.email,
                mobileNo: validUser.mobileNo,
                fullName: validUser.fullName,
                role: "user",
            },
        });
        expect(response.body.user).toHaveProperty("_id");
        expect(response.body.user).not.toHaveProperty("password");

        const savedUser = await userModel.findById(response.body.user._id);
        expect(savedUser).not.toBeNull();
        expect(savedUser.mobileNo).toBe(validUser.mobileNo);
        expect(savedUser.password).not.toBe(validUser.password);
        await expect(bcrypt.compare(validUser.password, savedUser.password)).resolves.toBe(true);

        const cookies = response.headers["set-cookie"] ?? [];
        for (const cookieName of ["accessToken", "refreshToken"]) {
            const cookie = cookies.find((value) => value.startsWith(`${cookieName}=`));
            expect(cookie).toBeDefined();
            expect(cookie).toMatch(/;\s*httponly/i);

            const token = cookie.split(";")[0].slice(cookieName.length + 1);
            const secret = cookieName === "accessToken"
                ? process.env.JWT_ACCESS_TOKEN_SECRET_KEY
                : process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
            expect(() => jwt.verify(token, secret)).not.toThrow();
        }
    });

    it.each([
        ["email", { email: "not-an-email" }],
        ["mobileNo", { mobileNo: "123" }],
        ["fullName.firstName", { fullName: { firstName: "A", lastName: "Taylor" } }],
        ["password", { password: "short" }],
    ])("rejects an invalid %s", async (field, override) => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({ ...validUser, ...override });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toEqual(
            expect.arrayContaining([expect.objectContaining({ path: field })]),
        );
    });

    it.each(["email", "mobileNo"])("rejects a duplicate %s without exposing the existing user", async (field) => {
        await request(app).post("/api/auth/register").send(validUser).expect(201);

        const duplicateUser = {
            ...validUser,
            email: field === "email" ? validUser.email : "another@example.com",
            mobileNo: field === "mobileNo" ? validUser.mobileNo : "9876543210",
        };
        const response = await request(app)
            .post("/api/auth/register")
            .send(duplicateUser);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("user already exist");
        expect(response.body).not.toHaveProperty("isUserExist");
        expect(response.headers["set-cookie"]).toBeUndefined();
    });
});