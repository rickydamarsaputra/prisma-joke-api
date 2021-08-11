require("dotenv").config();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const formatMessage = require("../controllers/format.message.controller");

const { user } = new PrismaClient();

module.exports.checkUserAuthorization = (req, res, next) => {
	try {
		const bearerToken = req.headers.authorization.split(" ")[1];
		jwt.verify(bearerToken, process.env.APP_JWT_SECRET, async (err, decoded) => {
			if (err) {
				res.status(401).json(formatMessage.errorMessage(401, "not authorized with jwt!"));
			} else {
				const currentUser = await user.findUnique({
					where: {
						id: decoded.id,
					},
				});
				if (!currentUser) {
					res.status(401).json(formatMessage.errorMessage(401, "not authorized with jwt!"));
				} else {
					next();
				}
			}
		});
	} catch (err) {
		res.status(401).json(formatMessage.errorMessage(401, "not authorized with jwt!"));
	}
};
