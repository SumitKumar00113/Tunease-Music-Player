const { body, validationResult } = require("express-validator");




const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()
        })
    }
    next()
}

const validateRegisterUser = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("mobileNo")
        .notEmpty()
        .withMessage("Mobile number is required")
        .isNumeric()
        .withMessage("Mobile number must contain only numbers")
        .isLength({ min: 10, max: 10 })
        .withMessage("Mobile number must be 10 digits"),

    body("fullName.firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2 })
        .withMessage("First name must be at least 2 characters"),

    body("fullName.lastName")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Last name must be at least 2 characters"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    validate
];
// ==================== LOGIN ==================== 
const validateLoginUser = [body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email"), body("password").notEmpty().withMessage("Password is required"), validate];

module.exports = { validateRegisterUser, validateLoginUser }
