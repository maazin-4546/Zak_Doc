const Joi = require("joi");

const registerSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8) // Minimum 8 characters
    .max(30) // Maximum 30 characters
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .message(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("Phone number must be exactly 10 digits")
    .required(),
});

module.exports = registerSchema;