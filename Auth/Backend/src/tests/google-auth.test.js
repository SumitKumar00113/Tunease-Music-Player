process.env.JWT_ACCESS_TOKEN_SECRET_KEY =
    "test-access-token-secret-for-google-auth";
process.env.JWT_REFRESH_TOKEN_SECRET_KEY =
    "test-refresh-token-secret-for-google-auth";
process.env.DOTENV_CONFIG_QUIET = "true";

jest.doMock("../model/user.model.js", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

const userModel = require("../model/user.model");
const authController = require("../controller/auth.controller");

const googleProfile = {
    id: "google-user-id",
    provider: "google",
    emails: [{ value: "sam@example.com" }],
    name: {
        givenName: "Sam",
        familyName: "Taylor",
    },
    photos: [{ value: "https://example.com/sam.jpg" }],
};

const createResponse = () => {
    const response = {
        cookie: jest.fn(),
        status: jest.fn(),
        json: jest.fn(),
        redirect: jest.fn(),
    };
    response.cookie.mockReturnValue(response);
    response.status.mockReturnValue(response);
    response.json.mockReturnValue(response);
    return response;
};

beforeEach(() => {
    userModel.findOne.mockReset();
    userModel.create.mockReset();
});

describe("Google authentication callback", () => {
    it("logs in an existing Google user and sets auth cookies and redirects", async () => {
        const existingUser = {
            _id: "existing-google-user-id",
            email: "sam@example.com",
            mobileNo: "0123456789",
            fullName: {
                firstName: "Sam",
                lastName: "Taylor",
            },
            role: "user",
            profilePhoto: "https://example.com/sam.jpg",
            password: "must-not-be-returned",
        };
        userModel.findOne.mockResolvedValue(existingUser);
        const response = createResponse();

        await authController.googleAuthCallBack(
            { user: googleProfile },
            response
        );

        expect(userModel.findOne).toHaveBeenCalledWith({
            $or: [
                { email: "sam@example.com" },
                { googleId: "google-user-id" },
            ],
        });
        expect(userModel.create).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith(expect.any(String));
        expect(response.cookie).toHaveBeenCalledTimes(2);
        expect(response.cookie).toHaveBeenNthCalledWith(
            1,
            "accessToken",
            expect.any(String),
            expect.objectContaining({ httpOnly: true })
        );
        expect(response.cookie).toHaveBeenNthCalledWith(
            2,
            "refreshToken",
            expect.any(String),
            expect.objectContaining({ httpOnly: true })
        );
    });

    it("creates a first-time Google user, sets auth cookies and redirects", async () => {
        const newUser = {
            _id: "new-google-user-id",
            email: "sam@example.com",
            googleId: "google-user-id",
            fullName: {
                firstName: "Sam",
                lastName: "Taylor",
            },
            profilePhoto: "https://example.com/sam.jpg",
            authProvider: "google",
        };
        userModel.findOne.mockResolvedValue(null);
        userModel.create.mockResolvedValue(newUser);
        const response = createResponse();

        await authController.googleAuthCallBack(
            { user: googleProfile },
            response
        );

        expect(userModel.create).toHaveBeenCalledWith({
            email: "sam@example.com",
            googleId: "google-user-id",
            fullName: {
                firstName: "Sam",
                lastName: "Taylor",
            },
            profilePhoto: "https://example.com/sam.jpg",
            authProvider: "google",
        });
        expect(response.redirect).toHaveBeenCalledWith(expect.any(String));
        expect(response.cookie).toHaveBeenCalledTimes(2);
    });
});