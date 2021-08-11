const { PrismaClient } = require("@prisma/client");
const formatMessage = require("./format.message.controller");

const { joke } = new PrismaClient();

module.exports.getAllJoke = async (req, res) => {
	const jokes = await joke.findMany({
		select: {
			text: true,
			created_at: true,
			creator: {
				select: {
					username: true,
				},
			},
		},
	});

	res.status(200).json(formatMessage.successMessage(200, jokes));
};
