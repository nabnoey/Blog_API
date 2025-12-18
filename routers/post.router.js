const express = require("express");
const router = express.Router();
const PostModel = require("../models/Post");
const postController = require("../controllers/post.controller");
const authJwt = require("../middleware/authJWT.middleware");

router.post("/post/createPost", authJwt.verifyToken, postController.createPost);
router.get("/", postController.getAllPost);
router.get("/post/:id", postController.getById);
router.get("/author/:id", postController.getAuthorById);
router.put("/:id", authJwt.verifyToken, postController.updatePost);
router.delete("/post/:id", authJwt.verifyToken, postController.deletePost);
module.exports = router;
