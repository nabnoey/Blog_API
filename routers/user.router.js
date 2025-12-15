const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const userController = require("../controllers/user.controller");

// http://localhost:5000/api/v1/user/register
router.post("/user/register", userController.register);
router.post("/user/login", userController.login);

module.exports = router;
