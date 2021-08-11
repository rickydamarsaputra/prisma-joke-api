require("dotenv").config();
const express = require("express");

const userRoute = require("./routes/user.router");
const jokeRoute = require("./routes/joke.router");

const authMiddelware = require("./middelware/auth.middelware");

const app = express();
const PORT = process.env.APP_PORT || 3000;

// use middelware
app.use(express.json());
// app.use("/api/joke", authMiddelware.checkUserAuthorization);

// routers
app.use("/api/auth/user", userRoute);
app.use("/api/joke", jokeRoute);
app.use("*", (req, res) => {
	res.status(404).json({
		statusCode: 404,
		message: "endpoint does't exist",
	});
});

app.listen(PORT, () => console.log(`server run on port ${PORT}`));
