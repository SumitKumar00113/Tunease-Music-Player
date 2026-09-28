process.env.JWT_ACCESS_TOKEN_SECRET_KEY =
    "test-access-token-secret-for-errors";
process.env.JWT_REFRESH_TOKEN_SECRET_KEY =
    "test-refresh-token-secret-for-errors";
process.env.DOTENV_CONFIG_QUIET = "true";

jest.doMock("../model/user.model.js", () => ({
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
}));

const authController = require("../controller/auth.controller");
const tokenMiddleware = require("../middlewares/token.middleware");

const createResponse = () => {
    const response = {
        status: jest.fn(),
        json: jest.fn(),
    };
    response.status.mockReturnValue(response);
    response.json.mockReturnValue(response);
    return response;
};

describe("auth error handling", () => {
    it("returns 500 when clearing a logout cookie throws", async () => {
        const response = createResponse();
        response.clearCookie = jest.fn(() => {
            throw new Error("cookie operation failed");
        });

        await authController.logoutUser({}, response);

        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({
            message: "internal server error",
        });
    });

    it("returns 500 when access-token request context throws", async () => {
        const request = {};
        Object.defineProperty(request, "headers", {
            get() {
                throw new Error("request context unavailable");
            },
        });
        const response = createResponse();
        const next = jest.fn();

        await tokenMiddleware.accessTokenValidate(
            request,
            response,
            next
        );

        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({
            success: false,
            message: "Internal server error",
            error: "request context unavailable",
        });
        expect(next).not.toHaveBeenCalled();
    });
});
