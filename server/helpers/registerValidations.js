const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .message(
      "Password must contain at least one number and one special character"
    )
    .required(),
  phone: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .message(
      "Password must contain at least one number, and one special character"
    )
    .required(),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Confirm password must match the new password",
  }),
});


module.exports = { registerSchema, changePasswordSchema };