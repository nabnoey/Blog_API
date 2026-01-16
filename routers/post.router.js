const express = require("express");
const router = express.Router();
const PostModel = require("../models/Post");
const postController = require("../controllers/post.controller");
const authJwt = require("../middleware/authJWT.middleware");
// const { upload, uploadToFirebase } = require("../middleware/file.middleware");

const {
  upload,
  uploadToSupabase,
} = require("../middleware/supabase.middleware");

router.post(
  "",
  upload,
  uploadToSupabase,
  authJwt.verifyToken,
  postController.createPost
);
router.get("/", postController.getAllPost);
router.get("/:id", postController.getById);
router.get("/author/:id", postController.getAuthorById);
router.put("/:id", authJwt.verifyToken, postController.updatePost);
router.delete("/post/:id", authJwt.verifyToken, postController.deletePost);
module.exports = router;
