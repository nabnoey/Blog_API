const PostModel = require("../models/Post");
const { post } = require("../routers/user.router");

exports.createPost = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const { title, summary, content } = req.body;
  const authorId = req.authorId;

  if (!title || !summary || !content) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const exist = await PostModel.findOne({ title });
  if (exist) {
    return res.status(400).send({ message: "Post already exists" });
  }
  try {
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: req.file.supabaseUrl,
      author: authorId,
    });

    if (!postDoc) {
      res.status(404).send({ message: "Cannot create Post" });
    }

    res.status(201).json({
      message: "Activity created Successfull!!",
      date: postDoc,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPost = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    if (!posts) {
      return res.status(404).send({ message: "ไม่พบจ้า" });
    }
    res.send(posts);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
exports.getById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "Post id is missing",
    });
  }

  try {
    const post = await PostModel.findById(id)
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);

    if (!post) {
      return res.status(404).send({
        message: "Post Not Found!!",
      });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send({
      message: "",
    });
  }
};

exports.getAuthorById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "Post id is missing",
    });
  }

  try {
    const post = await PostModel.find({ author: id })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);

    if (!post) {
      return res.status(404).send({
        message: "Post Not Found!!",
      });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  const authorId = req.authorId;

  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "Post id is missing",
    });
  }

  try {
    const { title, summary, content, cover } = req.body;
    if (!title || !summary || !content || !cover) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const postDoc = await PostModel.findOne({ _id: id, author: authorId });
    if (!postDoc) {
      return res
        .status(404)
        .send({ message: "Post with this author id is not found!" });
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = cover;

    await postDoc.save();
    res.send({ message: "Update Successfully!!" });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const authorId = req.authorId;

  if (!id) {
    return res.status(400).send({
      message: "Post id is missing",
    });
  }

  try {
    const postDoc = await PostModel.findOneAndDelete({
      _id: id,
      author: authorId,
    });
    if (!postDoc) {
      return res.status(404).send({ message: "Cannot Delete this Post!!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed Delete Post!" });
  }
};
