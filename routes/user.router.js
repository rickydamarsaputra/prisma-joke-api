const router = require("express").Router();
const userController = require("../controllers/user.controller");

// router.get("/", userController.getAllUser);
router.post("/signup", userController.signupUser);
router.post("/signin", userController.signinUser);

module.exports = router;
