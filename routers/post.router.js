const express = require("express");
const router = express.Router();
const PortModel = require("../models/Post");
const postController = require("../controllers/post.controller");

router.post("/createpost", postController.createPost);
