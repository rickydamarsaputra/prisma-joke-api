const Joi = require("joi");

module.exports.userSignupValidationSchema = Joi.object({
	username: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(5).required(),
}).options({ abortEarly: false });

module.exports.userSigninValidationSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(5).required(),
}).options({ abortEarly: false });
