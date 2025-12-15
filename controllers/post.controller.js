const PostModel = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { title, summary, content, cover, author, createAt } = req.body;

    if (!title || !summary || !content || !cover || !author || !createAt) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const exist = await PostModel.findOne({ title });
    if (exist) {
      return res.status(400).send({ message: "Activity already exists" });
    }

    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover,
      author,
      createAt,
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
      .sort({ createAt: -1 })
      .limit(20);
    if (!posts) {
      return res.status(404).send({ message: "ไม่พบจ้า" });
    }
    res.send(posts);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
