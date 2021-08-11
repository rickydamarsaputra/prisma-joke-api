require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { userSignupValidationSchema, userSigninValidationSchema } = require("../validations/user.validation");
const formatMessage = require("./format.message.controller");

const { user } = new PrismaClient();

const handleError = (error) => {
	return error.details.map((err) => {
		return {
			field: err.context.label,
			message: err.message,
		};
	});
};

module.exports.getAllUser = async (req, res) => {
	const users = await user.findMany({
		select: {
			name: true,
			jokes: {
				select: {
					text: true,
				},
			},
		},
	});

	res.status(200).json({
		statusCode: 200,
		data: users,
	});
};

module.exports.signupUser = async (req, res) => {
	const { username, email, password } = req.body;
	const { error } = userSignupValidationSchema.validate({ username, email, password });

	if (error) {
		const errors = handleError(error);
		res.status(400).json(formatMessage.errorValidation(400, errors));
	}

	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(password, salt);

	try {
		const userCreate = await user.create({
			data: {
				username,
				email,
				password: hashPassword,
			},
			select: {
				username: true,
				email: true,
				password: true,
			},
		});

		res.status(201).json(formatMessage.successMessage(201, userCreate));
	} catch (err) {
		const errorMessage = err.code == "P2002" ? "the user with the email is already registered!" : err.message;
		res.status(400).json(formatMessage.errorMessage(400, errorMessage));
	}
};

module.exports.signinUser = async (req, res) => {
	const { email, password } = req.body;
	const { error } = userSigninValidationSchema.validate({ email, password });

	if (error) {
		const errors = handleError(error);
		res.status(400).json(formatMessage.errorValidation(400, errors));
	}

	const userLogin = await user.findUnique({
		where: {
			email,
		},
		select: {
			id: true,
			username: true,
			email: true,
			password: true,
		},
	});

	if (!userLogin) {
		res.status(404).json(formatMessage.errorMessage(404, "the user with the email was not found!"));
	} else {
		const checkPassword = await bcrypt.compare(password, userLogin.password);
		if (!checkPassword) {
			res.status(400).json(formatMessage.errorMessage(404, "the password you entered is wrong!"));
		} else {
			const jwtToken = jwt.sign({ id: userLogin.id }, process.env.APP_JWT_SECRET);
			res.status(200).json(formatMessage.successMessage(200, { ...userLogin, jwt: jwtToken }));
		}
	}
};
