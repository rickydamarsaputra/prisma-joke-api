const router = require("express").Router();
const jokeController = require("../controllers/joke.controller");

router.get("/", jokeController.getAllJoke);

module.exports = router;
