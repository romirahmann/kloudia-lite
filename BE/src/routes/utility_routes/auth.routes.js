var express = require("express");
var router = express.Router();

const AuthController = require("../../controllers/auth_controller/AuthController");

router.post("/login", AuthController.login);

module.exports = router;
